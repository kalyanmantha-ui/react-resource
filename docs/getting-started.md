# Getting Started

React Resource UI is a headless pagination and list orchestration layer for React.

It manages pagination behavior, request coordination, and list state while you control rendering.

---

## Installation

```bash
npm install react-resource-ui
```

---

## Core Contract

The `source` function defines how data is fetched.

### Input

```ts
type ResourceParams = {
  page?: number;
  pageSize?: number;
};
```

Example:

```tsx
source: async ({ page = 1, pageSize = 10 }) => {
  const skip = (page - 1) * pageSize;
}
```

---

### Output

Your source must return one of the following:

#### 1. Array

```ts
return data;
```

- Used for simple cases
- Library determines `hasNext` using `pageSize`

---

#### 2. Object with total

```ts
return {
  data: T[],
  total: number
};
```

- Recommended format
- Allows accurate pagination
- Enables correct `hasNext` calculation

---

## Supported Source Types

### Async function

```tsx
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
}
```

---

### Static array

```tsx
source: [
  { id: 1, todo: "Read docs" },
  { id: 2, todo: "Build UI" },
]
```

---

### URL string

```tsx
source: "https://dummyjson.com/todos"
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

## Key Points

- `source` controls data fetching
- `pagination` controls behavior
- UI rendering is fully customizable