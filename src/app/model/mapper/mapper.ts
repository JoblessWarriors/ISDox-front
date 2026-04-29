type MapperFn<T, M> = (source: T) => M;

export class Mapper {
    private static mappings = new Map<string, MapperFn<any, any>>();

    static register<T, M>(key: string, mapper: MapperFn<T, M>) {
    this.mappings.set(key, mapper);
  }

  static map<T, M>(key: string, source: T): M {
    const mapper = this.mappings.get(key);
    if (!mapper) throw new Error(`No mapper registered for ${key}`);
    return mapper(source);
  }
}
