#include <cstdlib>
#include <ctime>
#include <cuda/cmath>
#include <cuda_runtime_api.h>
#include <memory.h>

__global__ void addVec(float* A, float* B, float* result, int vectorLength) {
    int workIndex = threadIdx.x + blockDim.x * blockIdx.x;
    if (workIndex < vectorLength) {
        result[workIndex] = A[workIndex] + B[workIndex];
    }
}

int initArray(float* emptyVector, int length) {
    std::srand(std::time({}));
    for (int i{0}; i < length; i++) {
        emptyVector[i] = rand() / (float)RAND_MAX;
    }
}

void unifiedMemExample(int vectorLength) {
    float* A = nullptr;
    float* B = nullptr;
    float* RESULT = nullptr;

    cudaMallocManaged(&A, vectorLength * sizeof(float));
    cudaMallocManaged(&B, vectorLength * sizeof(float));
    cudaMallocManaged(&RESULT, vectorLength * sizeof(float));

    initArray(A, vectorLength);
    initArray(B, vectorLength);

    int threads = 256;
    int blocks = cuda::ceil_div(vectorLength, threads);
    addVec<<<blocks, threads>>>(A, B, RESULT, vectorLength);

    cudaDeviceSynchronize();

    // cudaFree(A);
    // cudaFree(B);
    // cudaFree(RESULT);
}

int main(int argc, char** argv) {
    int vectorLength = 1024;
    if (argc >= 2) {
        vectorLength = std::atoi(argv[1]);
    }
    unifiedMemExample(vectorLength);

    return 0;
}
