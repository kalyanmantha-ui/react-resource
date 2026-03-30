# React Resource UI

A high-level data orchestration layer for React focused on pagination, lists, and UI-driven data patterns.

npm: https://www.npmjs.com/package/react-resource-ui

---

## Overview

React Resource UI provides a unified abstraction for handling data fetching, pagination, and virtualization in React applications.

Instead of manually implementing pagination logic and rewriting UI behavior for different use cases, you define your data once and control behavior through configuration.

---

## Why use this?

In real applications, data fetching alone is not enough. You also need to manage:

- pagination logic
- switching between page, load more, and infinite scroll
- UI state consistency
- preventing stale updates and race conditions

Most tools provide low-level primitives, but you still write this logic yourself.

React Resource UI focuses on these higher-level patterns and removes the need to rewrite logic when requirements change.

---

## Installation

```bash
npm install react-resource-ui
```

---

## Core Concepts

### 1. Source

Defines where your data comes from. It can be:

- an async function
- a URL string
- a static array

---

### 2. Pagination

Controls how data is fetched and appended:

- page → traditional pagination
- loadmore → append on button click
- infinite → auto-fetch on scroll

---

### 3. Virtualization

Optimizes rendering for large datasets by only rendering visible rows.

---

## Basic Usage

```tsx
import { useResource } from "react-resource-ui";

function App() {
  const { data, loading, error, page, setPage } = useResource({
    source: async ({ page = 1, pageSize = 10 }) => {
      const skip = (page - 1) * pageSize;

      const res = await fetch(
        `https://dummyjson.com/todos?limit=${pageSize}&skip=${skip}`
      );

      const json = await res.json();
      return json.todos;
    },

    pagination: {
      type: "page",
      pageSize: 20,
    },
  });

  return null;
}
```

---

## Using with Total Count (Recommended)

For accurate pagination behavior, return `{ data, total }`:

```tsx
const { data } = useResource({
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
    pageSize: 20,
  },
});
```

---

## Pagination Modes

### Page-based

```ts
pagination: {
  type: "page",
  pageSize: 20,
}
```

You control navigation using `page` and `setPage`.

---

### Load More

```ts
pagination: {
  type: "loadmore",
  pageSize: 20,
}
```

Append data on button click.

---

### Infinite Scroll

```ts
pagination: {
  type: "infinite",
  pageSize: 20,
}
```

Automatically fetch next page when scrolling near the bottom.

---

## Using with DataTable

```tsx
import { useResource, DataTable } from "react-resource-ui";

function App() {
  const {
    data,
    loading,
    error,
    page,
    setPage,
    setScrollTop,
    offsetY,
    totalHeight,
    totalItems,
    scrollRef,
    hasNext,
  } = useResource({
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
    },

    pagination: {
      type: "page",
      pageSize: 20,
    },

    virtualization: {
      enabled: true,
      itemHeight: 50,
      containerHeight: 300,
    },
  });

  return (
    <DataTable
      data={data}
      loading={loading}
      error={error}
      page={page}
      setPage={setPage}
      setScrollTop={setScrollTop}
      type="page"
      virtualization={true}
      offsetY={offsetY}
      totalHeight={totalHeight}
      totalItems={totalItems}
      scrollRef={scrollRef}
      hasNext={hasNext}
    />
  );
}
```

---

## Virtualization

```ts
virtualization: {
  enabled: true,
  itemHeight: 50,
  containerHeight: 300,
}
```

- `itemHeight` → height of each row (must match UI)
- `containerHeight` → visible scroll container height

---

## Returned Values

`useResource` returns:

- `data` → current visible data
- `loading` → request state
- `error` → error state
- `page` → current page
- `setPage` → update page
- `setScrollTop` → update scroll position
- `offsetY` → virtualization offset
- `totalHeight` → total virtual height
- `totalItems` → total items loaded
- `scrollRef` → scroll container ref
- `hasNext` → whether next page exists

---

## Features

- Unified API for pagination strategies
- Page-based, load more, and infinite scroll support
- Built-in virtualization
- Works with async functions, URLs, or static data
- Request deduplication using request tracking
- Lightweight page-based caching
- Designed for table and list UIs

---

## Design Goals

- Reduce UI-specific data handling complexity
- Avoid rewriting logic when changing pagination behavior
- Provide a higher-level abstraction over common frontend patterns
- Keep configuration simple and predictable

---

## Status

Version: 0.1.x

This is an early release focused on core pagination and virtualization functionality. Improvements and edge case handling are in progress.

---

## Roadmap

- Grid-based virtualized rendering
- Sorting and filtering support
- Form integration
- Improved caching strategies
- Developer tooling and debug utilities

---

## Author

Kalyan Mantha