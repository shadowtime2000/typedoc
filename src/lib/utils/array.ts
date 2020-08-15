import { ok as assert } from "assert";

/**
 * Inserts an item into an array sorted by order. If two items have the same order,
 * the item inserted later will be placed earlier in the array.
 * @param arr modified by inserting item.
 * @param item
 */
export function insertOrderSorted<T extends { order?: number }>(
  arr: T[],
  item: T
): T[] {
  const index = binaryFindPartition(
    arr,
    (v) => (v.order ?? 0) >= (item.order ?? 0)
  );
  arr.splice(index === -1 ? arr.length : index, 0, item);
  return arr;
}

/**
 * Performs a binary search of a given array, returning the index of the first item
 * for which `partition` returns true. Returns the -1 if there are no items in `arr`
 * such that `partition(item)` is true.
 * @param arr
 * @param partition should return true while less than the partition point.
 */
export function binaryFindPartition<T>(
  arr: readonly T[],
  partition: (item: T) => boolean
): number {
  if (arr.length === 0) {
    return -1;
  }

  let low = 0,
    high = arr.length - 1;

  while (high > low) {
    const mid = low + Math.floor((high - low) / 2);
    if (partition(arr[mid])) {
      high = mid;
    } else {
      low = mid + 1;
    }
  }

  return partition(arr[low]) ? low : -1;
}

/**
 * Removes an item from the array if the array exists and the item is included
 * within it.
 * @param arr
 * @param item
 */
export function removeIfPresent<T>(arr: T[] | undefined, item: T): void {
  if (!arr) {
    return;
  }
  const index = arr.indexOf(item);
  if (index !== -1) {
    arr.splice(index, 1);
  }
}

/**
 * Filters out duplicate values from the array. Order is preserved. Returns
 * a copy of the input array.
 */
export function uniq<T>(arr: readonly T[]): T[] {
  return Array.from(new Set(arr));
}

export type Zip<T extends any[][]> = {
  [K in keyof T]: T[K] extends Array<infer U> ? U : never;
};

/**
 * Standard zip function, expects that all arrays have the same length.
 */
export function zip<T extends any[][]>(...arrays: T): Zip<T>[] {
  const result: Zip<T>[] = [];

  const length = Math.min(...arrays.map((a) => a.length));
  assert(
    Math.max(...arrays.map((a) => a.length)) === length,
    "zip arrays do not have the same length"
  );

  for (let i = 0; i < length; i++) {
    result.push(arrays.map((a) => a[i]) as Zip<T>);
  }

  return result;
}

export async function waterfall<T, U>(
  arr: readonly T[],
  fn: (item: T) => U | Promise<U>
): Promise<U[]> {
  const result: U[] = [];
  for (const item of arr) {
    result.push(await fn(item));
  }
  return result;
}

export function filterMap<T, U>(
  arr: Iterable<T>,
  mapper: (item: T) => undefined | null | U
): U[] {
  const result: U[] = [];
  for (const item of arr) {
    const mapped = mapper(item);
    if (mapped != null) {
      result.push(mapped);
    }
  }
  return result;
}
