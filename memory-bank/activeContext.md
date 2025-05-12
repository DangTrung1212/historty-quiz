# Active Context

## Current Focus
- **Implement Progress Widget:** Design and implement the progress widget on the quiz selection page (`quiz-selection.tsx`).
- **Integrate Reward Image:** Integrate the reward image slices/reveal mechanism directly into the new progress widget.
- **Display Highest Scores:** Show the highest score achieved for each section in the UI (e.g., in the progress widget or on quiz selection cards).

## Recently Completed
- **DungSai Quiz Reset:** Fixed a bug where the DungSai quiz state (answers, current question) was not resetting when navigating back to it. Implemented a `useEffect` in `quiz.tsx` to call `resetDungSaiSection` when the DungSai section is loaded.
- **Infinite Loop Fix (DungSai Reset):** Resolved a "Maximum update depth exceeded" error caused by the DungSai reset logic. This was fixed by wrapping functions in `DungSaiQuizContext` (like `resetDungSaiSection`) with `useCallback` to stabilize their references, preventing the `useEffect` in `quiz.tsx` from looping.
- **Highest Score Tracking:** Enhanced `ProgressContext` to track and store the `highestScore` achieved for each quiz section in `overallQuizProgress` in Local Storage. Added a `getSectionHighestScore` accessor function.
- **Local Storage Consolidation (In Progress):** Began consolidating Local Storage usage. `MultipleChoiceQuizContext` no longer saves its detailed state (questions, answers) to `quiz_progress`. The `overallQuizProgress` key (managed by `ProgressContext`) is now the primary source of truth for persistent reward-related progress.

## In Progress
- Finalizing Local Storage consolidation by removing now-unused storage functions related to `quiz_progress`.
- Planning the UI and logic for the progress widget and its integration with the reward image.

## Next Steps
1.  **Implement Progress Widget UI** on `quiz-selection.tsx`.
2.  **Integrate Reward Image Reveal** into the progress widget.
    *   Logic to determine how many slices to show based on `ProgressContext.getImageRevealLevel()`.
    *   Display corresponding image slices.
3.  **Display Highest Scores** for each section (e.g., on quiz cards or in the widget) using `ProgressContext.getSectionHighestScore()`.
4.  **Cleanup Unused Code:** Remove `saveMcqProgress`, `loadMcqProgress` from `storage.ts` and related imports in `MultipleChoiceQuizContext.tsx`.
5.  **Thorough Testing** of the new widget, reward display, and overall quiz flow.

## Active Decisions
- **Single Source of Truth for Progress:** `ProgressContext` and the `overallQuizProgress` Local Storage key are the definitive sources for completion status, high scores, and reward image reveal levels.
- **Context Function Stability:** Ensure functions exposed by contexts are wrapped in `useCallback` with correct dependencies to prevent unnecessary re-renders and potential loops in consuming components.

## Blockers/Questions
- None currently.

## New Issues & Notes
- The previous inability to select MCQ answers was likely a temporary side-effect of the infinite loop and should be re-verified as fixed. 