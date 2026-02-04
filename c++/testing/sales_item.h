#ifndef SALES_ITEM_H
#define SALES_ITEM_H
#include <iostream>
#include <string>

class Sales_item {
  public:
    // Default constructor
    Sales_item() : units_sold(0), revenue(0.0) {}

    // Member function to get ISBN
    std::string isbn() const {
        return bookNo;
    }

    // Friend functions for I/O operators
    friend std::istream& operator>>(std::istream& in, Sales_item& s);
    friend std::ostream& operator<<(std::ostream& out, const Sales_item& s);

    // Friend function for addition
    friend Sales_item operator+(const Sales_item& lhs, const Sales_item& rhs);

  private:
    std::string bookNo;  // ISBN number
    unsigned units_sold; // Number of copies sold
    double revenue;      // Total revenue
};

// Input operator: reads ISBN, number of copies sold, and price
inline std::istream& operator>>(std::istream& in, Sales_item& s) {
    double price;
    in >> s.bookNo >> s.units_sold >> price;
    s.revenue = s.units_sold * price;
    return in;
}

// Output operator: prints ISBN, units sold, revenue, and average price
inline std::ostream& operator<<(std::ostream& out, const Sales_item& s) {
    out << s.bookNo << " " << s.units_sold << " " << s.revenue << " ";
    if (s.units_sold != 0)
        out << s.revenue / s.units_sold;
    else
        out << 0;
    return out;
}

// Addition operator: adds two Sales_item objects with the same ISBN
inline Sales_item operator+(const Sales_item& lhs, const Sales_item& rhs) {
    Sales_item result;
    result.bookNo = lhs.bookNo;
    result.units_sold = lhs.units_sold + rhs.units_sold;
    result.revenue = lhs.revenue + rhs.revenue;
    return result;
}

#endif
