// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
pub mod util;
use rusqlite::*;
use util::*;
#[tauri::command]
fn get_all_data(gallery_count: i32, save_count: i32) -> Option<String> {
    let mut conn = Connection::open(path_join!(HOME_DIR.get().unwrap(), "data.db")).ok()?;
    let mut result = serde_json::Map::new();
    conn.execute(r#"
CREATE TABLE IF NOT EXISTS galleryLock(
    id INTEGER PRIMARY KEY,
    lock INTEGER NOT NULL DEFAULT 0
)
"#, []).ok()?;
    {
        let tx1 = conn.transaction().ok()?;
        for i in 1..=gallery_count {
            tx1.execute(
                "INSERT OR IGNORE INTO galleryLock (id, lock) VALUES (?1, 0)",
                params![&i],
            ).ok()?;
        }
        tx1.commit().ok()?;
    }
    {
        let mut stmt = conn.prepare(
            "SELECT id, lock FROM galleryLock"
        ).ok()?;

        let rows = stmt.query_map([], |row| {
            Ok((
                row.get::<_, i32>(0)?,
                row.get::<_, i32>(1)?,
            ))
        }).ok()?;
        let mut gallery = serde_json::Map::new();
        for row in rows {
            let (id, value) = row.ok()?;
            gallery.insert(format!("gallery{}", id.clone()), serde_json::json!(value == 1));
        }
        result.insert("gallery".to_string(), serde_json::Value::Object(gallery.clone()));
    }
    conn.execute(r#"
CREATE TABLE IF NOT EXISTS saveObject(
    id INTEGER PRIMARY KEY,
    saved INTEGER NOT NULL,
    image TEXT,
    update_time TEXT,
    remark TEXT
)
"#, []).ok()?;
    {
        let tx2 = conn.transaction().ok()?;
        for i in 1..=save_count {
            tx2.execute(
                "INSERT OR IGNORE INTO saveObject (id, saved) VALUES (?1, 0)",
                params![&i],
            ).ok()?;
        }
        tx2.commit().ok()?;
    }
    {
        let mut stmt = conn.prepare(
            "SELECT * FROM saveObject"
        ).ok()?;
        let rows = stmt.query_map([], |row| {
            Ok((
                row.get::<_, i32>(0)?,
                row.get::<_, i32>(1)?,
                row.get::<_, Option<String>>(2)?,
                row.get::<_, Option<String>>(3)?,
                row.get::<_, Option<String>>(4)?,
            ))
        }).ok()?;
        let mut saves = serde_json::Map::new();
        for row in rows {
            let (id, saved, image, update_time, remark) = row.ok()?;
            if saved == 1 {
                let mut save = serde_json::Map::new();
                save.insert("image".to_string(), serde_json::json!(image.unwrap()));
                save.insert("updateTime".to_string(), serde_json::json!(update_time.unwrap()));
                save.insert("remark".to_string(), serde_json::json!(remark.unwrap()));
                saves.insert(format!("save{}", id), serde_json::Value::Object(save.clone()));
            }else{
                saves.insert(format!("save{}", id), serde_json::json!({}));
            }
        }
        result.insert("saves".to_string(), serde_json::Value::Object(saves.clone()));
    }
    let json_value = serde_json::Value::Object(result);
    Some(json_value.to_string())
}
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    init_home_dir();
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![get_all_data])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
