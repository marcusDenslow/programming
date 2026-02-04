#include <iostream>

void add(unsigned int x) {
    int total = 0;
    for (auto i{0uz}; i < x; i++) {
        total = total + i;
        std::cout << i << std::endl;
    }
    std::cout << total << std::endl;
}

int main() {
    // ah alright when you initialize the variable and assign it with the value in {}
    // it cant be converted to the type specifier. that is nice, makes it avoid being
    // converted from double to int.
    int i = 3.14;
    int b = {12uz};
    std::cout << i << std::endl;
    std::cout << b << std::endl;
    add(4);
}
