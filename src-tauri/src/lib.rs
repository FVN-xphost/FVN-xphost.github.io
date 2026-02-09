// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
pub mod util;
use rusqlite::*;
use util::*;

#[tauri::command]
fn get_all_data(gallery_count: i32, save_count: i32, branch_count: i32) -> Option<String> {
    let mut conn = Connection::open(path_join!(HOME_DIR.get().unwrap(), "data.db")).ok()?;
    let mut result = serde_json::Map::new();
    // 新增画廊数据库表
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
    // 为画廊数据库表塞入 gallery_count 个数据，每个数据有 0 和 1 两种状态！
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
    // 查询所有的画廊数据，如果为 1 则开启，否则锁定！
    {
        let mut stmt = conn.prepare("SELECT * FROM galleryLock").ok()?;
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
    // 新建存档元数据对象表（当前只新增五个元数据：
    // 第一个是玩家名称，
    // 第二个是是否存档，
    // 第三个是更新日期，
    // 第四个是备注，
    // 第五个是当前进度。后续所有的分支全部转入下方自主实现！）
    conn.execute(
        r#"
CREATE TABLE IF NOT EXISTS saveInstance(
    id INTEGER PRIMARY KEY,
    name TEXT,
    saved INTEGER NOT NULL,
    update_time TEXT,
    remark TEXT,
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
                "INSERT OR IGNORE INTO saveInstance (id, saved) VALUES (?1, 0)",
                params![&i],
            )
            .ok()?;
        }
        tx.commit().ok()?;
    }
    // 以下是添加或者减少 branch 字段，以适配 branch_count 参数！
    {
        let mut branches = Vec::new();
        let mut stmt = conn.prepare("PRAGMA table_info(saveInstance)").ok()?;
        let rows = stmt
            .query_map([], |row| Ok(row.get::<_, String>(1)?))
            .ok()?;
        for row in rows {
            let branch_name = row.ok()?;
            if branch_name.starts_with("branch") {
                branches.push(branch_name)
            }
        }
        for i in 1..=branch_count {
            let column_name = format!("branch{}", i);
            if !branches.contains(&column_name) {
                let sql = format!(
                    "ALTER TABLE saveInstance ADD COLUMN {} TEXT NOT NULL DEFAULT ''",
                    column_name
                );
                conn.execute(&sql, []).ok()?;
            }
        }
        for column_name in &branches {
            if let Some(col_num) = column_name.strip_prefix("branch") {
                if let Ok(num) = col_num.parse::<u32>() {
                    if num > branch_count as u32 {
                        let sql = format!("ALTER TABLE saveInstance DROP COLUMN {}", column_name);
                        conn.execute(&sql, []).ok()?;
                    }
                }
            }
        }
    }
    // 以下开始查询存档元数据分步并读取进 JSON！
    {
        let mut stmt = conn.prepare("SELECT * FROM saveInstance").ok()?;
        let rows = stmt
            .query_map([], |row| {
                let id: i32 = row.get(0)?;
                let name: Option<String> = row.get(1)?;
                let saved: i32 = row.get(2)?;
                let update_time: Option<String> = row.get(3)?;
                let remark: Option<String> = row.get(4)?;
                let current: i32 = row.get(5)?;
                let mut branches = std::collections::HashMap::new();
                for i in 6..(branch_count + 6) {
                    if let Ok(value) = row.get::<_, String>(i as usize) {
                        branches.insert(format!("branch{}", i - 5), value);
                    }
                }
                Ok((id, name, saved, update_time, remark, current, branches))
            })
            .ok()?;
        let mut saves = serde_json::Map::new();
        for row in rows {
            let (id, name, saved, update_time, remark, current, branches) = row.ok()?;
            let mut save = serde_json::Map::new();
            save.insert(
                "name".to_string(),
                serde_json::json!(name.unwrap_or_default()),
            );
            save.insert("saved".to_string(), serde_json::json!(saved));
            save.insert(
                "updateTime".to_string(),
                serde_json::json!(update_time.unwrap_or_default()),
            );
            save.insert(
                "remark".to_string(),
                serde_json::json!(remark.unwrap_or_default()),
            );
            save.insert("current".to_string(), serde_json::json!(current));
            for (key, value) in branches {
                save.insert(key, serde_json::json!(value));
            }
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
    name: String,
    current: i32,
    branches: Vec<String>,
) -> Option<()> {
    let conn = Connection::open(path_join!(HOME_DIR.get().unwrap(), "data.db")).ok()?;
    let mut branch_temp = String::new();
    let mut params: Vec<Box<dyn rusqlite::ToSql>> = vec![
        Box::new(name.clone()),
        Box::new(update_time.clone()),
        Box::new(current),
        Box::new(id),
    ];
    for (i, branch_value) in branches.iter().enumerate() {
        branch_temp.push_str(&format!(", branch{} = ?{}", i + 1, i + 5));
        params.push(Box::new(branch_value.clone()));
    }
    let sql = format!(
        "UPDATE saveInstance SET name = ?1, saved = 1, update_time = ?2, remark = '', current = ?3{} WHERE id = ?4",
        branch_temp
    );
    let params_refs: Vec<&dyn rusqlite::ToSql> = params.iter().map(|p| &**p).collect();
    conn.execute(&sql, &*params_refs).ok()?;
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
