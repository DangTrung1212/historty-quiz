# Active Context

## Current Focus
- Implementing the reward feature.
- Improving the application's UI and UX.
- Continuing to address any outstanding bugs.

## Recently Completed
- Fixed state reset and navigation bugs for Đúng/Sai (DungSai) quiz
- Fixed infinite render loop in DungSaiQuiz component
- Made state reset logic consistent for all quiz types (retake, navigation, etc.)
- Improved context provider placement and usage to avoid unmount/remount bugs
- Decoupled navigation from state reset (using router hooks, not window.location)
- Resolved MCQ re-render issue when starting a quiz (progress now persists within a session).
- Updated MCQ answer review to always show explanations if available.
- Fixed "Làm lại" button on results page to correctly reset MCQ quiz progress.

## In Progress
- Developing the reward system mechanics and UI.
- Identifying areas for UI/UX enhancements (including color theme).
- Ongoing bug fixing as issues are identified.

## Next Steps
1.  **Implement Reward Feature**:
    *   Finalize image slice unlocking mechanism.
    *   Develop the final reward screen (full image and congratulatory message).
    *   Integrate reward system with quiz completion and scoring.
2.  **Improve UI/UX**:
    *   Implement the new color theme.
    *   Enhance overall visual appeal and user experience.
    *   Optimize for responsive design.
    *   Address accessibility improvements.
3.  **Bug Fixing**:
    *   Continue to identify and resolve any remaining bugs.
4.  **Testing & Polish**:
    *   Thoroughly test all new features, UI changes, and bug fixes.
5.  **Documentation**:
    *   Update Memory Bank and any other relevant documentation.

## Active Decisions
- **Unification:** Move away from separate contexts for each quiz type (This decision might be revisited or deprioritized given the new focus).
- **Encapsulation:** All state transitions (start, answer, reset, complete) will be handled by context methods (This decision might be revisited or deprioritized).
- **Testing:** Pure logic functions will be tested in isolation

## Blockers/Questions
- Need to design a flexible data model for unified quiz state
- Ensure backward compatibility with existing progress data if possible
- Plan for incremental migration to minimize disruption

## New Issues & Notes
- The reward feature and UI/UX improvements are the primary focus. Refactoring remains deprioritized.
- Ensure `lib/storage.ts` and its type definitions are reviewed to allow full persistence of `currentQuestion`, `userAnswers`, `startTime`, and `endTime` across sessions for `MultipleChoiceQuizContext` if this becomes a priority. Currently, `currentQuestion` in MCQ resets on new sessions due to type limitations during loading. 