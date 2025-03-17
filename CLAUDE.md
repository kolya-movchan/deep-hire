# AI-FLEX DEVELOPMENT GUIDE

## Build & Run Commands

- `npm run dev` - Start development server (port 3000)
- `npm run build` - Build for production (tsc + vite build)
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run preview` - Preview production build

## Code Style Guidelines

- **Imports**: Use absolute imports with `@/` prefix (e.g., `import { x } from "@/components/..."`)
- **Components**: Use functional components with TypeScript interfaces for props
- **Hooks**: Create custom hooks for reusable logic in `src/hooks/`
- **State Management**: Use Redux Toolkit with typed selectors and actions
- **Naming**:
  - Components/Files: PascalCase (e.g., `Sidebar.tsx`)
  - Hooks: camelCase with `use` prefix (e.g., `useAuth`)
  - Variables/Functions: camelCase
  - Interfaces/Types: PascalCase with descriptive names
- **Error Handling**: Use try/catch blocks for async operations
- **Formatting**: Prettier with 2-space indentation, 100 char line length
- **TypeScript**: Strict mode, avoid `any`, use proper type annotations

## Tech Stack

React 18, TypeScript, Vite, Redux Toolkit, MUI, Tailwind CSS, AWS Amplify
