cmake_minimum_required(VERSION 3.10)
project(SDL_Project)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

find_package(SDL2 REQUIRED)
include_directories(${SDL2_INCLUDE_DIRS})

add_executable(main main.cpp)
target_link_libraries(main ${SDL2_LIBRARIES})
