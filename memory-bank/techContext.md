# Technical Context

## Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight alternative to React Router)
- **State Management**: 
  - React Context API for global state
  - Local storage for persistent user progress
  - Optimized state updates with useReducer
- **Styling**: 
  - Tailwind CSS with custom purple theme
  - CSS modules for component-specific styles
  - Responsive design with mobile-first approach
- **UI Components**: 
  - Radix UI primitives for accessibility
  - Custom themed components with consistent styling
  - Responsive layout components
- **Animation**: 
  - Framer Motion for smooth transitions
  - CSS animations for micro-interactions
  - react-confetti for celebration effects
- **Form Handling**: React Hook Form with Zod validation
- **Performance**:
  - Code splitting with React.lazy and Suspense
  - Memoization with useMemo and useCallback
  - Optimized asset loading

### Design System
- **Color Palette**:
  - Primary: #7C3AED (violet-600) - Main brand color
  - Secondary: #8B5CF6 (violet-500) - Interactive elements
  - Accent: #F59E0B (amber-500) - Highlights and rewards
  - Background: #F9FAFB (gray-50) - Light mode background
  - Surface: #FFFFFF - Cards and elevated elements
  - Text: #1F2937 (gray-800) - Primary text
  - Text Secondary: #6B7280 (gray-500) - Secondary text
- **Typography**:
  - Headings: Poppins (600-700 weight)
  - Body: Inter (400-500 weight)
  - Code: JetBrains Mono (400 weight)
  - Base font size: 16px (1rem)
  - Scale: 1.25 (Major Third)
- **Spacing**:
  - Base unit: 4px (0.25rem)
  - Scale: 0.25rem, 0.5rem, 1rem, 1.5rem, 2rem, 3rem, 4rem
- **Shadows**:
  - sm: 0 1px 2px 0 rgb(0 0 0 / 0.05)
  - DEFAULT: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)
  - lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)
- **Border Radius**:
  - sm: 0.125rem (2px)
  - DEFAULT: 0.375rem (6px)
  - md: 0.5rem (8px)
  - lg: 1rem (16px)
  - full: 9999px

### Backend
- **Server**: Express.js with TypeScript
- **API**: RESTful endpoints for quiz data
- **Question Storage**: JSON files in server/question-json directory

## Key Dependencies
- **@tanstack/react-query**: For managing server state and API requests
- **react-confetti**: For celebration animations on achievement
- **tailwindcss**: For utility-first CSS styling with custom theme
- **zod**: For runtime type validation
- **wouter**: Lightweight routing solution
- **radix-ui**: Component primitives for accessible UI elements
- **framer-motion**: For smooth animations and transitions

## Theme Implementation
- Theme colors are defined in `tailwind.config.ts`
- Custom CSS variables for theme colors in `index.css`
- Consistent component styling using Tailwind's `@apply` directive
- Dark/light mode support (if applicable)

## Data Flow
1. Server provides quiz questions via API endpoints.
2. Client fetches and caches questions using React Query (or simple fetch).
3. **Session State**: User answers during a quiz attempt are managed in-memory by the relevant context (`MultipleChoiceQuizContext`, `DungSaiQuizContext`).
4. **Persistent Progress**: On quiz completion, results are sent to `ProgressContext`.
5. `ProgressContext` updates its state (completion, high score status, highest score).
6. `ProgressContext` saves its state to the `overallQuizProgress` key in localStorage.
7. On app load, `ProgressContext` initializes/hydrates its state from localStorage.

## Performance Considerations
- **Bundle Optimization**
  - Code splitting with React.lazy and Suspense
  - Tree-shaking with ES modules
  - Dynamic imports for non-critical components
- **Asset Optimization**
  - WebP format for images with fallbacks
  - Responsive images with srcset
  - Lazy loading for below-the-fold content
- **Rendering Performance**
  - Memoization with React.memo, useMemo, and useCallback
  - Virtualization for long lists (react-window)
  - Optimized re-renders with proper dependency arrays
- **Animation Performance**
  - Hardware-accelerated animations
  - Will-change property for animated elements
  - Reduced motion preferences support
- **State Management**
  - Local state for UI interactions
  - Context for global app state
  - Optimized updates with useReducer
- **Network Performance**
  - Service worker for offline support
  - Data prefetching for faster navigation
  - Compression for API responses

## Design Tokens

### Colors
```typescript
const colors = {
  // Primary
  primary: {
    50: '#f5f3ff',
    100: '#ede9fe',
    200: '#ddd6fe',
    300: '#c4b5fd',
    400: '#a78bfa',
    500: '#8b5cf6',
    600: '#7c3aed',
    700: '#6d28d9',
    800: '#5b21b6',
    900: '#4c1d95',
  },
  // Accent
  accent: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  // Neutral
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
  // Semantic
  success: {
    50: '#ecfdf5',
    500: '#10b981',
    700: '#047857',
  },
  error: {
    50: '#fef2f2',
    500: '#ef4444',
    700: '#b91c1c',
  },
  warning: {
    50: '#fffbeb',
    500: '#f59e0b',
    700: '#b45309',
  },
  info: {
    50: '#eff6ff',
    500: '#3b82f6',
    700: '#1d4ed8',
  },
}
```

### Typography
```typescript
const typography = {
  fontFamily: {
    sans: ['Inter', 'sans-serif'],
    heading: ['Poppins', 'sans-serif'],
    mono: ['JetBrains Mono', 'monospace'],
  },
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
    '5xl': '3rem',     // 48px
    '6xl': '3.75rem',  // 60px
  },
  lineHeight: {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
}
```

### Breakpoints
```typescript
const breakpoints = {
  sm: '640px',    // Small screens
  md: '768px',    // Tablets
  lg: '1024px',   // Laptops
  xl: '1280px',   // Desktops
  '2xl': '1536px', // Large desktops
}
```

### Z-Index Scale
```typescript
const zIndex = {
  hide: -1,
  auto: 'auto',
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800,
}
```

## Debugging Notes
- Recent debugging involved heavy use of `console.log` to trace state updates and effect execution order.
- Identified and resolved infinite loops caused by unstable function references in `useEffect` dependencies (fixed using `useCallback`).
- Addressed Local Storage corruption by ensuring only one context (`ProgressContext`) writes to the primary progress key (`overallQuizProgress`) with a consistent data structure.
---
**Note:**
- Local Storage usage is now simplified, primarily managed by `ProgressContext`.
- The project is moving toward a unified quiz context for all quiz types, with robust localStorage persistence and hydration to ensure state is always correct and recoverable. 