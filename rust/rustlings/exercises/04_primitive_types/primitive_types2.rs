// // Characters (`char`)
//
// fn main() {
//     // Note the _single_ quotes, these are different from the double quotes
//     // you've been seeing around.
//     let my_first_initial = 'C';
//     if my_first_initial.is_alphabetic() {
//         println!("Alphabetical!");
//     } else if my_first_initial.is_numeric() {
//         println!("Numerical!");
//     } else {
//         println!("Neither alphabetic nor numeric!");
//     }
//
//     // TODO: Analogous to the example before, declare a variable called `your_character`
//     // below with your favorite character.
//     // Try a letter, try a digit (in single quotes), try a special character, try a character
//     // from a different language than your own, try an emoji 😉
//     let your_character = '1';
//
//     if your_character.is_alphabetic() {
//         println!("Alphabetical!");
//     } else if your_character.is_numeric() {
//         println!("Numerical!");
//     } else {
//         println!("Neither alphabetic nor numeric!");
//     }
// }


#[derive(Debug)]
struct Rectangle {
    width: u32,
    height: u32,
}

impl Rectangle {
    fn area(&self) -> u32 {
        self.width * self.height
    }
}


fn main() {
    let rex = Rectangle {
        width: 69,
        height: 67,
    };
    println!("for the rectangle {:?} the area is {}", rex, rex.area());
    println!("{:?}", rex);
}
