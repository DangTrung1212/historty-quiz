# System Patterns

## Architecture Overview
The application follows a modern React architecture with a client-server structure:

```
HistoryQuizVN/
├── client/                # React frontend
│   └── src/
│       ├── components/    # UI components
│       ├── contexts/      # React Context providers
│       ├── hooks/         # Custom React hooks
│       ├── lib/           # Utility functions
│       └── pages/         # Page components
├── server/                # Backend server
│   ├── handlers/          # API request handlers
│   └── question-json/     # Quiz question data
└── shared/                # Shared types and utilities
```

## State Management
The application currently uses **separate React Contexts** for quiz state:

1. **ProgressContext**: Tracks quiz completion status, scores, and unlocked rewards
2. **MultipleChoiceQuizContext**: Manages state for multiple-choice quiz sections
3. **DungSaiQuizContext**: Manages state for true/false quiz section

Local storage is used to persist user progress between sessions.

### Recent Improvements & Best Practices
- **Unified Reset Logic:** Both quiz types now reset state (answers, progress) in a consistent way when retaking or starting a new quiz.
- **Navigation Decoupling:** Navigation is now handled using router hooks after state is reset, not with window.location or setTimeout hacks.
- **Infinite Loop Fixes:** State updates in components (like DungSaiQuiz) are now guarded to prevent infinite re-renders.
- **Context Placement:** Providers are placed at the top level to avoid unmount/remount bugs.

### Planned Refactor
- **Unify Quiz Contexts:** Move to a single `QuizContext` that handles all quiz types, reducing duplication and bugs.
- **Encapsulate State Transitions:** All quiz state changes (start, answer, reset, complete) will be handled by context methods, not scattered across pages/components.
- **Pure Logic Functions:** Move scoring and validation logic to pure functions in `lib/` for easier testing and maintenance.

## Component Structure
- UI components are built following Atomic Design principles with a separation of concerns
- Radix UI is used for accessible, unstyled components that are then styled with Tailwind CSS
- Components are structured to be reusable and maintainable

## Routing
- Routing is implemented using the Wouter library
- The application has the following routes:
  - `/`: Landing page
  - `/quiz-selection`: Quiz section selection page
  - `/quiz/:sectionId`: Quiz interaction page
  - `/results/:sectionId`: Quiz results page
  - `/reward`: Final reward page

## Data Flow
1. Question data is stored on the server in the question-json folder
2. The client fetches questions via API calls
3. User answers are processed client-side
4. Progress is stored locally in the browser's localStorage
5. No server-side persistence is required for user data

## Design Patterns
- **Provider Pattern**: Used with React Context to provide state across components
- **Custom Hooks**: Encapsulate and reuse stateful logic
- **Compound Components**: Used for complex UI components with multiple related parts

---
**Note:**
- The project is moving toward a more robust, unified context and state management system to reduce bugs and improve maintainability. 