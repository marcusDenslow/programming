// This is a quiz for the following sections:
// - Variables
// - Functions
// - If
//
// Mary is buying apples. The price of an apple is calculated as follows:
// - An apple costs 2 rustbucks.
// - However, if Mary buys more than 40 apples, the price of each apple in the
// entire order is reduced to only 1 rustbuck!

// TODO: Write a function that calculates the price of an order of apples given
// the quantity bought.
// fn calculate_price_of_apples(???) -> ??? { ??? }

//
// fn calculate_price_of_apples(apples: i32) -> i32 {
//     while apples > 0 {
//         if apples > 40 {
//             return apples
//         } else {
//             return apples * 2
//         }
//     }
//     0
// }


fn calculate_price_of_apples(apples: i32) -> Result<i32, String> {
    if apples < 0{
        Err("cannot buy negative apples".to_string())
    } else if apples > 40 {
        Ok(apples)
    } else {
        Ok(apples * 2)
    }
}


fn main() {
    // You can optionally experiment here.
}

// Don't change the tests!
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn verify_test() {
        assert_eq!(calculate_price_of_apples(35), Ok(70));
        assert_eq!(calculate_price_of_apples(40), Ok(80));
        assert_eq!(calculate_price_of_apples(41), Ok(41));
        assert_eq!(calculate_price_of_apples(65), Ok(65));
        assert_eq!(calculate_price_of_apples(-100), Err("cannot buy negative apples".to_string()))
    }
}
