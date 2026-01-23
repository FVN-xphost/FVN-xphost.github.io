// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
pub mod util;
use rusqlite::*;
use util::*;

const TABLE_NAME: &str = "saveInstance";

fn fetch_all_data(conn: &Connection) -> Result<serde_json::Value> {
    todo!()
}

fn get_existing_b_columns(conn: &Connection) -> Result<std::collections::HashSet<String>> {
    let mut columns = std::collections::HashSet::new();

    let sql = format!("PRAGMA table_info({})", TABLE_NAME);
    let mut stmt = conn.prepare(&sql)?;

    let rows = stmt.query_map([], |row| Ok(row.get::<_, String>(1)?))?;

    for row in rows {
        let column_name: String = row?;
        if column_name.starts_with("branch") {
            columns.insert(column_name);
        }
    }

    Ok(columns)
}

fn update_table_structure(conn: &mut Connection, target_count: u32) -> Result<()> {
    let existing_columns = get_existing_b_columns(conn)?;

    for i in 1..=target_count {
        let column_name = format!("b{}", i);

        if !existing_columns.contains(&column_name) {
            let sql = format!(
                "ALTER TABLE {} ADD COLUMN {} TEXT NOT NULL DEFAULT ''",
                TABLE_NAME, column_name
            );
            if let Err(e) = conn.execute(&sql, []) {
                eprintln!("添加列 {} 失败（可能已存在）: {}", column_name, e);
            }
        }
    }

    let existing_b_count = existing_columns.len() as u32;
    if target_count < existing_b_count {
        migrate_table(conn, target_count)?;
    }

    Ok(())
}
fn migrate_table(conn: &mut Connection, target_count: u32) -> Result<()> {
    let transaction = conn.transaction()?;

    let temp_table = format!("{}_temp", TABLE_NAME);

    let mut columns = String::new();
    for i in 1..=target_count {
        if i > 1 {
            columns.push_str(", ");
        }
        columns.push_str(&format!("branch{} TEXT", i));
    }

    let create_sql = format!(
        "CREATE TABLE {} (id INTEGER PRIMARY KEY AUTOINCREMENT, {})",
        temp_table, columns
    );
    transaction.execute(&create_sql, [])?;
    let mut source_columns = String::new();
    let mut target_columns = String::new();

    for i in 1..=target_count {
        if i > 1 {
            source_columns.push_str(", ");
            target_columns.push_str(", ");
        }
        source_columns.push_str(&format!("branch{}", i));
        target_columns.push_str(&format!("branch{}", i));
    }

    let copy_sql = format!(
        "INSERT INTO {} (id, {}) SELECT id, {} FROM {}",
        temp_table, target_columns, source_columns, TABLE_NAME
    );
    transaction.execute(&copy_sql, [])?;
    transaction.execute(&format!("DROP TABLE {}", TABLE_NAME), [])?;
    transaction.execute(
        &format!("ALTER TABLE {} RENAME TO {}", temp_table, TABLE_NAME),
        [],
    )?;

    transaction.commit()?;
    Ok(())
}

