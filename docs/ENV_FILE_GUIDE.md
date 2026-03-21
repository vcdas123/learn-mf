[⬅️ Back to Master Index](../README.md)\n\n# Environment Variables Guide

This guide explains how environment variables work in the micro-frontend architecture, including priority and configuration.

## 📁 Environment File Structure

### Root `.env` File

**Location**: `/.env` (root directory)

**Purpose**: Shared configuration for all applications (host and remotes)

**Contains**:

- Host application port and URL
- All remote application ports and URLs
- Shared environment variables

**Example**:

```env
# Host Application Configuration
HOST_PORT=3000
HOST_URL=http://localhost:3000

# Student Grades Remote Configuration
REMOTE_STUDENT_GRADES_PORT=3105
REMOTE_STUDENT_GRADES_URL=http://localhost:3105

# Activity Log Remote Configuration
REMOTE_ACTIVITY_LOG_PORT=3106
REMOTE_ACTIVITY_LOG_URL=http://localhost:3106

# Image Analyzer Remote Configuration
REMOTE_IMAGE_ANALYZER_PORT=3107
REMOTE_IMAGE_ANALYZER_URL=http://localhost:3107
```

### Remote `.env` Files (Optional)

**Locations**:

- `host/.env` - Host-specific overrides
- `remotes/student-grades/.env` - Student Grades remote-specific overrides
- `remotes/activity-log/.env` - Activity Log remote-specific overrides
- `remotes/image-analyzer/.env` - Image Analyzer remote-specific overrides

**Purpose**: Override root `.env` values for specific applications

**Example** (`remotes/student-grades/.env`):

```env
# Override port for student-grades remote only
REMOTE_STUDENT_GRADES_PORT=3205

# Add student-grades-specific variables
STUDENT_GRADES_API_URL=http://localhost:4000/api
STUDENT_GRADES_FEATURE_FLAG_ENABLED=true
```

## 🎯 Priority Order

Environment variables are loaded with the following priority (highest to lowest):

1. **Remote `.env` file** (if exists) - Highest priority
2. **Root `.env` file** - Fallback
3. **Default values** (hardcoded in scripts) - Lowest priority

### How It Works

```
┌─────────────────────────────────────┐
│  Remote .env (if exists)            │ ← Highest Priority
│  - Overrides root .env               │
│  - Application-specific values      │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│  Root .env                          │ ← Fallback
│  - Shared configuration             │
│  - Default values for all apps     │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│  Defaults (in start.js)            │ ← Lowest Priority
│  - Hardcoded fallback values        │
└─────────────────────────────────────┘
```

## 📝 Usage Examples

### Example 1: Using Only Root `.env`

**Root `.env`**:

```env
HOST_PORT=3000
REMOTE_STUDENT_GRADES_PORT=3105
```

**Result**: All applications use values from root `.env`

### Example 2: Override Port for One Remote

**Root `.env`**:

```env
REMOTE_STUDENT_GRADES_PORT=3105
REMOTE_ACTIVITY_LOG_PORT=3106
```

**`remotes/student-grades/.env`**:

```env
REMOTE_STUDENT_GRADES_PORT=3205
```

**Result**:

- Student Grades remote uses port **3205** (from `remotes/student-grades/.env`)
- Activity Log remote uses port **3106** (from root `.env`)

### Example 3: Add Remote-Specific Variables

**Root `.env`**:

```env
REMOTE_STUDENT_GRADES_PORT=3105
```

**`remotes/student-grades/.env`**:

```env
REMOTE_STUDENT_GRADES_PORT=3105
STUDENT_GRADES_API_URL=http://localhost:4000/api
STUDENT_GRADES_CACHE_TTL=3600
```

**Result**:

- Student Grades remote uses port **3105** (from root `.env`)
- Student Grades remote has access to `STUDENT_GRADES_API_URL` and `STUDENT_GRADES_CACHE_TTL` (from `remotes/student-grades/.env`)

## 🔧 Implementation Details

### Start Scripts

All start scripts (`host/scripts/start.js`, `remotes/*/scripts/start.js`) use the shared utility:

```javascript
const { loadEnv } = require("../../../sharedConfigs/load-env");

const envVars = loadEnv({
  rootEnvPath: path.resolve(__dirname, "../../.env"),
  remoteEnvPath: path.resolve(__dirname, "../.env"), // Optional
  defaults: {
    HOST_PORT: "3000", // Fallback if not in .env files
  },
});
```

### Webpack Configuration

Webpack configs also read from `.env` files using `dotenv`:

```javascript
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const PORT = process.env.HOST_PORT || 3000;
```

**Note**: Webpack configs currently only read from root `.env`. To use remote `.env` in webpack, you would need to update the webpack configs to check for remote `.env` first.

## ✅ Best Practices

### 1. Use Root `.env` for Shared Values

- Common ports and URLs
- Shared API endpoints
- Global feature flags

### 2. Use Remote `.env` for Overrides

- Different ports for local development
- Remote-specific API endpoints
- Remote-specific feature flags
- Local development overrides

### 3. Don't Commit `.env` Files

- Add `.env` to `.gitignore`
- Commit `.env.example` files as templates
- Document required variables in README

### 4. Use `.env.example` as Templates

Create `.env.example` files with:

- All required variables
- Example values
- Comments explaining each variable

## 🚀 Quick Start

### 1. Create Root `.env`

```bash
# Copy from example or create new
cp .env.example .env
```

### 2. (Optional) Create Remote `.env`

```bash
# For student-grades remote
cd remotes/student-grades
cp .env.example .env
# Edit .env with your overrides
```

### 3. Start Applications

```bash
# All apps will read from .env files
npm run start:host
npm run start:student-grades
```

## 🔍 Debugging

Start scripts log which `.env` files are being used:

```
Starting student-grades remote on port 3205...
  Root .env: /path/to/root/.env
  Student Grades .env: /path/to/remotes/student-grades/.env (overrides root)
```

This helps you verify which configuration is being used.

## 📚 Related Files

- `sharedConfigs/load-env.js` - Utility for loading .env files
- `host/scripts/start.js` - Host start script
- `remotes/*/scripts/start.js` - Remote start scripts
- `host/webpack.config.js` - Host webpack config (reads root .env)
- `remotes/*/webpack.config.js` - Remote webpack configs (read root .env)
