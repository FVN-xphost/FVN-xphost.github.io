use std::{io::Write, sync::OnceLock};
use dirs;
use rusqlite::*;
use crate::MapEntity;
pub static HOME_DIR: OnceLock<String> = OnceLock::new();
pub fn init_home_dir() {
    let _ = HOME_DIR.get_or_init(|| {
        match dirs::home_dir() {
            Some(path) => {
                let home_dir = path.display();
                #[cfg(target_os = "windows")]
                let config_file = format!("{}\\AppData\\Roaming\\AWakeOfRuin", home_dir);
                #[cfg(target_os = "macos")]
                let config_file = format!(
                    "{}/Library/Application Support/AWakeOfRuin",
                    home_dir
                );
                #[cfg(target_os = "linux")]
                let config_file = format!("{}/.AWakeOfRuin", home_dir);
                #[cfg(target_os = "android")]
                let config_file = format!("/storage/emulated/0/.AWakeOfRuin");
                config_file 
            },
            None => {
                // eprintln!("Error: Could not determine home directory");
                std::process::exit(1);
            }
        }
    });
}
pub fn set_file(path: &str, content: String) -> Result<(), std::io::Error> {
    let p = std::path::Path::new(path);
    // if p.exists() && p.is_file() {
    //     return Ok(());
    // }
    let parent = p.parent();
    if let Some(parent) = parent {
        if !parent.exists() || !parent.is_dir() {
            std::fs::create_dir_all(parent)?;
        }
    }
    let mut file = std::fs::File::create(path)?;
    return file.write_all(content.as_bytes())
}
pub fn get_file(path: &str) -> Result<String, std::io::Error> {
    if std::path::Path::new(path).exists() {
        return std::fs::read_to_string(path)
    }else{
        init_config_file();
        return std::fs::read_to_string(path)
    }
}
pub fn create_dir(path: &str) -> bool {
    let p = std::path::Path::new(path);
    if !p.exists() || !p.is_dir() {
        if let Err(_) = std::fs::create_dir_all(p) {
            return false;
        }
    }
    return true;
}
#[macro_export]
macro_rules! path_join {
    ($($part:expr),*) => {{
        let mut path_buf = std::path::PathBuf::new();
        $(path_buf.push($part);)*
        path_buf.to_string_lossy().to_string()
    }};
}
pub fn init_config_file() {
    let config_path = path_join!(HOME_DIR.get().unwrap(), "config.json");
    // set_file(&config_file, r#"{"version": 1, "entities": []}"#.to_string()).ok();
    let config_file = std::path::Path::new(config_path.as_str());
    if !config_file.exists() {
        let mut s = String::new();
        for n in 1..=100 {
            s.push_str((",\n    \"map".to_owned() + n.to_string().as_str() + r#"":{
        "image": "",
        "name": "",
        "description": "",
        "saved": false
    }"#).as_str())
        }
        let _ = set_file(config_path.as_str(), (r#"{        
    "patch": false,
    "volume": 100,
    "language": "zh_cn""#.to_owned() + s.as_str() + "\n}").to_string()).expect("Cannot create Config File in AppData!");
    }
}
pub fn set_sqlite_map_file(index: i32, content: MapEntity) {
    let conn = Connection::open(path_join!(HOME_DIR.get().unwrap(), "maps", format!("{}.db", index))).unwrap();
}
pub fn get_sqlite_map_file(index: i32) -> Option<String> {
    let conn = Connection::open(path_join!(HOME_DIR.get().unwrap(), "maps", format!("{}.db", index))).unwrap();
    None
}