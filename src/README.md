# React Demo Projects

This folder contains React component demonstrations with different rendering methods.

## Files

- **MessageBox.jsx** - Reusable React component that renders a message in a box
- **demo.jsx** - Browser-based demo using React 18's `createRoot` API
- **demo-ink.jsx** - Terminal-based demo using Ink library for CLI UI
- **index.html** - HTML entry point for browser demo

## Setup

Install dependencies from the root directory:

```bash
npm install
```

## Running Demos

### Browser Demo (demo.jsx)

Start the Vite development server:

```bash
npm run dev
```

This will start the dev server (usually at `http://localhost:5173`) and render the MessageBox component in the browser.

**Hot reload enabled** - Changes will automatically reflect in the browser.

### Terminal Demo (demo-ink.jsx)

Run the Ink demo in your terminal:

```bash
npx tsx src/demo-ink.jsx
```

This renders the MessageBox component in the terminal with a styled border using the Ink library.

Output:
```
╭──────────────────────────────────────────────────────────────────────────────╮
│ Hello                                                                        │
╰──────────────────────────────────────────────────────────────────────────────╯
```

## Component Usage

The `MessageBox` component accepts a `text` prop:

```jsx
<MessageBox text="Your message here" />
```

It renders as:
```html
<div><span>Your message here</span></div>
```

## Technologies

- **React 18** - UI library
- **Vite** - Build tool and dev server for browser demo
- **Ink** - React library for terminal UIs
- **tsx** - TypeScript/JSX execution for Node.js
