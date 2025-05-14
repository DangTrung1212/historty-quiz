# Active Context

## Current Focus
- **Display Unlocked Image Piece on Results Page**: Implement functionality on the quiz results page (`/results/:sectionId`) to show the specific image piece the user has just unlocked if they achieve a high score (≥90%) for that section.

## Recently Completed
- **Progress Modal UI Refactor (`ProgressModal.tsx`):**
    - Replaced the 2x2 grid for reward images with a 3-part horizontal flex display.
    - Each part corresponds to one of the three main quiz sections and shows "Đã mở khóa" (with the image piece) or "Chưa mở khóa" (with a lock icon).
    - Unlocked image pieces are displayed (blurred if not all sections are complete, clear if all are).
    - Added a button to navigate to the `/reward` page when all sections are completed with high scores.
- **Corrected Section ID Mapping (`ProgressModal.tsx`):** Updated `orderedSectionIds` to use actual IDs (`'1'`, `'2'`, `'3'`) to fix the "0/3 đã mở khóa" display error, ensuring accurate progress tracking for reward images.
- **Section Card Update (`SectionCard.tsx`):**
    - Refactored to use `ProgressContext` to fetch and display persistent completion status (`isCompleted`), `highScoreAchieved`, and `highestScore`.
    - Star icon now correctly reflects `highScoreAchieved` status on page load (filled yellow for high score, filled gray for completed without high score, outline gray if not completed).
- **Reward Page Refactor (`/reward` page - `client/src/pages/reward.tsx`):**
    - Deleted the redundant `client/src/pages/RewardPage.tsx`.
    - Modified the existing `client/src/pages/reward.tsx` to:
        - Define the congratulatory letter content statically within the component, removing reliance on `personalLetter` from `ProgressContext`.
        - Display the final reward image by assembling the three image parts (`rewardImageParts`), consistent with the `ProgressModal`'s fully unlocked state.
        - Enhanced overall styling for a more celebratory feel.

## In Progress
- Finalizing Local Storage consolidation by removing now-unused storage functions related to `quiz_progress`.
- Planning the UI and logic for the progress widget and its integration with the reward image.

## Next Steps (Display Unlocked Image on Results Page)
1.  **Identify Results Page Component:** Confirm the file path for the quiz results page (likely `client/src/pages/ResultsPage.tsx` or similar).
2.  **Access Progress & Section ID:** The results page component needs to:
    *   Receive the current `sectionId` (e.g., from route parameters).
    *   Use the `useProgress()` hook to get the `progress` state.
3.  **Determine if High Score Achieved:** Check `progress.sections[sectionId]?.highScoreAchieved`.
4.  **Map Section ID to Image Piece:**
    *   Maintain or import the `orderedSectionIds` array (e.g., `['1', '2', '3']`) and the `rewardImageParts` array (image paths).
    *   If a high score is achieved for the current `sectionId`, find its index in `orderedSectionIds` to select the corresponding image from `rewardImageParts`.
5.  **Display Image Piece:** If unlocked, render the specific image piece. Consider a subtle animation or emphasis.
6.  **Conditional Display:** Only show this if `highScoreAchieved` is true for the *current* quiz attempt/result being viewed.
7.  **Styling:** Ensure the image piece is displayed clearly and attractively.

## Active Decisions
- **Single Source of Truth for Progress:** `ProgressContext` and the `overallQuizProgress` Local Storage key remain the definitive sources for completion status, high scores, and reward image data.
- **Component-Specific Content:** Presentational content like the final reward letter is best kept static within the relevant page component rather than in context.
- **Consistent Reward Image Logic:** The mapping of section IDs to specific image pieces should be consistent between `ProgressModal` and the results page.

## Blockers/Questions
- None currently.

## New Issues & Notes
- The previous inability to select MCQ answers was likely a temporary side-effect of the infinite loop and should be re-verified as fixed. 