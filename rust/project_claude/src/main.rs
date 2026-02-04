use anyhow::{Context, Result};
use colored::*;
use rustyline::completion::{Completer, FilenameCompleter, Pair};
use rustyline::error::ReadlineError;
use rustyline::highlight::Highlighter;
use rustyline::hint::Hinter;
use rustyline::validate::Validator;
use rustyline::{CompletionType, Config, Editor, Helper};
use std::env;
use std::fs;
use std::path::{Path, PathBuf};

// Built-in commands that our shell supports
const BUILTIN_COMMANDS: &[&str] = &["cd", "pwd", "ls", "cat", "echo", "exit", "help"];

// Custom completer that handles both commands and file paths
struct ShellCompleter {
    file_completer: FilenameCompleter,
    last_line: std::sync::Mutex<String>,
    cycle_index: std::sync::Mutex<usize>,
    completion_count: std::sync::Mutex<usize>,
}

impl ShellCompleter {
    fn new() -> Self {
        ShellCompleter {
            file_completer: FilenameCompleter::new(),
            last_line: std::sync::Mutex::new(String::new()),
            cycle_index: std::sync::Mutex::new(0),
            completion_count: std::sync::Mutex::new(0),
        }
    }

    fn format_completions(&self, matches: &[Pair], line: &str) {
        if matches.len() <= 1 {
            return;
        }

        // Check if this is the same line or a new completion request
        let mut last_line = self.last_line.lock().unwrap();
        let mut cycle_index = self.cycle_index.lock().unwrap();
        let mut completion_count = self.completion_count.lock().unwrap();

        let is_same_line = *last_line == line;

        if !is_same_line {
            // New completion request
            *last_line = line.to_string();
            *cycle_index = 0;
            *completion_count = 0;
        } else {
            // Same line - user pressed TAB again
            *completion_count += 1;
            if *completion_count > 1 {
                *cycle_index = (*cycle_index + 1) % matches.len();
            }
        }

        // Clear previous display by moving up and clearing lines
        if *completion_count > 1 && is_same_line {
            // Calculate how many lines were in the previous display
            let term_width = 80;
            let max_len = matches.iter()
                .map(|p| p.display.len())
                .max()
                .unwrap_or(10) + 2;
            let cols = (term_width / max_len).max(1);
            let rows = (matches.len() + cols - 1) / cols;

            // Move cursor up and clear the lines
            for _ in 0..(rows + 3) {
                print!("\x1b[1A"); // Move up one line
                print!("\x1b[2K"); // Clear line
            }
            print!("\r"); // Return to start of line
        }

        println!();
        println!("{}", format!("  {} matches (cycling {}/{}):", matches.len(), *cycle_index + 1, matches.len()).bright_yellow());

        // Display in a grid format with current selection highlighted
        let term_width = 80;
        let max_len = matches.iter()
            .map(|p| p.display.len())
            .max()
            .unwrap_or(10) + 2;

        let cols = (term_width / max_len).max(1);

        for (i, pair) in matches.iter().enumerate() {
            let is_selected = i == *cycle_index;

            let display = if pair.display.ends_with('/') {
                if is_selected {
                    format!("▶ {}", pair.display).on_bright_blue().black().bold().to_string()
                } else {
                    pair.display.bright_blue().bold().to_string()
                }
            } else {
                if is_selected {
                    format!("▶ {}", pair.display).on_white().black().bold().to_string()
                } else {
                    pair.display.to_string()
                }
            };

            print!("  {:<width$}", display, width = max_len + if is_selected { 10 } else { 0 });

            if (i + 1) % cols == 0 {
                println!();
            }
        }
        if matches.len() % cols != 0 {
            println!();
        }
        println!();
    }
}

impl Completer for ShellCompleter {
    type Candidate = Pair;

    fn complete(
        &self,
        line: &str,
        pos: usize,
        ctx: &rustyline::Context<'_>,
    ) -> rustyline::Result<(usize, Vec<Pair>)> {
        // If we're at the beginning of the line or just typed a command, suggest commands
        let words: Vec<&str> = line[..pos].split_whitespace().collect();

        if words.is_empty() || (words.len() == 1 && !line.ends_with(' ')) {
            // Complete command names
            let input = if words.is_empty() { "" } else { words[0] };
            let matches: Vec<Pair> = BUILTIN_COMMANDS
                .iter()
                .filter(|cmd| cmd.starts_with(input))
                .map(|cmd| Pair {
                    display: cmd.to_string(),
                    replacement: cmd.to_string(),
                })
                .collect();

            // Show visual completion list
            if matches.len() > 1 {
                self.format_completions(&matches, line);
            }

            let start = pos - input.len();
            Ok((start, matches))
        } else {
            // Complete file paths for arguments
            let result = self.file_completer.complete(line, pos, ctx)?;

            // Show visual completion list for file paths
            if result.1.len() > 1 {
                self.format_completions(&result.1, line);
            }

            Ok(result)
        }
    }
}

