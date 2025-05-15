# Active Context

## Current Focus
- **Resolve Score Calculation/Display Discrepancy (`results.tsx`)**: The `scorePercent` variable on the results page might not accurately reflect the user's actual score (e.g., user reports 90% actual vs. 80% displayed). Awaiting clarification on the specific quiz section to investigate the relevant scoring logic (`calculateMultipleChoiceScore` or `calculateDungSaiScore`).

## Recently Completed
- **Fixed `getImageRevealLevel()` Timing Issue (`results.tsx` & `ProgressContext.tsx`):**
    - Refactored `ProgressContext.updateSectionProgress` to calculate and return `newRevealLevel` and `newAllSectionsCompleted` status directly, based on the updated progress data.
    - Updated `results.tsx` to use these returned values, ensuring accurate and synchronized state for `ProgressModal` trigger logic and final reward navigation.
- **Results Page - First-Time High Score Celebration (`client/src/pages/results.tsx`):**
    - Implemented confetti effect and a special notification message for first-time high scores.
- **Local Storage Cleanup (`client/src/lib/storage.ts`, `client/src/contexts/MultipleChoiceQuizContext.tsx`):**
    - Removed unused legacy Local Storage functions and keys.
- **UI Polish (`client/src/pages/quiz-selection.tsx`):**
    - Improved header subtitle and progress widget clarity.
    - Resolved a linter error.

## In Progress
- Awaiting user feedback on which quiz section exhibited the score discrepancy.

## Next Steps
1.  **Investigate and Fix Score Discrepancy (`results.tsx` & relevant scoring functions):**
    *   Once the user specifies the quiz section, review the `calculateScore` function for that section type and how `scorePercent` is derived in `results.tsx`.
    *   Identify and correct any logical errors.
2.  **Test Results Page Extensively:** After the score fix, thoroughly test various scenarios including score accuracy for all quiz types.
3.  **UI/UX Polish on `results.tsx`**: Address general UX improvements as noted by the user.

## Active Decisions
- **Prioritization:** Fixing the score discrepancy on `results.tsx` is the highest priority.
- **Single Source of Truth for Progress:** `ProgressContext` and `overallQuizProgress` Local Storage key.

## Blockers/Questions
- **Score Discrepancy Clarification:** Need to know which quiz section (1, 2, or 3) showed the 90% vs. 80% score mismatch.

## New Issues & Notes
- **Score Discrepancy in `results.tsx`**: `scorePercent` may not be accurate. Section TBD. (High Priority)
- Minor stale comments at the end of `client/src/lib/storage.ts` (Low priority). 