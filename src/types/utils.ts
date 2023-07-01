export function assert<T extends never>() {}

type IsExact<A, B> = Exclude<A, B> | Exclude<B, A>