// Helper implementation for rustyline
struct ShellHelper {
    completer: ShellCompleter,
}

impl Completer for ShellHelper {
    type Candidate = Pair;

    fn complete(
        &self,
        line: &str,
        pos: usize,
        ctx: &rustyline::Context<'_>,
    ) -> rustyline::Result<(usize, Vec<Pair>)> {
        self.completer.complete(line, pos, ctx)
    }
}

impl Hinter for ShellHelper {
    type Hint = String;
}

impl Highlighter for ShellHelper {}
impl Validator for ShellHelper {}
impl Helper for ShellHelper {}

// Command parser
struct Command {
    name: String,
    args: Vec<String>,
}

impl Command {
    fn parse(input: &str) -> Option<Self> {
        let parts: Vec<String> = input
            .split_whitespace()
            .map(|s| s.to_string())
            .collect();

        if parts.is_empty() {
            return None;
        }

        Some(Command {
            name: parts[0].clone(),
            args: parts[1..].to_vec(),
        })
    }
}

// Shell implementation
struct Shell {
    current_dir: PathBuf,
}

impl Shell {
    fn new() -> Self {
        Shell {
            current_dir: env::current_dir().unwrap_or_else(|_| PathBuf::from("/")),
        }
    }

    fn get_prompt(&self) -> String {
        let dir = self
            .current_dir
            .to_str()
            .unwrap_or("?")
            .replace(&env::var("HOME").unwrap_or_default(), "~");
        format!("{} {} ", dir.bright_cyan(), "❯".bright_green())
    }

    fn execute(&mut self, cmd: Command) -> Result<()> {
        match cmd.name.as_str() {
            "cd" => self.cmd_cd(&cmd.args),
            "pwd" => self.cmd_pwd(),
            "ls" => self.cmd_ls(&cmd.args),
            "cat" => self.cmd_cat(&cmd.args),
            "echo" => self.cmd_echo(&cmd.args),
            "help" => self.cmd_help(),
            "exit" => std::process::exit(0),
            _ => Err(anyhow::anyhow!(
                "Command not found: {}. Type 'help' for available commands.",
                cmd.name
            )),
        }
    }

    // Change directory command
    fn cmd_cd(&mut self, args: &[String]) -> Result<()> {
        let path = if args.is_empty() {
            env::var("HOME").unwrap_or_else(|_| "/".to_string())
        } else {
            args[0].clone()
        };

        let new_dir = if path.starts_with('/') {
            PathBuf::from(&path)
        } else if path == "~" {
            PathBuf::from(env::var("HOME").unwrap_or_else(|_| "/".to_string()))
        } else if path.starts_with("~/") {
            let home = env::var("HOME").unwrap_or_else(|_| "/".to_string());
            PathBuf::from(home).join(&path[2..])
        } else {
            self.current_dir.join(&path)
        };

        let canonical = new_dir
            .canonicalize()
            .with_context(|| format!("cd: {}: No such file or directory", path))?;

        if !canonical.is_dir() {
            return Err(anyhow::anyhow!("cd: {}: Not a directory", path));
        }

        self.current_dir = canonical.clone();
        env::set_current_dir(&canonical)
            .with_context(|| format!("Failed to change directory to {}", path))?;

        Ok(())
    }

    // Print working directory command
    fn cmd_pwd(&self) -> Result<()> {
        println!("{}", self.current_dir.display());
        Ok(())
    }

    // List directory contents command
    fn cmd_ls(&self, args: &[String]) -> Result<()> {
        let path = if args.is_empty() {
            &self.current_dir
        } else {
            Path::new(&args[0])
        };

        let entries = fs::read_dir(path)
            .with_context(|| format!("ls: cannot access '{}': No such file or directory", path.display()))?;

        let mut items: Vec<_> = entries
            .filter_map(|entry| entry.ok())
            .collect();

        items.sort_by_key(|e| e.file_name());

        for entry in items {
            let name = entry.file_name();
            let name_str = name.to_string_lossy();

            if entry.path().is_dir() {
                print!("{}  ", name_str.bright_blue().bold());
            } else if is_executable(&entry.path()) {
                print!("{}  ", name_str.bright_green().bold());
            } else {
                print!("{}  ", name_str);
            }
        }
        println!();

        Ok(())
    }

