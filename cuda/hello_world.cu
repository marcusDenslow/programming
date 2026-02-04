#include <__clang_cuda_runtime_wrapper.h>
#include <cstdio>
#include <cuda.h>
#include <stdio.h>
#include <vector>

// this is called a kernel and is device code
__global__ void cuda_hello() {
    printf("%d : hello CUDA world\n", threadIdx.x);
}

__global__ void vecAdd(float* A, float* B, float* C) {}

int main() {
    // Kernel invocation
    cuda_hello<<<1, 100>>>();
    cudaDeviceSynchronize();
    printf("Hello CPU world!\n");
    return 0;
}
