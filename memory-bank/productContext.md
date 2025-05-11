# Product Context

## Problem Statement
Vietnamese high school students preparing for the national graduation exam need effective and engaging ways to practice history content. Traditional study methods can be monotonous and fail to incentivize consistent practice.

## Solution
Sử Nhanh provides an interactive quiz application that:
1. Makes history practice more engaging through gamification
2. Rewards achievement with visual reinforcement (unlockable image pieces)
3. Provides immediate feedback on quiz performance
4. Supports self-assessment through answer review functionality

## User Experience Goals
1. **Simple and Intuitive**: App flow should be immediately understandable to high school students
2. **Rewarding**: Create a sense of achievement and progress through visual rewards
3. **Educational**: Support learning through proper question design and answer explanations
4. **Motivational**: Encourage continued practice through the progressive unlocking mechanism
5. **Consistent and Robust**: Ensure quiz state and answer review are always correct, regardless of quiz type or navigation.

## Quiz Sections
The app includes three main quiz sections:
1. **Trắc Nghiệm 1**: 10 multiple-choice questions
2. **Trắc Nghiệm 2**: 10 multiple-choice questions 
3. **Trắc Nghiệm Đúng Sai**: 5 true/false questions

## Reward System
- Users unlock a piece of a hidden image when they score ≥90% on a quiz section
- After completing all sections with high scores, a full image and personalized congratulatory letter are revealed
- This system provides immediate gratification and a longer-term goal to work toward

## User Flow
1. Landing page with app introduction and progress overview
2. Section selection for choosing which quiz to attempt
3. Quiz question screen for answering questions
4. Results screen showing score and unlocking image piece (if score is high enough)
5. Answer review screen for learning from mistakes
6. Final reward screen when all sections are completed successfully

---

**Note:**
- Recent bugs and fixes have highlighted the importance of robust, unified state management for all quiz types. There is a plan to refactor the quiz logic into a single, maintainable context to ensure a seamless and bug-free user experience. 