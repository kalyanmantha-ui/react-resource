# Virtualization

Virtualization renders only visible items to improve performance for large datasets.

---

## Enable Virtualization

```ts
virtualization: {
  enabled: true,
  itemHeight: 50,
  containerHeight: 300,
}
```

---

## Required Parameters

- `itemHeight`: fixed height of each item
- `containerHeight`: visible scroll area height

These must match your UI for correct rendering.

---

## Hook Output

When enabled, the hook provides:

- `offsetY`: vertical offset for visible items
- `totalHeight`: full height of the dataset
- `scrollRef`: reference to scroll container
- `setScrollTop`: updates scroll position

---

## Example

```tsx
<div
  ref={scrollRef}
  style={{ height: 300, overflowY: "auto" }}
  onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
>
  <div style={{ height: totalHeight }}>
    <div style={{ transform: `translateY(${offsetY}px)` }}>
      {data.map((item) => (
        <div key={item.id} style={{ height: 50 }}>
          {item.todo}
        </div>
      ))}
    </div>
  </div>
</div>
```

---

## Requirements

- container must have fixed height
- container must have `overflowY: auto`
- item height must be consistent

---

## What It Solves

Without virtualization:

- large lists increase DOM size
- rendering becomes slow

With virtualization:

- only visible items are rendered
- performance remains stable

---

## Limitations

- requires fixed item height
- dynamic height items are not supported