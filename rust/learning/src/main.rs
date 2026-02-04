// #[derive(Debug)]
// enum UsState {
//     Alabama,
//     Alaska,
// }
// enum Coin {
//     Penny,
//     Nickel,
//     Dime,
//     Quarter(UsState),
// }
//
// fn value_in_coins(coin: Coin) -> u8 {
//     match coin {
//         Coin::Penny => {
//             println!("hello!");
//             1
//         }
//         Coin::Nickel => 5,
//         Coin::Dime => 10,
//         Coin::Quarter(state) => {
//             println!("State quarter from {state:?}!");
//             25
//         }
//     }
// }
//
//
// fn main() {
//     println!("{}", value_in_coins(Coin::Penny));
//     println!("{}", value_in_coins(Coin::Nickel));
//     println!("{}", value_in_coins(Coin::Dime));
//     println!("{}", value_in_coins(Coin::Quarter(UsState::Alabama)));
//     println!("{}", value_in_coins(Coin::Quarter(UsState::Alaska)));
// }

fn main() {
    fn plus_one(x: Option<i32>) -> Option<i32> {
        x.map(|i| i + 1)
    }

    let five = Some(5);
    let six = plus_one(five);
    let none = plus_one(None);

    println!("{:?}{:?}{:?}", five, six, none)
}
