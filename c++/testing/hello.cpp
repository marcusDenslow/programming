#include <iostream>

int main() {
    int x{1};
    std::cout << "hello world" << std::endl;
    std::cout << "something" << std::endl;
    std::cout << x << std::endl;
    std::cout << "something" << std::endl;
    std::cout << "somethihng" << std::endl;
    std::cout << x << std::endl;

    int cap{10uz};

    for (auto i{0uz}; i <= cap; ++i) {
        std::cout << i << std::endl;
        std::cout << "hello world" << std::endl;
    }
    return 0;
}
