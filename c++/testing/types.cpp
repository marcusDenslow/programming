#include <iostream>
#include <typeinfo>
#include <vector>

int main() {
    int x = 42;
    auto y = 3.14;

    std::cout << typeid(x).name() << std::endl; // prints implementation-specific name
    std::cout << typeid(y).name() << std::endl;
    std::cout << typeid(decltype(x)).name() << std::endl;

    std::cout << typeid('a').name() << std::endl;
    std::cout << typeid(L'a').name() << std::endl;
    std::cout << typeid("a").name() << std::endl;
    std::cout << typeid(10).name() << std::endl;
    std::cout << typeid(10L).name() << std::endl;
}
