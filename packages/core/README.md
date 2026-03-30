# React Resource UI

Headless pagination and list orchestration for React.  
Switch between page, load more, and infinite scroll without rewriting UI logic.

npm: https://www.npmjs.com/package/react-resource-ui

---

## Overview

React Resource UI is a headless abstraction for managing pagination behavior, list state, and virtualization in React applications.

Instead of rewriting logic when switching pagination patterns, you define your data source once and control behavior through configuration.

---

## Why use this?

In real applications, pagination is more than just fetching data. You need to manage:

- switching between page, load more, and infinite scroll
- merging or replacing data correctly
- handling race conditions and stale requests
- keeping UI behavior consistent

Most tools provide low-level primitives, but you still write this logic yourself.

React Resource UI makes pagination behavior configuration-driven.

---

## Headless by Design

This library does not enforce any UI or styling.

You can use it with:

- custom components
- Tailwind
- Material UI
- your own table or list implementations

The library handles state and behavior. You control rendering.

---

## Installation

```bash
npm install react-resource-ui
```

---

## Basic Usage

```tsx
import { useResource } from "react-resource-ui";

function App() {
  const { data, loading, error, page, setPage, hasNext } = useResource({
    source: async ({ page = 1, pageSize = 10 }) => {
      const skip = (page - 1) * pageSize;

      const res = await fetch(
        `https://dummyjson.com/todos?limit=${pageSize}&skip=${skip}`
      );

      const json = await res.json();

      return {
        data: json.todos,
        total: json.total,
      };
    },

    pagination: {
      type: "page",
      pageSize: 10,
    },
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  return (
    <div>
      {data.map((item) => (
        <div key={item.id}>{item.todo}</div>
      ))}

      <button disabled={!hasNext} onClick={() => setPage((p) => p + 1)}>
        Next
      </button>
    </div>
  );
}
```

---

## Pagination Modes

```ts
pagination: { type: "page" }
pagination: { type: "loadmore" }
pagination: { type: "infinite" }
```

### Behavior

| Mode       | Data Handling         |
|------------|----------------------|
| page       | replaces data        |
| loadmore   | appends data         |
| infinite   | auto fetch on scroll |

Switching modes does not require changing your data logic.

---

## Source Contract

The `source` function receives:

```ts
{
  page?: number;
  pageSize?: number;
}
```

It must return either:

```ts
T[]
```

or

```ts
{
  data: T[],
  total: number
}
```

Returning `{ data, total }` is recommended for accurate pagination.

---

## Virtualization

```ts
virtualization: {
  enabled: true,
  itemHeight: 50,
  containerHeight: 300,
}
```

Virtualization renders only visible items for better performance on large datasets.

---

## Using with DataTable (Optional)

```tsx
import { useResource, DataTable } from "react-resource-ui";
```

The `DataTable` component is provided as a convenience.

You are free to build your own UI using the hook.

---

## API (Summary)

`useResource` returns:

- `data`
- `loading`
- `error`
- `page`, `setPage`
- `hasNext`
- `offsetY`, `totalHeight`
- `scrollRef`, `setScrollTop`

---

## Documentation

- [Getting Started](./docs/getting-started.md)
- [Pagination](./docs/pagination.md)
- [Virtualization](./docs/virtualization.md)

---

## When should you use this?

Use React Resource UI if you want to:

- switch pagination types without rewriting logic
- keep pagination behavior separate from UI
- manage list state in a consistent way
- add virtualization without another library

---

## Status

Early release focused on the core pagination and virtualization engine.

---

## Roadmap

- Grid-based rendering for virtualization
- Sorting and filtering
- Form integration
- improved caching strategies

---

## Author

Kalyan Mantha