#include <iostream>

int main() {
    int sum = {};

    for (auto i{1uz}; i <= 10; ++i) {
        sum += i;
    }
    std::cout << "Sum of 1 to 10 inclusive is " << sum << std::endl;
    return 0;
}
