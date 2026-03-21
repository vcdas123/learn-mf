[⬅️ Back to Master Index](../../README.md)\n\n# Research Templates & Reference Files

This directory contains research files and template implementations that were created during the architecture design phase. These files serve as reference implementations and documentation of the enterprise-grade micro-frontend architecture.

## 📄 Template Files

### [HostApp.enterprise.tsx](./HostApp.enterprise.tsx)
**Description**: Enterprise-grade host application template
- Single React root implementation
- BrowserRouter with future flags
- Top-level routing structure
- Error boundaries for remote loading
- Redux Provider setup

### [RemoteApp.enterprise.tsx](./RemoteApp.enterprise.tsx)
**Description**: Enterprise-grade remote application template
- Pure React component export
- Nested routing implementation
- No createRoot() or BrowserRouter in production code
- Inherits router context from host

### [RemoteDevEntry.enterprise.tsx](./RemoteDevEntry.enterprise.tsx)
**Description**: Development-only entry point template for remotes
- Creates React root for standalone development
- BrowserRouter with future flags
- Mock Redux Provider for standalone mode
- Isolated from production code

### [ModuleFederationConfig.enterprise.js](./ModuleFederationConfig.enterprise.js)
**Description**: Module Federation configuration template
- Shared dependencies configuration
- Host remote configuration
- Remote expose configuration
- Handles hyphenated remote names

## 🎯 Usage

These templates are reference implementations. The actual working code is in:
- `../../host/src/` - Host application
- `../../remotes/*/src/` - Remote applications
- `../../sharedConfigs/webpack.module-federation.js` - Module Federation configuration

## 📚 Related Documentation

- **[Enterprise Component Architecture](../ENTERPRISE_COMPONENT_ARCHITECTURE.md)** - Architecture principles
- **[Complete Setup Guide](../COMPLETE_SETUP_GUIDE.md)** - Configuration details
- **[Project Structure](../PROJECT_STRUCTURE.md)** - Current project structure
- **[Documentation Index](../README.md)** - Complete documentation index

## 💡 Note

These templates represent the research and design phase. The actual implementation may have evolved. Refer to the live code in `host/` and `remotes/` directories for the current implementation.
