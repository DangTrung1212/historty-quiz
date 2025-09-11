# System Patterns

## Architecture Overview
```
HistoryQuizVN/
├── client/                # React frontend
│   └── src/
│       ├── components/    # UI components (ProgressModal.tsx, SectionCard.tsx, etc.)
│       ├── contexts/      # React Context providers (ProgressContext.tsx, etc.)
│       ├── hooks/         # Custom React hooks
│       ├── lib/           # Utility functions, quiz data types
│       └── pages/         # Page components (quiz-selection.tsx, reward.tsx, ResultsPage.tsx, etc.)
├── server/                # Backend server (Express.js)
│   ├── handlers/          # API request handlers
│   └── question-json/     # Quiz question data (JSON files)
└── shared/                # Shared types and utilities (if any)
```

## State Management
- **`ProgressContext`**: Manages overall progress, high scores, completion status for each quiz section. Persists data to Local Storage (`overallQuizProgress` key). This is the single source of truth for persistent user achievements and reward status.
- **`MultipleChoiceQuizContext`**: Manages state *during* an active multiple-choice quiz session (current question index, answers for the current attempt). Does *not* persist data to Local Storage.
- **`DungSaiQuizContext`**: Manages state *during* an active true/false quiz session. Does *not* persist data.

Key data in `ProgressContext`'s `progress.sections` object (keyed by section ID like `'1'`, `'2'`, `'3'`):
  - `completed: boolean`
  - `highScoreAchieved: boolean` (true if score >= 90%)
  - `highestScore: number`

## UI Components & Reward System
- **`ProgressModal.tsx`**: Accessed from the quiz selection page. Displays overall progress and a 3-part visual reward. Each part corresponds to a main quiz section (`'1'`, `'2'`, `'3'`). Unlocked parts show an image piece (blurred until all are unlocked). Navigates to `/reward` upon full completion.
- **`SectionCard.tsx`**: Used on the quiz selection page. Displays section title, question count, and a star icon indicating `highScoreAchieved` status (derived from `ProgressContext`). Also shows highest score if completed.
- **`/reward` page (`client/src/pages/reward.tsx`):** Displayed after all sections are completed with high scores. Shows a final assembled 3-part reward image, a static congratulatory letter, confetti, and achievement badges.
- **Quiz Results Page (e.g., `ResultsPage.tsx` - *Next Feature*):** Will display the specific image piece unlocked if a high score is achieved for the current section.

## Routing
- Routing is implemented using Wouter.
- Key routes:
  - `/`: Landing page (or quiz selection)
  - `/quiz-selection`: Quiz section selection page.
  - `/quiz/:sectionId`: Quiz interaction page.
  - `/results/:sectionId`: Quiz results page.
  - `/reward`: Final reward page (displays full image and letter).

## Data Flow for Rewards
1. User completes a quiz.
2. Score is calculated. `ProgressContext.updateSectionProgress` is called with `sectionId`, `score`, and `completed` status.
3. `ProgressContext` updates `highScoreAchieved` (if score >= 90%) and `highestScore` for that section in its state and persists to Local Storage.
4. UI components (`ProgressModal`, `SectionCard`, results page) read from `ProgressContext` to display current progress, stars, and unlocked image pieces.
5. If all sections have `highScoreAchieved`, `ProgressModal` offers navigation to `/reward`.

## Design Patterns
- **Provider Pattern**: Used with React Context for state management.
- **Custom Hooks**: `useProgress`, `useMultipleChoiceQuiz` to consume context.
- **Component-Based Architecture**: UI broken down into reusable components.
- **Static Content in Components**: For elements like the final reward letter, content is kept within the display component rather than in global state.

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

---
**Note:**
- The state management is now more robust, with clear ownership of persistent progress data by `ProgressContext`. The separate contexts for active quiz sessions help isolate state during quiz attempts. 