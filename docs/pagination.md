# Pagination

React Resource UI supports three pagination modes:

- page
- loadmore
- infinite

The same source function works across all modes.

---

## Recommended Source Format

```ts
return {
  data: T[],
  total: number
}
```

If only an array is returned, the library falls back to checking response length against `pageSize`.

---

## Page Mode

```ts
pagination: {
  type: "page",
  pageSize: 20,
}
```

Behavior:

- each request replaces existing data
- controlled using `page` and `setPage`

Example:

```tsx
<button onClick={() => setPage((p) => p + 1)}>
  Next
</button>
```

---

## Load More Mode

```ts
pagination: {
  type: "loadmore",
  pageSize: 20,
}
```

Behavior:

- new data is appended
- previous data is preserved

Example:

```tsx
<button onClick={() => setPage((p) => p + 1)}>
  Load More
</button>
```

---

## Infinite Mode

```ts
pagination: {
  type: "infinite",
  pageSize: 20,
}
```

Behavior:

- automatically loads next page based on scroll
- requires scroll tracking via `setScrollTop`

---

## Same Source Example

```tsx
source: async ({ page = 1, pageSize = 20 }) => {
  const skip = (page - 1) * pageSize;

  const res = await fetch(
    `https://dummyjson.com/todos?limit=${pageSize}&skip=${skip}`
  );

  const json = await res.json();

  return {
    data: json.todos,
    total: json.total,
  };
}
```

---

## Behavior Summary

| Mode       | Data Handling         |
|------------|----------------------|
| page       | replaces data        |
| loadmore   | appends data         |
| infinite   | auto fetch on scroll |

---

## Key Points

- only `pagination.type` changes behavior
- no need to rewrite data logic
- switching modes is configuration-only