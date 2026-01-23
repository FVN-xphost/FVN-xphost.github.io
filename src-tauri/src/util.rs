use std::sync::OnceLock;
use tauri::Manager;
pub static HOME_DIR: OnceLock<String> = OnceLock::new();

pub fn init_home_dir(app_handle: &tauri::AppHandle) -> Result<(), String> {
    let base_dir = app_handle
        .path()
        .app_local_data_dir()
        .map_err(|_| "Cannot get data dir!".to_string())?;
    let home_dir = base_dir.join("AWakeOfRuin");
    HOME_DIR
        .set(home_dir.to_string_lossy().to_string())
        .map_err(|_| "Cannot put all value!".to_string())?;
    Ok(())
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
