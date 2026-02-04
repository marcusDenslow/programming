#include <complex>
#include <iostream>
#include <vector>

void printVector(const std::vector<int>& vec) {
    if (vec.size() <= 0) {
        std::cerr << "cannot print vector of size 0";
        return;
    }

    int sum{0uz};
    for (const auto& element : vec) {
        std::cout << element << std::endl;
        sum += element;
    }
    std::cout << sum << std::endl;
}

int main() {
    int i = 10;
    int& rRefval = i;
    int* pPointerVal = &i;
    int normalInt = *pPointerVal;
    std::cout << i << std::endl;
    std::cout << rRefval << std::endl;
    std::cout << pPointerVal << std::endl;
    std::cout << normalInt << std::endl;
    return 0;
}
