use std::sync::OnceLock;
use dirs;
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
                create_dir(config_file.as_str());
                config_file
            },
            None => {
                // eprintln!("Error: Could not determine home directory");
                std::process::exit(1);
            }
        }
    });
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
