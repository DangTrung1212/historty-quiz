# Active Context

## Current Focus
- Ensuring robust and consistent state management for all quiz types (MCQ and DungSai)
- Preparing for a major refactor to unify quiz logic and context

## Recently Completed
- Fixed state reset and navigation bugs for Đúng/Sai (DungSai) quiz
- Fixed infinite render loop in DungSaiQuiz component
- Made state reset logic consistent for all quiz types (retake, navigation, etc.)
- Improved context provider placement and usage to avoid unmount/remount bugs
- Decoupled navigation from state reset (using router hooks, not window.location)

## In Progress
- Planning and designing a unified QuizContext to handle all quiz types
- Identifying shared logic and moving it to pure functions/hooks

## Next Steps
1. Refactor to a single, unified QuizContext for all quiz types
2. Move business logic (scoring, validation) to pure functions in lib/
3. Update all components and pages to use the new context API
4. Update documentation and Memory Bank to reflect the new architecture

## Active Decisions
- **Unification:** Move away from separate contexts for each quiz type
- **Encapsulation:** All state transitions (start, answer, reset, complete) will be handled by context methods
- **Testing:** Pure logic functions will be tested in isolation

## Blockers/Questions
- Need to design a flexible data model for unified quiz state
- Ensure backward compatibility with existing progress data if possible
- Plan for incremental migration to minimize disruption

## New Issues & Notes
- Issue: When clicking 'Chọn Trắc Nghiệm I', the question is re-rendered (potential unnecessary rerender or state reset).
- Implement reward function and UI should be done in a separate branch (not in current mainline work). 