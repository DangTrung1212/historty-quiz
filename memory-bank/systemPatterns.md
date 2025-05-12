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
The application uses **separate React Contexts** for different aspects of state:

1.  **`ProgressContext`**: Manages overall progress, high scores, and reward state. Persists data to Local Storage (`overallQuizProgress` key) and serves as the single source of truth for completion status and highest scores across sessions.
2.  **`MultipleChoiceQuizContext`**: Manages state *during* an active multiple-choice quiz session (current question index, answers for the current attempt). Does *not* persist data to Local Storage anymore.
3.  **`DungSaiQuizContext`**: Manages state *during* an active true/false quiz session. Does *not* persist data. Resets its state via `useEffect` in `quiz.tsx` when the component mounts for the Dung Sai section.

Local storage (`overallQuizProgress` key) is used solely by `ProgressContext`.

### Recent Improvements & Best Practices
- **Unified Reset Logic:** Quiz contexts reset state correctly on retake or re-navigation.
- **Navigation Decoupling:** Navigation uses router hooks, separated from state updates.
- **Infinite Loop Fixes:** Context functions wrapped in `useCallback` prevent infinite re-renders caused by changing function references in `useEffect` dependencies.
- **Context Placement:** Providers are at the top level.
- **State Reset Pattern:** For non-persistent context state (like `DungSaiQuizContext`), state is reset via a `useEffect` hook in the consuming page component (`quiz.tsx`) based on route parameters (`sectionId`) to ensure a clean state on navigation.
- **Single Source of Truth (Progress):** `ProgressContext` is the sole owner of persistent progress data.

### Planned Refactor (Deprioritized)
- **Unify Quiz Contexts:** Combine `MultipleChoiceQuizContext` and `DungSaiQuizContext`.
- **Encapsulate State Transitions:** Ensure all quiz state changes are handled solely by context methods.
- **Pure Logic Functions:** Move scoring/validation to `lib/`.

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
1. Question data stored on the server.
2. Client fetches questions via API.
3. User answers processed client-side within specific quiz contexts (`MultipleChoiceQuizContext`, `DungSaiQuizContext`).
4. On quiz completion, the score is passed to `ProgressContext` which updates its state (`completed`, `highScoreAchieved`, `highestScore`).
5. `ProgressContext` saves its state to the `overallQuizProgress` key in localStorage.
6. On app load, `ProgressContext` hydrates its state from `overallQuizProgress`.

## Design Patterns
- **Provider Pattern**: Used with React Context.
- **Custom Hooks**: Encapsulate stateful logic.
- **Compound Components**: For complex UI.
- **`useCallback` Hook**: To stabilize function references passed from contexts or used in `useEffect` dependencies.

---
**Note:**
- The state management is now more robust, with clear ownership of persistent progress data by `ProgressContext`. The separate contexts for active quiz sessions help isolate state during quiz attempts. 