# Active Context

## Current Focus
The project is actively refactoring the "Trắc Nghiệm Đúng Sai" (True/False quiz) section to use its own context (`DungSaiQuizContext`) and a dedicated UI component. The navigation button is now at the bottom of the card, and the UI disables the button until all statements are answered. Score calculation uses custom penalty rules.

## Recently Completed
- Refactored the True/False quiz section to use `DungSaiQuizContext` for data, answer storage, and score calculation
- Implemented a dedicated `DungSaiQuiz` component with a bottom navigation button
- Added logic to disable the navigation button until all statements are answered
- Improved score calculation logic for True/False section (custom penalties)

## In Progress
- Wiring up answer storage and navigation in the parent quiz page for the True/False section
- Ensuring the UI and context are fully integrated for the new flow

## Next Steps
1. Complete answer storage and navigation logic in the parent quiz page for True/False section
2. Test score calculation and result display for True/False section
3. Integrate progress tracking and reward unlocking for the new section

## Active Decisions
- **Separation of Contexts**: True/False section uses its own context for clarity and maintainability
- **Score Calculation**: Custom penalty rules for incorrect answers (0: 100%, 1: 50%, 2: 25%, 3: 10%, all: 0%)
- **UI/UX**: Navigation button at the bottom, disabled until all statements are answered

## Blockers/Questions
- Need to verify the format of question data in the JSON files
- Explore design specifications for the unlockable image components
- Determine exact requirements for the final reward screen
- Understand how the DungSaiQuizContext should differ from MultipleChoiceQuizContext 