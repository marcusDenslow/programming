#include <stdlib.h>
#include "../../include/containers/vector.h"

Vector *create_vector() {
  Vector *vector = (Vector *)malloc(sizeof(Vector));
  vector->capacity = 4;
  vector->total = 0;
  vector->items = malloc(sizeof(void *) * vector->capacity);
  return vector;
}

void add(Vector *vector, void *item) {
  if (vector->total == vector->capacity) {
    vector->capacity *= 2;
    vector->items = realloc(vector->items, sizeof(void *) * vector->capacity);
  }
  vector->items[vector->total++] = item;
}

void *get(Vector *vector, int index) {
  if (index < 0 || index >= vector->total)
    return NULL;
  return vector->items[index];
}

void remove_last(Vector *vector) {
  if (vector->total > 0) {
    --vector->total;
  }
}
