fn main() {
    println!("Hello, world!");
    let bruh = add(1, 2);
    println!("{}", bruh);
}

fn add(arg1: i32, arg2: i32) -> i32 {
    arg1 + arg2
}
