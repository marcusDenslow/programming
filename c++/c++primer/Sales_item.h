#include <iostream>
#include <string>

class Sales_item {
    std::string isbn;
    int copiesSold;
    float salesPrice;
    float total = copiesSold * salesPrice;
};
