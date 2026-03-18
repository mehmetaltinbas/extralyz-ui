/**
 * A factory for resolving strategies based on a specific identifier.
 * * @template K - The identifier type (e.g., a string literal, enum, or union).
 * @template S - The base Strategy interface or type returned by the factory.
 */
export interface StrategyFactory<K, S> {
    resolveStrategy: (kind: K) => S | undefined;
}
