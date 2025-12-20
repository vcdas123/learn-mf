# CSS Handling in Micro-Frontend Architecture

This comprehensive guide explains how CSS works in the micro-frontend architecture, including global CSS, CSS modules, scoping, and best practices.

## 🎯 Key Questions Answered

- ✅ **Does host global CSS apply to remotes?** → YES
- ✅ **Does remote global CSS apply to host?** → YES (when loaded)
- ✅ **How to scope CSS to specific modules?** → Use CSS Modules
- ✅ **How does CSS isolation work?** → Depends on how you import it

## 📋 Table of Contents

1. [CSS Scope and Isolation](#css-scope-and-isolation)
2. [Global CSS Behavior](#global-css-behavior)
3. [CSS Modules](#css-modules)
4. [CSS Processing Flow](#css-processing-flow)
5. [Best Practices](#best-practices)
6. [Common Patterns](#common-patterns)

## 🔍 CSS Scope and Isolation

### How CSS Works in Micro-Frontends

In a micro-frontend architecture, **all CSS is ultimately injected into the same DOM**. Since remotes are React components that render into the host's DOM tree, CSS follows these rules:

```
Host App (index.tsx)
    ↓
Browser DOM (<html><body><div id="root">)
    ↓
Host Components (with their CSS)
    ↓
Remote Components (loaded via Module Federation)
    ↓
Remote CSS (bundled with remote components)
```

**Key Principle**: CSS has no "module boundaries" - it's all in the same DOM, so global CSS affects everything.

### Understanding CSS Isolation

**❌ CSS is NOT automatically isolated** between host and remotes. When you import CSS, it's injected into the `<head>` and applies globally.

**✅ CSS Modules provide isolation** by hashing class names, making them unique to each module.

## 🌐 Global CSS Behavior

### Host Global CSS

**Location**: `host/src/styles/globals.css`

**How it's imported**:

```tsx
// host/src/index.tsx
import "./styles/globals.css"; // ✅ Imported at host root level

const root = createRoot(container);
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
```

**Does it apply to remotes?** → **YES ✅**

**Why?**

- Host's `globals.css` is loaded when the host app starts
- It's injected into the global `<head>` of the document
- Remotes render as components within the host's DOM tree
- Global CSS affects all elements in the document, including remote components

**Example**:

```css
/* host/src/styles/globals.css */
body {
  font-family: "Roboto", sans-serif; /* ✅ Applies to everything */
  margin: 0;
}

.custom-button {
  background: blue; /* ✅ Available everywhere */
}
```

```tsx
// remotes/grade/src/pages/List.tsx
function GradeList() {
  return (
    <button className="custom-button">
      Click Me {/* ✅ Uses host's global CSS */}
    </button>
  );
}
```

### Remote Global CSS

**Location**: `remotes/grade/src/styles/globals.css` (example)

**How it's imported**:

```tsx
// remotes/grade/src/App.tsx
import "./styles/globals.css"; // ✅ Imported in remote App component

function GradeApp() {
  return <Routes>...</Routes>;
}
```

**Does it apply to host?** → **YES ✅ (when remote is loaded)**

**Why?**

- Remote CSS is bundled with the remote's JavaScript
- When the remote is loaded (lazy loaded), its CSS is also injected
- Remote CSS is added to the same `<head>` as host CSS
- Global styles from remotes affect the entire document

**Example**:

```css
/* remotes/grade/src/styles/globals.css */
.grade-specific {
  color: red; /* ✅ Applies to everything once remote loads */
}

body {
  font-size: 14px; /* ⚠️ Overrides host's body styles! */
}
```

```tsx
// host/src/components/Header.tsx
function Header() {
  return (
    <div className="grade-specific">
      Header {/* ⚠️ Uses remote's CSS if remote has loaded */}
    </div>
  );
}
```

### ⚠️ Global CSS Conflicts

**Problem**: Global CSS from both host and remotes can conflict.

```css
/* host/src/styles/globals.css */
body {
  font-family: "Roboto", sans-serif;
  font-size: 16px;
  background: white;
}

/* remotes/grade/src/styles/globals.css */
body {
  font-family: "Arial", sans-serif; /* ⚠️ Overrides host */
  font-size: 14px; /* ⚠️ Overrides host */
  background: lightgray; /* ⚠️ Overrides host */
}
```

**Result**: Last loaded CSS wins. If grade remote loads after host, grade's styles override host's.

**Solution**:

- ✅ Use CSS Modules for component-specific styles
- ✅ Use CSS custom properties (CSS variables) for theme values
- ✅ Use specific selectors instead of global ones
- ✅ Use Tailwind/MUI for consistent design system

## 🎨 CSS Modules

CSS Modules provide **true CSS isolation** by hashing class names, making them unique to each module.

### How CSS Modules Work

**File naming**: Use `.module.css` or `.module.scss`

**Webpack config** (already configured):

```javascript
// shared/webpack.common.js
{
  test: /\.css$/i,
  use: [
    "css-loader",
    options: {
      modules: {
        auto: /\.module\.css$/i,  // ✅ Auto-detect .module.css files
      },
    },
  ],
}
```

### Host CSS Modules

**File**: `host/src/components/Header.module.css`

```css
/* host/src/components/Header.module.css */
.header {
  background: blue;
  padding: 20px;
}

.title {
  font-size: 24px;
  color: white;
}
```

**Usage**:

```tsx
// host/src/components/Header.tsx
import styles from "./Header.module.css"; // ✅ CSS Module

function Header() {
  return (
    <div className={styles.header}>
      {" "}
      {/* ✅ Scoped class */}
      <h1 className={styles.title}>Host Header</h1>
    </div>
  );
}
```

**Generated class names** (example):

```html
<!-- Actual DOM output -->
<div class="Header_header__abc123">
  <!-- Hashed class name -->
  <h1 class="Header_title__def456">Host Header</h1>
</div>
```

**Isolation**: ✅ Classes are unique to this module. They won't conflict with remote CSS.

### Remote CSS Modules

**File**: `remotes/grade/src/pages/List.module.css`

```css
/* remotes/grade/src/pages/List.module.css */
.list {
  background: green;
  padding: 10px;
}

.item {
  margin: 5px;
}
```

**Usage**:

```tsx
// remotes/grade/src/pages/List.tsx
import styles from "./List.module.css"; // ✅ CSS Module

function GradeList() {
  return (
    <div className={styles.list}>
      {" "}
      {/* ✅ Scoped class */}
      <div className={styles.item}>Grade Item</div>
    </div>
  );
}
```

**Generated class names**:

```html
<!-- Actual DOM output -->
<div class="List_list__xyz789">
  <!-- Different hash than host -->
  <div class="List_item__uvw012">Grade Item</div>
</div>
```

**Isolation**: ✅ Classes are unique. Won't conflict with host or other remotes.

### CSS Modules vs Global CSS

| Feature         | Global CSS                  | CSS Modules                                |
| --------------- | --------------------------- | ------------------------------------------ |
| **File naming** | `styles.css`                | `styles.module.css`                        |
| **Import**      | `import "./styles.css"`     | `import styles from "./styles.module.css"` |
| **Usage**       | `className="my-class"`      | `className={styles.myClass}`               |
| **Scope**       | Global (affects everything) | Scoped (unique class names)                |
| **Conflicts**   | ⚠️ Can conflict             | ✅ No conflicts                            |
| **When to use** | Base styles, resets, themes | Component-specific styles                  |

## 📊 CSS Processing Flow

### Host CSS Processing

```
host/src/index.tsx
    ↓
import "./styles/globals.css"  (Global CSS)
    ↓
Webpack processes CSS
    ↓
PostCSS + Tailwind processing
    ↓
Injected into <head> when host loads
    ↓
Applies globally to entire document
    ↓
Affects: Host components + Remote components
```

### Remote CSS Processing - Two Scenarios

#### Scenario 1: Remote Runs Standalone (Direct URL Access)

```
User visits: http://localhost:3105/ (Grade remote)
    ↓
Remote's index.html loads (has its own <head>)
    ↓
Remote's JavaScript bundle loads
    ↓
CSS processing:
    ├── Development: style-loader injects <style> tags into remote's <head>
    └── Production: MiniCssExtractPlugin extracts CSS to files, linked in HTML
    ↓
CSS applies to remote's standalone page
```

**In this case**: Remote has its own `<head>`, CSS goes there.

#### Scenario 2: Remote Loaded by Host (Module Federation)

This is the key question! When a remote is loaded as a component into the host:

```
Host loads remote component
    ↓
Module Federation fetches remote's JavaScript bundle
    ↓
Remote's JavaScript executes in host's context
    ↓
CSS injection happens:
    ├── Development (style-loader):
    │   └── JavaScript code injects <style> tags into HOST's <head>
    │       (There's only ONE <head> - the host's!)
    │
    └── Production (MiniCssExtractPlugin):
        └── CSS files are extracted and loaded automatically
            when remote's JavaScript bundle loads
    ↓
CSS applies globally (affects host + all remotes)
```

**Key Points:**

- ✅ **Development**: `style-loader` injects CSS into the host's `<head>` via JavaScript
- ✅ **Production**: Extracted CSS files are automatically loaded by webpack when the remote loads
- ✅ **Both scenarios**: CSS ends up in the host's document (the only document that exists)
- ✅ **No separate `<head>`**: Remote components don't have their own HTML document when loaded by host

### Combined CSS in Browser

**When Remote is Loaded by Host:**

```
<html>
  <head>
    <!-- Host CSS (loaded first when host starts) -->
    <style>
      body { font-family: 'Roboto'; }
      .host-global { color: blue; }
      .Header_header__abc123 { ... }  /* Host CSS Module */
    </style>

    <!-- Remote CSS (injected when remote's JS bundle loads) -->
    <!-- Development: Injected by style-loader as <style> tags -->
    <!-- Production: Loaded as <link> tags pointing to remote's CSS files -->
    <style>
      .remote-global { color: green; }
      .List_list__xyz789 { ... }  /* Remote CSS Module */
    </style>
  </head>
  <body>
    <div id="root">  <!-- Host's root -->
      <!-- Host components -->
      <div class="host-global Header_header__abc123">Host</div>

      <!-- Remote components (rendered here, no separate root) -->
      <div class="remote-global List_list__xyz789">Remote</div>
    </div>
  </body>
</html>
```

**Important**: There's only ONE `<head>` and ONE `<body>`. The remote component is rendered inside the host's DOM tree.

## 🔧 How CSS Injection Works: Standalone vs Host Mode

### Understanding the Two Modes

When remotes run, they can operate in two different contexts:

1. **Standalone Mode**: Remote accessed directly via its own URL
2. **Host Mode**: Remote loaded as a component into the host application

### Standalone Mode (Direct URL Access)

**URL**: `http://localhost:3105/` (Grade remote directly)

**What Happens**:

```
1. Browser requests: http://localhost:3105/
2. Remote's index.html is served (has its own <head>)
3. Remote's JavaScript bundle loads (includes CSS code)
4. CSS injection:
   - Development: style-loader injects <style> tags into remote's <head>
   - Production: CSS extracted to files, <link> tags in HTML load them
5. Remote renders in its own DOM context
```

**HTML Structure**:

```html
<!-- Remote's own index.html -->
<html>
  <head>
    <title>Grade Module - Standalone</title>
    <!-- Remote's CSS injected/loaded here -->
    <style>
      /* Remote CSS */
    </style>
  </head>
  <body>
    <div id="root">
      <!-- Remote renders here -->
    </div>
  </body>
</html>
```

### Host Mode (Loaded via Module Federation)

**URL**: `http://localhost:3000/grades` (Host loads Grade remote)

**What Happens**:

```
1. Browser requests: http://localhost:3000/grades
2. Host's index.html is served (has its own <head>)
3. Host's JavaScript loads, initializes React app
4. Host routes to /grades, lazy loads Grade remote:
   const GradeRemote = lazy(() => import("grade/App"));
5. Module Federation fetches remote's JavaScript bundle
6. Remote's JavaScript executes in HOST's context
7. CSS injection happens:
   - Development: style-loader code executes, injects <style> tags
                    into HOST's <head> (the only <head> that exists!)
   - Production: Extracted CSS files automatically loaded by webpack
                  when remote's bundle loads
8. Remote component renders inside host's <div id="root">
```

**HTML Structure**:

```html
<!-- Host's index.html (the ONLY HTML document) -->
<html>
  <head>
    <title>Micro-Frontend Host Demo</title>
    <!-- Host's CSS -->
    <style>
      /* Host CSS */
    </style>

    <!-- Remote's CSS (injected when remote loads) -->
    <!-- Development: Added as <style> tags by style-loader -->
    <!-- Production: Added as <link> tags by webpack -->
    <style>
      /* Remote CSS */
    </style>
  </head>
  <body>
    <div id="root">
      <!-- Host's root -->
      <!-- Host components -->
      <HostNavigation />

      <!-- Remote component rendered HERE (no separate root) -->
      <GradeRemote />
    </div>
  </body>
</html>
```

### Key Differences

| Aspect                                | Standalone Mode                   | Host Mode                                 |
| ------------------------------------- | --------------------------------- | ----------------------------------------- |
| **HTML Document**                     | Remote's own `index.html`         | Host's `index.html` (only one exists)     |
| **`<head>` Element**                  | Remote's `<head>`                 | Host's `<head>` (only one exists)         |
| **CSS Injection Target**              | Remote's `<head>`                 | Host's `<head>`                           |
| **Development (style-loader)**        | Injects into remote's `<head>`    | Injects into host's `<head>`              |
| **Production (MiniCssExtractPlugin)** | CSS files linked in remote's HTML | CSS files loaded automatically by webpack |
| **React Root**                        | Remote has its own root           | Remote renders inside host's root         |

### Development Mode: style-loader Behavior

**Webpack Config**:

```javascript
// shared/webpack.common.js
{
  test: /\.css$/i,
  use: [
    isDevelopment ? "style-loader" : MiniCssExtractPlugin.loader,
    // ...
  ],
}
```

**What `style-loader` Does**:

```javascript
// When remote's CSS is imported, style-loader generates code like:
function injectStylesIntoDOM(css) {
  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style); // ← Appends to current document's <head>
}
```

**In Host Mode**:

- Remote's JavaScript executes in the host's context
- `document.head` refers to the host's `<head>`
- CSS is injected into the host's `<head>`

### Production Mode: MiniCssExtractPlugin Behavior

**Webpack Config**:

```javascript
// shared/webpack.common.js
new MiniCssExtractPlugin({
  filename: "css/[name].[contenthash:8].css",
  chunkFilename: "css/[name].[contenthash:8].chunk.css",
});
```

**What Happens**:

1. CSS is extracted to separate files during build:

   - `remotes/grade/dist/css/main.abc12345.css`

2. When remote's JavaScript bundle loads, webpack automatically:

   - Creates `<link>` tags for the CSS files
   - Injects them into the current document's `<head>`
   - Loads the CSS files from the remote's server/CDN

3. In Host Mode:
   - Remote's CSS files are loaded from remote's URL
   - `<link>` tags are added to the host's `<head>`
   - CSS applies globally

### Visual Comparison

**Standalone Mode**:

```
http://localhost:3105/
├── index.html (remote's own)
│   └── <head>
│       └── <style>/* Remote CSS */</style>
│   └── <body>
│       └── <div id="root">
│           └── Remote Component
```

**Host Mode**:

```
http://localhost:3000/grades
├── index.html (host's only HTML)
│   └── <head>
│       ├── <style>/* Host CSS */</style>
│       └── <style>/* Remote CSS injected here */</style>
│   └── <body>
│       └── <div id="root"> (host's root)
│           ├── Host Components
│           └── Remote Component (rendered here, no separate root)
```

### Important Implications

1. **CSS Global Scope**:

   - ✅ When remote CSS is injected into host's `<head>`, it applies globally
   - ✅ Remote global CSS affects host and other remotes
   - ✅ This is why CSS Modules are important for isolation

2. **CSS Loading Order**:

   - Host CSS loads first (when host initializes)
   - Remote CSS loads when remote's bundle loads
   - Last loaded CSS can override earlier CSS

3. **Production CSS Files**:

   - Remote CSS files are served from remote's server/CDN
   - Host's HTML doesn't need to know about remote CSS files
   - Webpack handles loading automatically via Module Federation

4. **Development Hot Reloading**:
   - When remote CSS changes, `style-loader` updates `<style>` tags in host's `<head>`
   - Changes apply immediately without full page reload

## ✅ Best Practices

### 1. Use CSS Modules for Component Styles

**✅ DO**:

```tsx
// Component-specific styles
import styles from "./MyComponent.module.css";

function MyComponent() {
  return <div className={styles.container}>Content</div>;
}
```

**❌ DON'T**:

```tsx
// Global CSS for component
import "./MyComponent.css"; // ⚠️ Global scope, can conflict

function MyComponent() {
  return <div className="container">Content</div>;
}
```

### 2. Use Global CSS Sparingly

**✅ DO** (use global CSS for):

- CSS resets/normalize
- Tailwind directives (`@tailwind base/components/utilities`)
- Base typography (body, h1-h6)
- CSS custom properties (CSS variables)
- Global utilities (if needed)

**❌ DON'T** (avoid global CSS for):

- Component-specific styles (use CSS Modules)
- Module-specific styles (use CSS Modules)
- Colors that might conflict (use CSS variables or MUI theme)

### 3. Use Tailwind/MUI for Consistent Design

**✅ DO**:

```tsx
// Use Tailwind utilities (processed globally but scoped by usage)
<div className="bg-blue-500 p-4 text-white">
  Content
</div>

// Use MUI sx prop (scoped by component)
<Box sx={{ bgcolor: 'primary.main', p: 2 }}>
  Content
</Box>
```

**Benefits**:

- Consistent design system
- No conflicts (utility-based, scoped by usage)
- Easy to maintain

### 4. Use CSS Custom Properties for Theme

**✅ DO**:

```css
/* host/src/styles/globals.css */
:root {
  --primary-color: #6366f1;
  --secondary-color: #8b5cf6;
  --spacing-unit: 8px;
}

/* Use in CSS Modules or components */
.my-component {
  background: var(--primary-color);
  padding: calc(var(--spacing-unit) * 2);
}
```

**Benefits**:

- Theme values defined once
- Easy to override per module if needed
- No conflicts (CSS variables are inherited)

### 5. Avoid Global Selectors in Remotes

**❌ DON'T**:

```css
/* remotes/grade/src/styles/globals.css */
body {
  /* ⚠️ Overrides host's body styles */
  font-size: 14px;
}

* {
  /* ⚠️ Affects everything */
  box-sizing: border-box;
}
```

**✅ DO**:

```css
/* Use CSS Modules or specific selectors */
.grade-app {
  /* More specific, less likely to conflict */
  font-size: 14px;
}
```

## 📝 Common Patterns

### Pattern 1: Host Provides Base Styles

**Host** (`host/src/styles/globals.css`):

```css
/* Base styles, resets, Tailwind */
@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: "Roboto", sans-serif;
}

:root {
  --primary-color: #6366f1;
  --secondary-color: #8b5cf6;
}
```

**Remotes**:

- Use Tailwind utilities (already available)
- Use CSS Modules for component styles
- Use CSS variables from host

**Result**: ✅ Consistent base styles, remotes can customize via CSS Modules

### Pattern 2: Module-Specific Styles

**Remote** (`remotes/grade/src/App.tsx`):

```tsx
import styles from "./App.module.css"; // ✅ CSS Module

function GradeApp() {
  return (
    <div className={styles.gradeApp}>
      {" "}
      {/* Scoped */}
      <Routes>...</Routes>
    </div>
  );
}
```

**CSS Module** (`remotes/grade/src/App.module.css`):

```css
.gradeApp {
  /* Module-specific container styles */
  background: linear-gradient(135deg, #fafafa 0%, #ffffff 100%);
  min-height: 100vh;
  padding: 20px;
}
```

**Result**: ✅ Isolated styles, no conflicts with host or other remotes

### Pattern 3: Shared Utilities via Tailwind

**All Apps**:

```tsx
// Use Tailwind utilities (processed from shared config)
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
  Content
</div>
```

**Result**: ✅ Consistent utilities, no conflicts, shared design system

### Pattern 4: Theme via CSS Variables

**Host** (`host/src/styles/globals.css`):

```css
:root {
  --theme-primary: #6366f1;
  --theme-secondary: #8b5cf6;
  --theme-spacing: 8px;
}
```

**Remotes** (use variables):

```css
/* remotes/grade/src/components/Card.module.css */
.card {
  background: var(--theme-primary);
  padding: calc(var(--theme-spacing) * 2);
}
```

**Result**: ✅ Consistent theme, easy to override if needed

## 🎯 Decision Tree: Which CSS Approach?

```
Do you need component-specific styles?
├── YES → Use CSS Modules (.module.css)
│   └── import styles from "./Component.module.css"
│       className={styles.myClass}
│
└── NO → Is it base/reset/theme styles?
    ├── YES → Use Global CSS (host only)
    │   └── host/src/styles/globals.css
    │       import "./styles/globals.css"
    │
    └── NO → Can you use Tailwind/MUI?
        ├── YES → Use Tailwind utilities or MUI sx
        │   └── className="bg-blue-500 p-4"
        │       OR
        │       sx={{ bgcolor: 'primary.main', p: 2 }}
        │
        └── NO → Use CSS Modules (safest)
            └── import styles from "./styles.module.css"
```

## 🔍 Real-World Examples

### Example 1: Host Global CSS Applied to Remote

```css
/* host/src/styles/globals.css */
.button {
  padding: 10px 20px;
  background: blue;
  color: white;
  border: none;
  border-radius: 4px;
}
```

```tsx
// remotes/grade/src/pages/List.tsx
function GradeList() {
  return (
    <button className="button">
      {" "}
      {/* ✅ Uses host's global CSS */}
      Add Grade
    </button>
  );
}
```

**Result**: Remote button uses host's styles ✅

### Example 2: Remote Global CSS Overriding Host

```css
/* host/src/styles/globals.css */
body {
  font-size: 16px;
  font-family: "Roboto", sans-serif;
}

/* remotes/grade/src/styles/globals.css */
body {
  font-size: 14px; /* ⚠️ Overrides host */
  font-family: "Arial", sans-serif; /* ⚠️ Overrides host */
}
```

**Result**: If grade remote loads, its styles override host's ⚠️

### Example 3: CSS Modules (No Conflicts)

```css
/* host/src/components/Button.module.css */
.button {
  background: blue;
}

/* remotes/grade/src/components/Button.module.css */
.button {
  background: green; /* ✅ No conflict - different hashed class names */
}
```

```tsx
// host/src/components/Button.tsx
import styles from "./Button.module.css";
<button className={styles.button}>Host Button</button>;
// → <button class="Button_button__abc123">Host Button</button>

// remotes/grade/src/components/Button.tsx
import styles from "./Button.module.css";
<button className={styles.button}>Grade Button</button>;
// → <button class="Button_button__xyz789">Grade Button</button>
```

**Result**: No conflicts - different class names ✅

### Example 4: Tailwind Utilities (Shared)

```tsx
// host/src/components/Header.tsx
<div className="bg-blue-500 p-4 text-white">Host Header</div>

// remotes/grade/src/pages/List.tsx
<div className="bg-blue-500 p-4 text-white">Grade List</div>
```

**Result**: Both use same Tailwind utilities, consistent styling ✅

## 📚 Summary

### CSS Scope Rules

| CSS Type               | Scope         | Affects Host?            | Affects Remotes?           | Conflicts?                        |
| ---------------------- | ------------- | ------------------------ | -------------------------- | --------------------------------- |
| **Host Global CSS**    | Global        | ✅ Yes                   | ✅ Yes                     | ⚠️ Can conflict                   |
| **Remote Global CSS**  | Global        | ✅ Yes (when loaded)     | ✅ Yes                     | ⚠️ Can conflict                   |
| **Host CSS Modules**   | Scoped        | ✅ Yes (host components) | ❌ No                      | ✅ No conflicts                   |
| **Remote CSS Modules** | Scoped        | ❌ No                    | ✅ Yes (remote components) | ✅ No conflicts                   |
| **Tailwind Utilities** | Utility-based | ✅ Yes                   | ✅ Yes                     | ✅ No conflicts (scoped by usage) |

### Key Takeaways

1. **Global CSS is truly global** - Applies to everything in the document
2. **CSS Modules provide isolation** - Use for component-specific styles
3. **Host global CSS applies to remotes** - Use for base styles, resets, themes
4. **Remote global CSS applies to host** - Be careful, can cause conflicts
5. **Use Tailwind/MUI** - For consistent design system, no conflicts
6. **Use CSS variables** - For theme values that can be shared or overridden

### Recommended Approach

1. **Host**:

   - Global CSS for base styles, resets, Tailwind directives, CSS variables
   - CSS Modules for host-specific components

2. **Remotes**:

   - CSS Modules for all component styles
   - Use Tailwind utilities (already available)
   - Use CSS variables from host theme
   - Avoid global CSS (unless absolutely necessary)

3. **All Apps**:
   - Use Tailwind utilities for consistent design
   - Use MUI components and sx prop for complex styles
   - Use CSS Modules when you need custom component styles

---

**Remember**: In micro-frontends, CSS isolation is NOT automatic. Use CSS Modules or utility-based approaches (Tailwind/MUI) to avoid conflicts and maintain clean, maintainable styles.
