#include <iostream>
#include <ostream>

std::string global_str;
int global_int;

int main() {
    long double ld{3.14159265362};
    // int a{ld};
    int a(ld);
    long double b{ld};
    int d = ld;

    extern int i;
    std::string local_string;
    int local_int;

    std::cout << global_str << std::endl;
    std::cout << global_int << std::endl;
    std::cout << local_int << std::endl;
    std::cout << local_string << std::endl;

    std::cout << a << std::endl;
    std::cout << b << std::endl;
    std::cout << d << std::endl;
}
