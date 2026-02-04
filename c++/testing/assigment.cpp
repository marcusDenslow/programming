#include <iostream>

int main() {
    // these is a default assigment to the maximum value the type can hold here??
    long initialized;
    int assigned = 10;

    auto something{8uz};

    std::cout << initialized << std::endl;
    std::cout << assigned << std::endl;
    std::cout << something << std::endl;
}
