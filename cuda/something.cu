#include <cstdlib>
#include <ctime>
#include <cuda/cmath>
#include <cuda_runtime_api.h>
#include <stdio.h>

__global__ void vecAdd(float* A, float* B, float* result, int vectorLength) {
    int workIndex = threadIdx.x + blockDim.x * blockIdx.x;
    if (workIndex <= vectorLength) {
        result[workIndex] = A[workIndex] + B[workIndex];
    }
}

void serialVecAdd(float* A, float* B, float* result, int vectorLength) {
    for (int i{0}; i < vectorLength; i++) {
        result[i] = A[i] + B[i];
    }
}

bool vectorApproximatelyEqual(float* A, float* B, int length, float epsilon = 0.00001) {
    for (int i{0}; i < length; i++) {
        if (fabs(A[i] - B[i]) > epsilon) {
            printf("Index %d mismatch: %f != %f", i, A[i], B[i]);
        }
    }
    return true;
}

void initArray(float* emptyVec, int length) {
    std::srand(std::time({}));
    for (int i{0}; i < length; i++) {
        emptyVec[i] = rand() / (float)RAND_MAX;
    }
}

void unifiedMemory(int vectorLength) {
    float* A = nullptr;
    float* B = nullptr;
    float* result = nullptr;
    float* comparisonResult = (float*)malloc(vectorLength * sizeof(float));

    cudaMallocManaged(&A, vectorLength * sizeof(float));
    cudaMallocManaged(&B, vectorLength * sizeof(float));
    cudaMallocManaged(&result, vectorLength * sizeof(float));

    initArray(A, vectorLength);
    initArray(B, vectorLength);

    int threads = 256;
    int blocks = cuda::ceil_div(vectorLength, threads);
    vecAdd<<<blocks, threads>>>(A, B, result, vectorLength);

    cudaDeviceSynchronize();

    serialVecAdd(A, B, comparisonResult, vectorLength);

    if (vectorApproximatelyEqual(result, comparisonResult, vectorLength)) {
        printf("Unified Memory : CPU and GPU answers match\n");
    } else {
        printf("Unified Memory : CPU and GPU answers do not match\n");
    }

    cudaFree(A);
    cudaFree(B);
    cudaFree(result);
    free(comparisonResult);
    ;
}

int main(int argc, char** argv) {
    int vectorLength = 1024;
    if (argc >= 2) {
        vectorLength = std::atoi(argv[1]);
    }
    unifiedMemory(vectorLength);
    return 0;
}
