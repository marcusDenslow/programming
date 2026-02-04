#include <iostream>
/*
 * Simple main function:
 * Read two numbers and write their sum
 */

int main() {
    std::cout << "hello world" << std::endl;

    // Initialize the variables
    int v1, v2;

    // Prompt the user to enter two numbers
    std::cout << "Enter two integers to be multiplied: " << std::endl;
    std::cin >> v1 >> v2; // read input and pass them to v1 and v2

    // print the product
    std::cout << "the product of " << v1 << " and " << v2 << " is: " << v1 * v2 << std::endl;

    // return success
    return 0;
}
