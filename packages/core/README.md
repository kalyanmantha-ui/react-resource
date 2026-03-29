# React Resource UI

A data orchestration layer for React focused on pagination and list-based UI patterns.

npm: https://www.npmjs.com/package/react-resource-ui

---

## Overview

React Resource UI provides a unified abstraction for handling data fetching, pagination, and virtualization in React applications.

It simplifies common UI patterns such as tables and lists by removing the need to rewrite logic when switching between pagination strategies.

---

## Installation

npm install react-resource-ui

---

## Basic Usage

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

    virtualization: {
      enabled: true,
      itemHeight: 40,
      containerHeight: 400,
    },
  });

  return null;
}

---

## Pagination Modes

The same logic can be reused across different pagination strategies by updating configuration only.

Page-based:
pagination: { type: "page" }

Load more:
pagination: { type: "loadmore" }

Infinite scroll:
pagination: { type: "infinite" }

---

## Features

- Unified API for multiple pagination strategies
- Built-in virtualization support
- Works with async functions, URLs, or static data sources
- Request deduplication using request tracking
- Lightweight page-based caching
- Designed for table and list UIs

---

## Design Goals

- Reduce UI-specific data handling complexity
- Avoid rewriting logic when changing pagination behavior
- Provide a higher-level abstraction over common data-fetching patterns
- Keep configuration simple and predictable

---

## Status

Version: 0.1.0

This is an early release focused on core functionality.
Additional testing and edge case handling are in progress.

---

## Roadmap

- Sorting and filtering support
- Form integration
- Improved caching strategies
- Developer tooling and debug utilities

---

## Author

Kalyan Mantha