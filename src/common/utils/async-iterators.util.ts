export const mapAsync = async <T, U>(
  array: T[],
  callback: (item?: T, index?: number, array?: T[]) => U
): Promise<U[]> => {
  const promises = array.map<U>(callback);

  return Promise.all(promises);
};

type ReduceCallback<T = any, K = any> = (previousValue: K, currentValue: T, currentIndex: number, array: T[]) => K;

export async function reduceAsync<T>(array: T[], callback?: ReduceCallback<T, T>): Promise<T>;
export async function reduceAsync<T, K>(array: T[], callback?: ReduceCallback<T, K>, initialValue?: K): Promise<K>;
export async function reduceAsync(array: unknown[], callback: ReduceCallback, initialValue?: unknown): Promise<any> {
  return initialValue ? array.reduce(callback, Promise.resolve(initialValue)) : array.reduce(callback);
}
