# react-resource

A lightweight React utility for handling data fetching and rendering with minimal boilerplate.

## Overview

In most React applications, fetching data and managing loading/error states is repetitive and scattered across components.

`react-resource` provides a simple abstraction to:

- Fetch data from multiple source types
- Handle loading and error states consistently
- Avoid race conditions during async updates
- Render data quickly using a generic table component

---

## Features

- Generic `useResource` hook
- Supports multiple data sources:
  - Static arrays
  - API endpoints (string URLs)
  - Async functions
- Built-in loading and error handling
- Race-condition safe requests
- Generic `DataTable` component for quick visualization

---

## Installation (Local Development)

```bash
npm install react-resource