
export interface IRoleManager<T> {
  getByName(name: string): T;
  runAll(): void;
}
