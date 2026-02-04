#include <cstdlib>
#include <ctime>
#include <cuda/cmath>
#include <stdio.h>

__global__ void vecAdd(float* a, float* b, float* result, int vectorLength) {
    int workIndex = threadIdx.x + blockDim.x * blockIdx.x;

    if (workIndex < vectorLength) {
        result[workIndex] = a[workIndex] + b[workIndex];
    }
}

void serialVecAdd(float* a, float* b, float* result, int vectorLength) {
    for (int i{0}; i < vectorLength; i++) {
        result[i] = a[i] + b[i];
    }
}

void initVec(float* vec, int length) {
    std::srand(std::time({}));
    for (int i{0}; i < length; i++) {
        vec[i] = rand() / (float)RAND_MAX;
    }
}

bool vectorResultsApproximatelyEqual(float* A, float* B, int length, float epsilon = 0.00001) {
    for (int i{0}; i < length; i++) {
        if (fabs(A[i] - B[i]) > epsilon) {
            printf("Index %d mismatch: %f != %f", i, A[i], B[i]);
            return false;
        }
    }
    return true;
}

void unifiedMemoryExample(int vectorLength) {
    // pointers to memory vectors
    float* A = nullptr;
    float* B = nullptr;
    float* RESULT = nullptr;
    float* comparisonResult = (float*)malloc(vectorLength * sizeof(float));

    // allocate buffers shared to both host and device
    cudaMallocManaged(&A, vectorLength * sizeof(float));
    cudaMallocManaged(&B, vectorLength * sizeof(float));
    cudaMallocManaged(&RESULT, vectorLength * sizeof(float));

    initVec(A, vectorLength);
    initVec(B, vectorLength);

    int threads = 256;
    int blocks = cuda::ceil_div(vectorLength, threads);

    vecAdd<<<blocks, threads>>>(A, B, RESULT, vectorLength);
    cudaDeviceSynchronize();

    serialVecAdd(A, B, comparisonResult, vectorLength);

    if (vectorResultsApproximatelyEqual(RESULT, comparisonResult, vectorLength)) {
        printf("Unified Memory: CPU and GPU are the same\n");
    } else {
        printf("Unified Memory: Error - CPU and GPU and not the same\n");
    }

    cudaFree(A);
    cudaFree(B);
    cudaFree(RESULT);
    free(comparisonResult);
}

int main(int argc, char** argv) {
    int vectorLength = 1024;

    if (argc >= 2) {
        vectorLength = std::atoi(argv[1]);
    }
    unifiedMemoryExample(vectorLength);
    return 0;
}
// nice!!!
