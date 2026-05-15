# test-snippet-findings-sub

Git submodule of [Etsija/test-snippet-findings](https://github.com/Etsija/test-snippet-findings).

Contains TypeScript files copied from well-known open source projects and deliberately mutilated — functions have been deleted so that SCANOSS reports them as **snippet findings** rather than whole-file license matches. This submodule exists to produce snippet findings under a **second provenance** when the parent repository is scanned with ORT, enabling testing of provenance-grouped snippet finding views.

---

## Source files

### `src/rxjs__bufferTime.ts`

- **Original repo:** [ReactiveX/rxjs](https://github.com/ReactiveX/rxjs)
- **Original file:** `packages/rxjs/src/internal/operators/bufferTime.ts`
- **License:** Apache-2.0
- **Removed:**
  - All three TypeScript overload signatures for `bufferTime`
  - The full JSDoc comment block (description, examples, `@param`/`@return` tags)
  - The `complete` handler inside `bufferTimeSubscriber` — which emitted all remaining active buffers on source completion

---

### `src/tsyringe__dependency-container.ts`

- **Original repo:** [microsoft/tsyringe](https://github.com/microsoft/tsyringe)
- **Original file:** `src/dependency-container.ts`
- **License:** MIT
- **Removed:**
  - `registerInstance` — convenience method to register a pre-existing value instance
  - `registerSingleton` — registers a class or token with `Lifecycle.Singleton`
  - `beforeResolution` — registers a pre-resolution interceptor callback
  - `afterResolution` — registers a post-resolution interceptor callback
  - `dispose` — disposes the container and all registered `Disposable` instances
  - `getAllRegistrations` — looks up all registrations for a token, walking up to the parent container
  - `resolveParams` — resolves constructor parameter tokens, handling transform and multi descriptors
  - `ensureNotDisposed` — guard that throws if the container has already been disposed

---

### `src/typeorm__RelationLoader.ts`

- **Original repo:** [typeorm/typeorm](https://github.com/typeorm/typeorm)
- **Original file:** `src/query-builder/RelationLoader.ts`
- **License:** MIT
- **Removed:**
  - `loadManyToManyOwner` — builds a query to load the related side of a many-to-many owner relation via a junction table
  - `loadManyToManyNotOwner` — same for the inverse (non-owner) side of a many-to-many relation
  - `enableLazyLoad` — wraps an entity property with `Object.defineProperty` getters/setters to lazily fetch relation data on first access