    // Concatenate and display file contents
    fn cmd_cat(&self, args: &[String]) -> Result<()> {
        if args.is_empty() {
            return Err(anyhow::anyhow!("cat: missing file operand"));
        }

        for arg in args {
            let path = if Path::new(arg).is_absolute() {
                PathBuf::from(arg)
            } else {
                self.current_dir.join(arg)
            };

            let contents = fs::read_to_string(&path)
                .with_context(|| format!("cat: {}: No such file or directory", arg))?;

            print!("{}", contents);
        }

        Ok(())
    }

    // Echo command - print arguments
    fn cmd_echo(&self, args: &[String]) -> Result<()> {
        println!("{}", args.join(" "));
        Ok(())
    }

    // Help command - show available commands
    fn cmd_help(&self) -> Result<()> {
        println!("{}", "Available commands:".bright_yellow().bold());
        println!("  {}  - Change directory", "cd".bright_green());
        println!("  {}  - Print working directory", "pwd".bright_green());
        println!("  {}  - List directory contents", "ls".bright_green());
        println!("  {}  - Display file contents", "cat".bright_green());
        println!("  {}  - Print text to stdout", "echo".bright_green());
        println!("  {}  - Show this help message", "help".bright_green());
        println!("  {}  - Exit the shell", "exit".bright_green());
        println!();
        println!("{}", "Features:".bright_yellow().bold());
        println!("  - Press {} to see interactive completion list with highlighting", "TAB".bright_cyan());
        println!("  - Press {} repeatedly - watch the highlight cycle through matches", "TAB".bright_cyan());
        println!("  - Current selection shown with {} and inverted colors", "▶ arrow".bright_cyan());
        println!("  - Use {} to navigate command history", "↑/↓ arrows".bright_cyan());
        println!("  - Works for both commands and file paths");
        Ok(())
    }
}

// Helper function to check if a file is executable
fn is_executable(path: &Path) -> bool {
    #[cfg(unix)]
    {
        use std::os::unix::fs::PermissionsExt;
        if let Ok(metadata) = fs::metadata(path) {
            let permissions = metadata.permissions();
            return permissions.mode() & 0o111 != 0;
        }
    }
    false
}

fn main() -> Result<()> {
    // Print welcome banner
    println!("{}", "╔═══════════════════════════════════════╗".bright_cyan());
    println!("{}", "║   Welcome to Claude Shell v1.0       ║".bright_cyan());
    println!("{}", "║   Type 'help' for available commands ║".bright_cyan());
    println!("{}", "╚═══════════════════════════════════════╝".bright_cyan());
    println!();

    // Configure rustyline for zsh-like visual completion
    let config = Config::builder()
        .completion_type(CompletionType::Circular) // Cycle through matches with repeated TAB
        .auto_add_history(true)
        .max_history_size(1000)?
        .history_ignore_space(true)
        .completion_prompt_limit(100) // Show up to 100 completion candidates
        .edit_mode(rustyline::EditMode::Emacs) // Use Emacs-style keybindings
        .build();

    let helper = ShellHelper {
        completer: ShellCompleter::new(),
    };

    let mut rl = Editor::with_config(config)?;
    rl.set_helper(Some(helper));

    // Load history from file if it exists
    let history_file = env::var("HOME")
        .map(|h| PathBuf::from(h).join(".claude_shell_history"))
        .unwrap_or_else(|_| PathBuf::from(".claude_shell_history"));

    let _ = rl.load_history(&history_file);

    let mut shell = Shell::new();

    // Main REPL loop
    loop {
        let prompt = shell.get_prompt();

        match rl.readline(&prompt) {
            Ok(line) => {
                let line = line.trim();

                if line.is_empty() {
                    continue;
                }

                // Parse and execute command
                if let Some(cmd) = Command::parse(line) {
                    if let Err(e) = shell.execute(cmd) {
                        eprintln!("{} {}", "Error:".bright_red().bold(), e);
                    }
                }
            }
            Err(ReadlineError::Interrupted) => {
                println!("^C");
                continue;
            }
            Err(ReadlineError::Eof) => {
                println!("exit");
                break;
            }
            Err(err) => {
                eprintln!("{} {:?}", "Error:".bright_red().bold(), err);
                break;
            }
        }
    }

    // Save history to file
    let _ = rl.save_history(&history_file);

    println!("{}", "Goodbye!".bright_green());
    Ok(())
}
