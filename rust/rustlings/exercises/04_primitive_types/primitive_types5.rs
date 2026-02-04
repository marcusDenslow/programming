fn main() {
    let cat = ("Furry McFurson", 3.5);
    let dick = (20, "bolla");

    // TODO: Destructure the `cat` tuple in one statement so that the println works.
    // let /* your pattern here */ = cat;

    let (name, age) = cat;
    let (size, nick) = dick;

    println!("{name} is {age} years old");
    println!("{:?}", cat);

    println!("{} is {}", nick, size);
    println!("{:?}", dick);
}
