# Technical Context

## Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight alternative to React Router)
- **State Management**: React Context API (currently separate for MCQ and DungSai, planned to unify)
- **Styling**: 
  - Tailwind CSS with custom configuration
  - New romantic purple theme implementation
  - Responsive design principles
- **UI Components**: 
  - Radix UI primitives
  - Custom themed components with consistent styling
- **Animation**: 
  - CSS transitions
  - react-confetti for celebration effects
- **API Client**: TanStack React Query for data fetching and caching
- **Form Handling**: React Hook Form with Zod validation

### Design System
- **Color Palette**:
  - Primary: Various shades of purple (#6B46C1, #805AD5, #9F7AEA, #B794F4)
  - Secondary: Soft pinks and whites for contrast
  - Accent: Gold/Yellow for highlights and rewards
- **Typography**:
  - Headings: Poppins (bold, modern)
  - Body: Inter (clean, readable)
- **Spacing**: 4px base unit for consistent spacing
- **Shadows**: Subtle shadows for depth and elevation
- **Border Radius**: 8px base for cards and containers

### Backend
- **Server**: Express.js with TypeScript
- **API**: RESTful endpoints for quiz data
- **Question Storage**: JSON files in server/question-json directory

### Development Tools
- **Build Tool**: Vite for frontend, esbuild for backend
- **Package Manager**: npm
- **TypeScript**: For type safety across the application
- **Development Server**: Cross-environment setup for consistent development

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
- Bundle size optimized through proper code splitting
- Images and assets need to be optimized for quick loading
- Quiz data is structured for efficient rendering and state management
- Optimized image assets for reward content
- Lazy loading for images and components
- Code splitting for better initial load performance
- Optimized animations for smooth performance

## Design Tokens
- **Colors**:
  - Primary: `#6B46C1` (Main purple)
  - Secondary: `#9F7AEA` (Lighter purple)
  - Accent: `#F6E05E` (Gold for highlights)
  - Background: `#F9FAFB` (Light gray)
  - Text: `#2D3748` (Dark gray)
  - Success: `#48BB78` (Green)
  - Error: `#F56565` (Red)

- **Spacing Scale**:
  - xs: 4px
  - sm: 8px
  - md: 16px
  - lg: 24px
  - xl: 32px
  - 2xl: 48px

- **Breakpoints**:
  - sm: 640px
  - md: 768px
  - lg: 1024px
  - xl: 1280px
  - 2xl: 1536px

## Debugging Notes
- Recent debugging involved heavy use of `console.log` to trace state updates and effect execution order.
- Identified and resolved infinite loops caused by unstable function references in `useEffect` dependencies (fixed using `useCallback`).
- Addressed Local Storage corruption by ensuring only one context (`ProgressContext`) writes to the primary progress key (`overallQuizProgress`) with a consistent data structure.

---
**Note:**
- Local Storage usage is now simplified, primarily managed by `ProgressContext`.
- The project is moving toward a unified quiz context for all quiz types, with robust localStorage persistence and hydration to ensure state is always correct and recoverable. 