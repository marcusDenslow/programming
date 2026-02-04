use std::{
    fs,
    io::{prelude::*, BufReader},
    net::{TcpListener, TcpStream},
    thread,
    time::Duration,
};

fn main() {
    let items = vec![10, 20, 30];
    let result = calculate_total(items);
    println!("{}", result);
    println!("{}", add(1, 2));
    println!("{}", minus(1, 2));
    let listener = TcpListener::bind("127.0.0.1:7878").unwrap();

    for stream in listener.incoming() {
        let stream = stream.unwrap();

        thread::spawn(|| {
            handle_connection(stream);
        });
    }
}

fn handle_connection(mut stream: TcpStream) {
    let buf_reader = BufReader::new(&stream);
    let request_line = buf_reader.lines().next().unwrap().unwrap();

    let (status_line, filename) = match &request_line[..] {
        "GET / HTTP/1.1" => ("HTTP/1.1 200 OK", "hello.html"),
        "GET /sleep HTTP/1.1" => {
            thread::sleep(Duration::from_secs(10));
            ("HTTP/1.1 200 OK", "hello.html")
        }
        _ => ("HTTP /1.1 404 NOT FOUND", "404.html"),
    };

    let contents = fs::read_to_string(filename).unwrap();
    let length = contents.len();

    let response = format!("{status_line}\r\nContent-Length: {length}\r\n\r\n{contents}");

    stream.write_all(response.as_bytes()).unwrap();
}

fn add(x: i32, y: i32) -> i32 {
    x + y
}

fn minus(x: i32, y: i32) -> i32 {
    x - y
}

fn calculate_total(items: Vec<i32>) -> i32 {
    let mut total = 0;
    for item in items {
        total += item;
    }
    total
}

#[cfg(test)]
mod test {
    use super::*;

    #[test]
    fn test_add() {
        assert_eq!(add(1, 2), 3);
    }

    #[test]
    fn test_minus() {
        assert_eq!(minus(2, 1), 1);
    }

    #[test]
    fn test_calc() {
        let items = vec![10, 20, 30];
        assert_eq!(calculate_total(items), 60);
    }
}
