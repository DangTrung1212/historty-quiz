# System Patterns & Architecture

The project utilizes the following system patterns and architectural choices:

-   **Component-Based Architecture**: Built with React and TypeScript. Key interactive elements like the `PageTurningCard` are encapsulated as reusable components.
-   **Client-Side Routing**: Using `wouter` for navigation between different views (landing page, quiz sections, reward page).
-   **State Management**:
    -   Leveraging React Context API for global state such as `MultipleChoiceQuizContext` (managing quiz data, current question, user answers) and `ProgressContext` (tracking overall quiz progress and scores).
    -   Component-level state (`useState`, `useEffect`) is used for UI logic, animations, and responsiveness (e.g., in `PageTurningCard` for flip state, animation control, and screen size detection).
-   **Animations**: Implemented with `framer-motion` for smooth UI transitions, page-turning effects in the `PageTurningCard`, and decorative animations (e.g., floating hearts, sparkles on the landing page).
-   **Styling**: Tailwind CSS is used for utility-first styling, enabling rapid UI development and responsive design. Custom styles and theming (purple/pink gradients) are applied using Tailwind's configuration and utility classes.
-   **Iconography**: `lucide-react` provides a library of SVG icons used throughout the application for visual cues and enhancements (e.g., hearts, stars).
-   **Responsive Design**:
    -   Components like `PageTurningCard` and `landing.tsx` are designed to be responsive.
    -   Tailwind CSS responsive prefixes (e.g., `md:`, `sm:`) are used for layout adjustments.
    -   JavaScript-driven logic (`useEffect` with `window.innerWidth` and resize listeners) is employed for more complex responsive behaviors, such as adapting animations and layouts dynamically (e.g., `PageTurningCard` stacking vertically on mobile vs. spreading horizontally on desktop).
-   **Theming**: A consistent romantic and celebratory theme (purple/pink gradients, festive decorative elements) is applied across key components and pages (`PageTurningCard`, `reward.tsx`, `landing.tsx`) to create a cohesive user experience.
-   **Data Handling**: Quiz questions are sourced from JSON files located in the `server/question-json/` directory. Handlers on the server-side (e.g., `server/handlers/quizHandlers.ts`) are responsible for managing the fetching and serving of this data to the client application.

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