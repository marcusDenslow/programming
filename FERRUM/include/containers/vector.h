#ifndef VECTOR_H
#define VECTOR_H

typedef struct {
  void **items; // Pointer to store elements
  int capacity; // Maximum capacity
  int total;    // Current number of elements
} Vector;

Vector *create_vector();
void add(Vector *vector, void *item);
void *get(Vector *vector, int index);
void remove_last(Vector *vector);

#endif // VECTOR_H
