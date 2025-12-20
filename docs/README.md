# Documentation Index

Welcome to the Micro-Frontend Demo documentation. This directory contains comprehensive guides and references for understanding, setting up, and working with the enterprise-grade micro-frontend architecture.

## 📚 Documentation Files

### Getting Started

#### [README.md](../README.md) (Main README)
**Description**: Quick start guide and overview of the project
- Project overview and architecture
- Quick start instructions
- Basic usage examples
- Troubleshooting tips

### Architecture & Structure

#### [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)
**Description**: Complete breakdown of project organization and folder structure
- Detailed folder structure for host and remotes
- File organization patterns
- Configuration file locations
- Asset management structure

#### [COMPLETE_SETUP_GUIDE.md](./COMPLETE_SETUP_GUIDE.md)
**Description**: Comprehensive setup and configuration guide
- Environment configuration
- Webpack configuration details
- State management architecture
- Styling architecture
- Module Federation setup
- Development vs production workflows

#### [ASSET_STRUCTURE.md](./ASSET_STRUCTURE.md)
**Description**: Asset organization and management guide
- Image asset guidelines
- Font loading
- Favicon setup
- Asset optimization
- When to use `src/assets/` vs `public/assets/`
- Build output structure (`dist/`)

#### [TAILWIND_POSTCSS_CONFIG.md](./TAILWIND_POSTCSS_CONFIG.md)
**Description**: Tailwind CSS and PostCSS configuration guide
- How shared configs work
- Build process flow
- Content path scanning
- Theme customization
- PostCSS plugin configuration

#### [CSS_HANDLING_GUIDE.md](./CSS_HANDLING_GUIDE.md)
**Description**: Comprehensive CSS handling and styling guide
- Global CSS scope (host vs remotes)
- CSS Modules for isolation
- CSS processing flow
- Best practices and patterns
- Avoiding CSS conflicts
- When to use global CSS vs CSS Modules

#### [ENV_FILE_GUIDE.md](./ENV_FILE_GUIDE.md)
**Description**: Environment variables configuration guide
- Root `.env` vs remote `.env` files
- Priority order and override behavior
- Port and URL configuration
- Remote-specific environment variables
- Best practices for environment management
- Usage examples and debugging

#### [research-templates/](./research-templates/)
**Description**: Research templates and reference implementations
- Enterprise-grade host application template
- Remote application templates
- Development entry point templates
- Module Federation configuration templates
- Reference implementations from architecture design phase

### Enterprise Architecture

#### [ENTERPRISE_COMPONENT_ARCHITECTURE.md](./ENTERPRISE_COMPONENT_ARCHITECTURE.md)
**Description**: Enterprise-grade architecture principles and patterns
- Core architectural rules
- Component-based approach
- Context inheritance
- Dev vs production separation

#### [QUICK_START_ENTERPRISE.md](./QUICK_START_ENTERPRISE.md)
**Description**: Quick reference for enterprise patterns
- DO and DO NOT rules
- Common patterns
- Best practices checklist

### Demo & Setup

#### [DEMO_SETUP.md](./DEMO_SETUP.md) (if exists)
**Description**: Demo application setup instructions
- Running the demo
- Testing scenarios
- Demo features overview

## 🎯 Quick Navigation by Topic

### Want to understand the architecture?
→ Start with [ENTERPRISE_COMPONENT_ARCHITECTURE.md](./ENTERPRISE_COMPONENT_ARCHITECTURE.md)

### Need to set up the project?
→ Follow [COMPLETE_SETUP_GUIDE.md](./COMPLETE_SETUP_GUIDE.md)

### Looking for file locations?
→ Check [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)

### Need to understand CSS handling?
→ Read [CSS_HANDLING_GUIDE.md](./CSS_HANDLING_GUIDE.md)

### Need to configure environment variables?
→ See [ENV_FILE_GUIDE.md](./ENV_FILE_GUIDE.md)

### Looking for reference templates?
→ See [research-templates/](./research-templates/)

### Need quick reference?
→ See [QUICK_START_ENTERPRISE.md](./QUICK_START_ENTERPRISE.md)

### Just want to run it?
→ Go to [README.md](../README.md)

## 📖 Reading Order Recommendation

For new users:
1. [README.md](../README.md) - Get overview
2. [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) - Understand structure
3. [COMPLETE_SETUP_GUIDE.md](./COMPLETE_SETUP_GUIDE.md) - Complete setup
4. [ENTERPRISE_COMPONENT_ARCHITECTURE.md](./ENTERPRISE_COMPONENT_ARCHITECTURE.md) - Understand architecture

For experienced developers:
1. [QUICK_START_ENTERPRISE.md](./QUICK_START_ENTERPRISE.md) - Quick reference
2. [COMPLETE_SETUP_GUIDE.md](./COMPLETE_SETUP_GUIDE.md) - Configuration details

## 🔍 Document Categories

### **Setup & Configuration**
- [COMPLETE_SETUP_GUIDE.md](./COMPLETE_SETUP_GUIDE.md)
- [ENV_FILE_GUIDE.md](./ENV_FILE_GUIDE.md)
- [README.md](../README.md)

### **Architecture & Design**
- [ENTERPRISE_COMPONENT_ARCHITECTURE.md](./ENTERPRISE_COMPONENT_ARCHITECTURE.md)
- [QUICK_START_ENTERPRISE.md](./QUICK_START_ENTERPRISE.md)

### **Project Organization**
- [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)
- [ASSET_STRUCTURE.md](./ASSET_STRUCTURE.md)
- [TAILWIND_POSTCSS_CONFIG.md](./TAILWIND_POSTCSS_CONFIG.md)
- [research-templates/](./research-templates/) - Reference implementations

### **Configuration & Build**
- [ENV_FILE_GUIDE.md](./ENV_FILE_GUIDE.md)
- [TAILWIND_POSTCSS_CONFIG.md](./TAILWIND_POSTCSS_CONFIG.md)
- [CSS_HANDLING_GUIDE.md](./CSS_HANDLING_GUIDE.md)
- [COMPLETE_SETUP_GUIDE.md](./COMPLETE_SETUP_GUIDE.md)

### **Styling & CSS**
- [CSS_HANDLING_GUIDE.md](./CSS_HANDLING_GUIDE.md)
- [TAILWIND_POSTCSS_CONFIG.md](./TAILWIND_POSTCSS_CONFIG.md)

## 💡 Key Concepts Covered

- ✅ **Single React Root** - Why only one root exists
- ✅ **Single BrowserRouter** - Routing architecture
- ✅ **Module Federation** - Webpack configuration
- ✅ **State Management** - Redux + Zustand patterns
- ✅ **Styling** - MUI + Tailwind CSS
- ✅ **CSS Handling** - Global CSS, CSS Modules, scoping
- ✅ **Environment Variables** - Root and remote .env files with priority
- ✅ **Component-Based Remotes** - Pure React components
- ✅ **Development vs Production** - Different entry points
- ✅ **Standalone Mode** - Independent remote development

## 📝 Contributing

When adding new documentation:
1. Place markdown files in this `docs/` directory
2. Update this `README.md` with a description
3. Follow the existing documentation style
4. Include code examples where helpful

## 🚀 Quick Links

- **Main Project**: [../README.md](../README.md)
- **Research Templates**: [research-templates/](./research-templates/)
- **Host App**: [../host/](../host/)
- **Remotes**: [../remotes/](../remotes/)
- **Shared Config**: [../sharedConfigs/](../sharedConfigs/)

---

*Last updated: See individual document timestamps*
