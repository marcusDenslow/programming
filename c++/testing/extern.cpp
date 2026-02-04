#include <iostream>

int main() {
    int j;
    std::cout << j << std::endl;

    extern int i;
    i = 10;
    std::cout << i << std::endl;
}
