#include "Window.h"
#include <SDL.h>
#include <SDL_events.h>

int main(int argc, char** argv) {
    SDL_Init(SDL_INIT_VIDEO);
    Window GameWindow;

    bool running = true;
    SDL_Event event;

    while (running) {
        while (SDL_PollEvent(&event)) {
            if (event.type == SDL_QUIT) {
                running = false;
            }
        }
        SDL_Delay(16); // ~60 FPS
    }

    SDL_Quit();
    return 0;
}
