# Tailwind CSS & PostCSS Configuration Guide

This guide explains how the shared Tailwind CSS and PostCSS configuration files are used across all applications in the micro-frontend demo.

## 📁 Configuration Files Location

```
microfrontend-demo/
└── sharedConfigs/
    ├── postcss.config.js    # ✅ Shared PostCSS configuration
    └── tailwind.config.js   # ✅ Shared Tailwind CSS configuration
```

## 🎯 Purpose of Shared Configs

These files in the `sharedConfigs/` directory provide **centralized configuration** for Tailwind CSS and PostCSS that is used by **all applications** (host and remotes). This ensures:

- ✅ **Consistent styling** across all apps
- ✅ **Single source of truth** for Tailwind configuration
- ✅ **Easier maintenance** (update once, applies everywhere)
- ✅ **Shared design system** and utility classes

## 🔄 How They're Used in the Build Process

### Build Flow Diagram

```
Your CSS File (globals.css)
    ↓
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
    ↓
Webpack CSS Loader
    ↓
PostCSS Loader
    ↓
Reads: sharedConfigs/postcss.config.js
    ↓
┌─────────────────────────┐
│ PostCSS Plugins:        │
│ 1. tailwindcss {}       │ → Reads: sharedConfigs/tailwind.config.js
│ 2. autoprefixer {}      │ → Adds vendor prefixes
└─────────────────────────┘
    ↓
Processed CSS Output
```

### Step-by-Step Process

1. **You write CSS with Tailwind directives:**
   ```css
   /* host/src/styles/globals.css */
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

2. **Webpack processes CSS files:**
   ```javascript
   // sharedConfigs/webpack.common.js
   {
     test: /\.css$/i,
     use: [
       "style-loader",           // Injects CSS into DOM (dev)
       "css-loader",             // Processes CSS imports
       "postcss-loader",         // ✅ Runs PostCSS plugins
     ],
   }
   ```

3. **PostCSS loader reads `sharedConfigs/postcss.config.js`:**
   ```javascript
   // sharedConfigs/postcss.config.js
   module.exports = {
     plugins: {
       tailwindcss: {},      // ✅ Processes Tailwind directives
       autoprefixer: {},     // Adds vendor prefixes (-webkit-, -moz-, etc.)
     },
   };
   ```

4. **Tailwind plugin reads `sharedConfigs/tailwind.config.js`:**
   ```javascript
   // sharedConfigs/tailwind.config.js
   module.exports = {
     content: [
       "./host/src/**/*.{js,jsx,ts,tsx}",       // ✅ Scans host files
       "./remotes/**/src/**/*.{js,jsx,ts,tsx}", // ✅ Scans all remote files
     ],
     theme: { extend: {} },
     plugins: [],
   };
   ```

5. **Tailwind generates utility classes:**
   - Scans all files in `content` paths
   - Extracts Tailwind classes used (e.g., `bg-blue-500`, `text-center`)
   - Generates only the CSS for classes actually used (purge/tree-shaking)

6. **Autoprefixer adds vendor prefixes:**
   - Adds `-webkit-`, `-moz-`, `-ms-` prefixes where needed
   - Ensures cross-browser compatibility

7. **Final CSS output:**
   ```css
   /* Generated CSS */
   .bg-blue-500 { background-color: rgb(59 130 246); }
   .text-center { text-align: center; }
   /* With autoprefixer */
   .transform { -webkit-transform: ...; transform: ...; }
   ```

## 📋 File Details

### `sharedConfigs/postcss.config.js`

```javascript
module.exports = {
  plugins: {
    tailwindcss: {},      // Tailwind CSS plugin
    autoprefixer: {},     // Vendor prefix plugin
  },
};
```

**What it does:**
- ✅ Configures PostCSS plugins
- ✅ Runs Tailwind CSS processing
- ✅ Adds browser vendor prefixes automatically

**Used by:** All applications when processing CSS files

**How it's found:** PostCSS loader automatically looks for `postcss.config.js` in the project root or uses webpack's resolve to find it

### `sharedConfigs/tailwind.config.js`

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./host/src/**/*.{js,jsx,ts,tsx}",           // Host source files
    "./remotes/**/src/**/*.{js,jsx,ts,tsx}",     // All remote source files
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

**What it does:**
- ✅ Defines which files Tailwind should scan for classes
- ✅ Configures theme customization (colors, spacing, etc.)
- ✅ Enables Tailwind plugins (if added)

**Content Paths Explained:**
- `./host/src/**/*.{js,jsx,ts,tsx}` - Scans all host source files
- `./remotes/**/src/**/*.{js,jsx,ts,tsx}` - Scans all remote source files recursively

**Why both paths?**
- Tailwind uses "purge" (content scanning) to only generate CSS for classes you actually use
- It needs to scan ALL files where Tailwind classes might be used
- Since we have host + multiple remotes, we need to scan all of them

## 🔧 How Webpack Finds These Configs

### PostCSS Config Resolution

PostCSS loader resolves the config file automatically:

1. Looks for `postcss.config.js` in:
   - Current working directory (`process.cwd()`)
   - Webpack config directory
   - Parent directories (up to root)

2. Since we're building from `host/` or `remotes/*/`:
   - Webpack runs from: `host/` or `remotes/student-grades/`
   - PostCSS looks up: `../sharedConfigs/postcss.config.js` (relative to webpack config)

### Tailwind Config Resolution

Tailwind CSS plugin resolves config automatically:

1. Looks for `tailwind.config.js` in:
   - Current working directory
   - Parent directories

2. Path resolution in `sharedConfigs/tailwind.config.js`:
   ```javascript
   content: [
     "./host/src/**/*.{js,jsx,ts,tsx}",  // Relative to where Tailwind runs
   ]
   ```
   - Paths are relative to where the Tailwind plugin runs
   - Since webpack runs from `host/` or `remotes/*/`, paths resolve correctly

## 📝 Usage in Applications

### Host Application

```css
/* host/src/styles/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**Build process:**
1. Webpack processes `globals.css`
2. PostCSS loader runs with `sharedConfigs/postcss.config.js`
3. Tailwind processes directives using `sharedConfigs/tailwind.config.js`
4. Scans `host/src/**/*.{js,jsx,ts,tsx}` for Tailwind classes
5. Generates optimized CSS

### Remote Applications

```tsx
// remotes/grade/src/pages/List.tsx
<div className="bg-blue-500 text-white p-4">
  Student Grades
