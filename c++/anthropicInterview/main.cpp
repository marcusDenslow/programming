#include <iostream>
#include <string>
#include <vector>

struct Sample {
    double ts;
    std::vector<std::string> stack;
};

struct Events {
    std::string kind;
    double ts;
    std::string name;

    void Printdebug() const {
        std::cout << "Kind :" << kind << std::endl;
        std::cout << "ts :" << ts << std::endl;
        std::cout << "name :" << name << std::endl;
        std::cout << "---" << std::endl;
    }
};

// std::vector<Events> convertToTrace(const std::vector<Sample>& samples) {
//     std::vector<Events> events;
//
//     std::vector<std::string> empty;
//
//     for (auto i{0uz}; i < samples.size(); ++i) {
//         const auto& currentStack = samples[i].stack;
//         const auto& previousStack = (i == 0) ? empty : samples[i - 1].stack;
//
//         auto [prevMismatchPos, currMismatchPos] = std::mismatch(
//             previousStack.begin(), previousStack.end(), currentStack.begin(),
//             currentStack.end());
//
//         for (auto iterator = previousStack.end(); iterator > prevMismatchPos;) {
//             --iterator;
//             events.push_back({"end", samples[i].ts, *iterator});
//         }
//
//         for (auto iterator = currMismatchPos; iterator != currentStack.end(); ++iterator) {
//             events.push_back({"start", samples[i].ts, *iterator});
//         }
//     }
//     return events;
// }

std::vector<Events> convertToTrace(const std::vector<Sample>& samples) {
    std::vector<Events> events;

    std::vector<std::string> empty;

    for (auto i{0uz}; i < samples.size(); ++i) {
        const auto& currentStack = samples[i].stack;
        const auto& previousStack = (i == 0) ? empty : samples[i - 1].stack;

        auto [prevMismatchPos, currMismatchPos] = std::mismatch(
            previousStack.begin(), previousStack.end(), currentStack.begin(), currentStack.end());

        for (auto iterator = previousStack.end(); iterator > prevMismatchPos;) {
            --iterator;
            events.push_back({"end", samples[i].ts, *iterator});
        }

        for (auto iterator = currMismatchPos; iterator != currentStack.end(); ++iterator) {
            events.push_back({"start", samples[i].ts, *iterator});
        }
    }
    return events;
}

int main() {
    Sample s1{7.5, {"main"}};
    Sample s2{9.2, {"main", "my_fn"}};
    Sample s3{10.2, {"main", "my_fn", "my_fn2"}};
    Sample s4{10.7, {"main"}};

    std::vector<Sample> samples = {s1, s2, s3, s4};

    auto events = convertToTrace(samples);

    for (const auto& c : events) {
        std::cout << c.kind << " " << c.ts << " " << c.name << "\n";
    }
}
