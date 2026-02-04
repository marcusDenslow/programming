#pragma once
#include <SDL.h>
#include <SDL_video.h>

class Window {
  public:
    Window() {
        SDLWindow = SDL_CreateWindow("hello world", SDL_WINDOWPOS_UNDEFINED,
                                     SDL_WINDOWPOS_UNDEFINED, 700, 300, SDL_WINDOW_SHOWN);
    }

    Window(const Window&) = delete;
    Window& operator=(const Window&) = delete;

    ~Window() {
        if (SDLWindow && SDL_WasInit(SDL_INIT_VIDEO)) {
            SDL_DestroyWindow(SDLWindow);
        }
    }

  private:
    SDL_Window* SDLWindow = nullptr;
};
