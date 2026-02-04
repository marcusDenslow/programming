#include <iostream>
#include <vector>

void printVector(const std::vector<int>& vec) {
    if (vec.empty()) {
        std::cerr << "Vec cannot be 0 or less in size" << std::endl;
        return;
    }

    for (const auto& element : vec) {
        std::cout << element << std::endl;
    }
}

int main() {
    std::vector<int> vector = {};

    printVector(vector);
    return 0;
}
