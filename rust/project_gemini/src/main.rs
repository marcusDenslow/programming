use colored::*;
// --- CRITICAL FIX: Explicitly import MACROS separately ---
use rustyline::{Helper, Hinter, Validator};
// --- CRITICAL FIX: Explicitly import TRAITS separately ---
use rustyline::completion::Completer;
use rustyline::highlight::Highlighter;

use rustyline::completion::{FilenameCompleter, Pair};
use rustyline::error::ReadlineError;
use rustyline::highlight::MatchingBracketHighlighter;
use rustyline::hint::HistoryHinter;
use rustyline::validate::MatchingBracketValidator;
use rustyline::{Context, Editor, Config};
use std::borrow::Cow;
use std::env;
use std::path::Path;
use std::process::{Command, Stdio};

// --- Helper Struct for Rustyline ---
#[derive(Helper, Validator, Hinter)]
struct ShellHelper {
    // The 'rustyline' attribute tells the derive macro which field delegates the implementation.
    
    completer: FilenameCompleter, 

    #[rustyline(Validator)]
    validator: MatchingBracketValidator,

    highlighter: MatchingBracketHighlighter,

    #[rustyline(Hinter)]
    hinter: HistoryHinter,

    colored_prompt: String,
}

// Manual implementation of Completer Trait
impl Completer for ShellHelper {
    type Candidate = Pair;

    fn complete(
        &self,
        line: &str,
        pos: usize,
        ctx: &Context<'_>,
    ) -> rustyline::Result<(usize, Vec<Pair>)> {
        self.completer.complete(line, pos, ctx)
    }
}

// Manual implementation of Highlighter Trait
impl Highlighter for ShellHelper {
    fn highlight_prompt<'b, 's: 'b, 'p: 'b>(
        &'s self,
        prompt: &'p str,
        default: bool,
    ) -> Cow<'b, str> {
        if default {
            Cow::Borrowed(&self.colored_prompt)
        } else {
            Cow::Borrowed(prompt)
        }
    }

    fn highlight_hint<'h>(&self, hint: &'h str) -> Cow<'h, str> {
        Cow::Owned(hint.dimmed().to_string())
    }
}

// --- Built-in Commands ---

fn command_cd(args: &[String]) -> Result<(), String> {
    let path = if args.is_empty() {
        home::home_dir().ok_or("Could not find home directory")?
    } else {
        Path::new(&args[0]).to_path_buf()
    };

    let final_path = if args.first().map(|s| s == "~").unwrap_or(false) {
        home::home_dir().ok_or("Could not find home directory")?
    } else {
        path
    };

    env::set_current_dir(&final_path)
        .map_err(|e| format!("cd: {}: {}", final_path.display(), e))
}

fn command_pwd() {
    match env::current_dir() {
        Ok(path) => println!("{}", path.display()),
        Err(e) => eprintln!("Error retrieving current directory: {}", e),
    }
}

// --- Main Shell Loop ---

fn main() -> rustyline::Result<()> {
    // Configuration Change: Circular Completion
    // This enables the "cycle through options" behavior on TAB.
    let config = Config::builder()
        .auto_add_history(true)
        .completion_type(rustyline::CompletionType::Circular) 
        .build();

    let h = ShellHelper {
        completer: FilenameCompleter::new(),
        highlighter: MatchingBracketHighlighter::new(),
        hinter: HistoryHinter {},
        colored_prompt: "".to_owned(),
        validator: MatchingBracketValidator::new(),
    };

    let mut rl = Editor::with_config(config)?;
    rl.set_helper(Some(h));

    if rl.load_history("history.txt").is_err() {
        println!("No previous history.");
    }

    println!("{}", "Welcome to Project Gemini Shell v2.".bold().cyan());
    println!("Type 'exit' to quit.");

    loop {
        let cwd = env::current_dir().unwrap_or_default();
        let cwd_str = cwd.file_name().unwrap_or_default().to_string_lossy();
        let prompt_fmt = format!("{} ❯ ", cwd_str).green().bold().to_string();
        
        rl.helper_mut().expect("No helper").colored_prompt = prompt_fmt.clone();

        let readline = rl.readline(&prompt_fmt);

        match readline {
            Ok(line) => {
                let line = line.trim();
                if line.is_empty() {
                    continue;
                }

                let parts = match shell_words::split(line) {
                    Ok(p) => p,
                    Err(e) => {
                        eprintln!("Parse error: {}", e);
                        continue;
                    }
                };

                if parts.is_empty() {
                    continue;
                }

                let command = &parts[0];
                let args = &parts[1..];

                match command.as_str() {
                    "cd" => {
                        if let Err(e) = command_cd(args) {
                            eprintln!("{}", e.red());
                        }
                    }
                    "pwd" => command_pwd(),
                    "exit" => {
                        println!("Goodbye!");
                        break;
                    }
                    "history" => {
                        for (i, entry) in rl.history().iter().enumerate() {
                            println!("{}: {}", i + 1, entry);
                        }
                    }
                    _ => {
                        // Removed 'mut' as it was not needed, reducing warnings
                        let child = Command::new(command)
                            .args(args)
                            .stdin(Stdio::inherit())
                            .stdout(Stdio::inherit())
                            .stderr(Stdio::inherit())
                            .spawn();

                        match child {
                            Ok(mut child) => {
                                let _ = child.wait();
                            }
                            Err(e) => {
                                eprintln!("{}: command not found or failed to start ({})", command.red(), e);
                            }
                        }
                    }
                }
            }
            Err(ReadlineError::Interrupted) => {
                println!("^C");
                continue; 
            }
            Err(ReadlineError::Eof) => {
                println!("CTRL-D");
                break;
            }
            Err(err) => {
                println!("Error: {:?}", err);
                break;
            }
        }
    }

    rl.save_history("history.txt")?;
    Ok(())
}
