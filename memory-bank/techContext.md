# Technical Context

## Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight alternative to React Router)
- **State Management**: React Context API (currently separate for MCQ and DungSai, planned to unify)
- **Styling**: Tailwind CSS with custom configurations
- **UI Components**: Radix UI (accessible, unstyled components)
- **Animation**: CSS transitions, react-confetti for celebration effects
- **API Client**: TanStack React Query for data fetching and caching
- **Form Handling**: React Hook Form with Zod validation

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
- **tailwindcss**: For utility-first CSS styling
- **zod**: For runtime type validation
- **wouter**: Lightweight routing solution
- **radix-ui**: Component primitives for accessible UI elements

## Development Environment
- The application uses Vite for fast development and optimized production builds
- TypeScript is configured for both client and server
- PostCSS and Tailwind are configured for styling
- Cross-environment variables manage development vs. production settings

## Deployment
- The application is designed to be deployed on Vercel or Netlify
- Build process combines frontend and backend into a single distributable
- Static assets are optimized during the build process

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

## Debugging Notes
- Recent debugging involved heavy use of `console.log` to trace state updates and effect execution order.
- Identified and resolved infinite loops caused by unstable function references in `useEffect` dependencies (fixed using `useCallback`).
- Addressed Local Storage corruption by ensuring only one context (`ProgressContext`) writes to the primary progress key (`overallQuizProgress`) with a consistent data structure.

---
**Note:**
- Local Storage usage is now simplified, primarily managed by `ProgressContext`.
- The project is moving toward a unified quiz context for all quiz types, with robust localStorage persistence and hydration to ensure state is always correct and recoverable. 