</div>
```

**Build process:**
1. Webpack processes CSS files
2. PostCSS loader runs with `sharedConfigs/postcss.config.js`
3. Tailwind processes using `sharedConfigs/tailwind.config.js`
4. Scans `remotes/grade/src/**/*.{js,jsx,ts,tsx}` for classes
5. Generates CSS for classes used (e.g., `bg-blue-500`, `text-white`, `p-4`)

## 🎨 Using Tailwind Classes

Once configured, you can use Tailwind utility classes anywhere:

```tsx
// Any component in host or remotes
function MyComponent() {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-white">Hello</h1>
      <p className="text-gray-200">World</p>
    </div>
  );
}
```

**What happens:**
1. You write: `className="bg-blue-500"`
2. Tailwind scans your files (via `content` paths)
3. Generates CSS: `.bg-blue-500 { background-color: rgb(59 130 246); }`
4. Webpack includes it in the final bundle

## ⚙️ Customization

### Extend Tailwind Theme

Edit `sharedConfigs/tailwind.config.js`:

```javascript
module.exports = {
  content: [
    "./host/src/**/*.{js,jsx,ts,tsx}",
    "./remotes/**/src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-blue': '#1e40af',
        'brand-purple': '#7c3aed',
      },
      spacing: {
        '72': '18rem',
        '84': '21rem',
      },
    },
  },
  plugins: [
    // Add Tailwind plugins here
    // require('@tailwindcss/forms'),
  ],
};
```

**This applies to ALL applications** - host and all remotes.

### Add PostCSS Plugins

Edit `sharedConfigs/postcss.config.js`:

```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    // Add more plugins
    // 'postcss-nested': {},
    // 'postcss-custom-properties': {},
  },
};
```

## 📊 Configuration Flow Summary

```
┌─────────────────────────────────────────┐
│ 1. Write CSS with Tailwind directives   │
│    @tailwind base;                      │
│    @tailwind components;                │
│    @tailwind utilities;                 │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│ 2. Webpack CSS Loader                   │
│    Processes CSS imports                │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│ 3. PostCSS Loader                       │
│    Reads: sharedConfigs/postcss.config.js      │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│ 4. PostCSS Plugins Execute              │
│    ┌─────────────────────────────────┐  │
│    │ tailwindcss {}                  │  │ → Reads: sharedConfigs/tailwind.config.js
│    │   - Scans content paths         │  │   - Finds classes in your files
│    │   - Generates utility CSS       │  │   - Only includes used classes
│    └─────────────────────────────────┘  │
│    ┌─────────────────────────────────┐  │
│    │ autoprefixer {}                 │  │ → Adds vendor prefixes
│    │   - -webkit-, -moz-, -ms-      │  │
│    └─────────────────────────────────┘  │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│ 5. Final CSS Output                     │
│    Optimized, prefixed, ready to use    │
└─────────────────────────────────────────┘
```

## 🎯 Key Points

1. **Shared Configuration**: Both files are in `sharedConfigs/` and used by all apps
2. **Automatic Resolution**: Webpack/PostCSS automatically find these configs
3. **Content Scanning**: Tailwind scans all source files to generate only used classes
4. **Single Source of Truth**: Update once, applies everywhere
5. **Build-time Processing**: All Tailwind processing happens during webpack build

## 🔍 Verification

To verify the configs are working:

1. **Use Tailwind classes:**
   ```tsx
   <div className="bg-blue-500 p-4">Test</div>
   ```

2. **Check build output:**
   - Look in `dist/css/main.[hash].css`
   - Should see generated Tailwind classes

3. **Check browser DevTools:**
   - Inspect element with Tailwind classes
   - Should see styles applied

## 📚 Related Files

- `host/src/styles/globals.css` - Imports Tailwind directives
- `sharedConfigs/webpack.common.js` - Configures PostCSS loader
- `host/webpack.config.js` - Uses shared webpack config
- `remotes/*/webpack.config.js` - Uses shared webpack config

---

**Summary**: The shared PostCSS and Tailwind configs ensure consistent styling across all applications. They're automatically discovered by webpack during the build process, and Tailwind generates optimized CSS based on classes actually used in your source files.