#[tauri::command]
fn get_all_data(gallery_count: i32, save_count: i32, branch_count: i32) -> Option<String> {
    let mut conn = Connection::open(path_join!(HOME_DIR.get().unwrap(), "data.db")).ok()?;
    let mut result = serde_json::Map::new();
    conn.execute(
        r#"
CREATE TABLE IF NOT EXISTS galleryLock(
    id INTEGER PRIMARY KEY,
    lock INTEGER NOT NULL DEFAULT 0
)
"#,
        [],
    )
    .ok()?;
    {
        let tx = conn.transaction().ok()?;
        for i in 1..=gallery_count {
            tx.execute(
                "INSERT OR IGNORE INTO galleryLock (id, lock) VALUES (?1, 0)",
                params![&i],
            )
            .ok()?;
        }
        tx.commit().ok()?;
    }
    {
        let mut stmt = conn.prepare("SELECT id, lock FROM galleryLock").ok()?;

        let rows = stmt
            .query_map([], |row| Ok((row.get::<_, i32>(0)?, row.get::<_, i32>(1)?)))
            .ok()?;
        let mut gallery = serde_json::Map::new();
        for row in rows {
            let (id, value) = row.ok()?;
            gallery.insert(
                format!("gallery{}", id.clone()),
                serde_json::json!(value == 1),
            );
        }
        result.insert(
            "gallery".to_string(),
            serde_json::Value::Object(gallery.clone()),
        );
    }
    conn.execute(
        r#"
CREATE TABLE IF NOT EXISTS saveObject(
    id INTEGER PRIMARY KEY,
    saved INTEGER NOT NULL,
    image TEXT,
    update_time TEXT,
    remark TEXT
)
"#,
        [],
    )
    .ok()?;
    {
        let tx = conn.transaction().ok()?;
        for i in 1..=save_count {
            tx.execute(
                "INSERT OR IGNORE INTO saveObject (id, saved) VALUES (?1, 0)",
                params![&i],
            )
            .ok()?;
        }
        tx.commit().ok()?;
    }
    {
        let mut stmt = conn.prepare("SELECT * FROM saveObject").ok()?;
        let rows = stmt
            .query_map([], |row| {
                Ok((
                    row.get::<_, i32>(0)?,
                    row.get::<_, i32>(1)?,
                    row.get::<_, Option<String>>(2)?,
                    row.get::<_, Option<String>>(3)?,
                    row.get::<_, Option<String>>(4)?,
                ))
            })
            .ok()?;
        let mut saves = serde_json::Map::new();
        for row in rows {
            let (id, saved, image, update_time, remark) = row.ok()?;
            if saved == 1 {
                let mut save = serde_json::Map::new();
                save.insert("image".to_string(), serde_json::json!(image.unwrap()));
                save.insert(
                    "updateTime".to_string(),
                    serde_json::json!(update_time.unwrap()),
                );
                save.insert("remark".to_string(), serde_json::json!(remark.unwrap()));
                saves.insert(
                    format!("save{}", id),
                    serde_json::Value::Object(save.clone()),
                );
            } else {
                saves.insert(format!("save{}", id), serde_json::json!({}));
            }
        }
        result.insert(
            "saveObject".to_string(),
            serde_json::Value::Object(saves.clone()),
        );
    }
    conn.execute(
        r#"
CREATE TABLE IF NOT EXISTS saveInstance(
    id INTEGER PRIMARY KEY,
    name TEXT,
    current INTEGER NOT NULL DEFAULT 0
)
"#,
        [],
    )
    .ok()?;
    {
        let tx = conn.transaction().ok()?;
        for i in 1..=save_count {
            tx.execute(
                "INSERT OR IGNORE INTO saveInstance (id) VALUES (?1)",
                params![&i],
            )
            .ok()?;
        }
        tx.commit().ok()?;
    }
    update_table_structure(&mut conn, branch_count as u32).ok()?;
    {
        let mut stmt = conn.prepare("SELECT * FROM saveInstance").ok()?;
        let rows = stmt
            .query_map([], |row| {
                Ok((
                    row.get::<_, i32>(0)?,
                    row.get::<_, Option<String>>(1)?,
                    row.get::<_, i32>(2)?,
                ))
            })
            .ok()?;
        let mut saves = serde_json::Map::new();
        for row in rows {
            let (id, name, current) = row.ok()?;
            let mut save = serde_json::Map::new();
            save.insert(
                "name".to_string(),
                serde_json::json!(name.unwrap_or_default()),
            );
            save.insert("current".to_string(), serde_json::json!(current));
            saves.insert(
                format!("save{}", id),
                serde_json::Value::Object(save.clone()),
            );
        }
        result.insert(
            "saveInstance".to_string(),
            serde_json::Value::Object(saves.clone()),
        );
    }
    let json_value = serde_json::Value::Object(result);
    Some(json_value.to_string())
}
#[tauri::command]
fn update_save(
    id: String,
    update_time: String,
    image: String,
    name: String,
    current: i32,
    branch1: String,
    branch2: String,
    branch3: i32,
) -> Option<()> {
    let mut conn = Connection::open(path_join!(HOME_DIR.get().unwrap(), "data.db")).ok()?;
    {
        let tx = conn.transaction().ok()?;
        tx.execute(
            "UPDATE saveObject SET update_time = ?1, image = ?2, saved = 1, remark = '' WHERE id = ?3",
            params![&update_time, &image, &id],
        ).ok()?;
        tx.commit().ok()?;
    }
    {
        let tx = conn.transaction().ok()?;
        tx.execute(
            "UPDATE saveInstance SET name = ?1, current = ?2, branch1 = ?4, branch2 = ?5, branch3 = ?6 WHERE id = ?3",
            params![&name, &current, &id, &branch1, &branch2, &branch3],
        ).ok()?;
        tx.commit().ok()?;
    }
    Some(())
}
#[tauri::command]
fn update_gallery(id: i32) -> Option<()> {
    let mut conn = Connection::open(path_join!(HOME_DIR.get().unwrap(), "data.db")).ok()?;
    {
        let tx = conn.transaction().ok()?;
        tx.execute(
            "UPDATE galleryLock SET lock = 1 WHERE id = ?1",
            params![&id],
        )
        .ok()?;
        tx.commit().ok()?;
    }
    Some(())
}
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            let app_handle = app.handle();
            init_home_dir(&app_handle)?;
            Ok(())
        })
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            get_all_data,
            update_save,
            update_gallery
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
