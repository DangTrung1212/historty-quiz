# Product Context: History Quiz VN - Birthday Edition

## 1. Why This Project Exists
This project is a personal endeavor by the USER to create a unique, thoughtful, and impressive digital gift for their crush's birthday. It aims to combine an engaging activity (a history quiz) with a heartfelt, personalized message delivered in a novel and interactive way.

## 2. Problems It Solves
-   Provides a creative and modern alternative to traditional birthday cards.
-   Offers a personalized experience that shows effort and care.
-   Creates a memorable "moment of delight" for the recipient.

## 3. How It Should Work (User Experience Flow)
1.  **Landing Page**: User (crush) is greeted with a visually appealing landing page, consistent with the romantic/celebratory theme. A "Start" button initiates the experience.
2.  **Quiz Sections**: The user progresses through various history quiz sections.
3.  **Progress Tracking**: The application tracks the user's progress and scores.
4.  **Reward Unlocking**: Upon successful completion of the quiz (e.g., all sections completed), the birthday reward is unlocked.
5.  **Interactive Birthday Card**:
    *   The user is presented with a closed card/book.
    *   Interacting with the card (e.g., clicking) triggers an animation, causing the card to open.
    *   The animation and layout are responsive (e.g., pages stack on mobile, spread on desktop).
    *   Upon opening, a personalized birthday message is revealed, potentially across two pages or in a beautifully formatted single view.
6.  **Overall Feel**: The experience should feel polished, celebratory, romantic, and a little magical.

## 4. User Experience Goals
-   **Delight & Surprise**: The core goal is to delight and surprise the recipient with the interactive card and message.
-   **Engagement**: The quiz should be engaging enough to lead the user to the reward.
-   **Ease of Use**: The application should be intuitive and easy to navigate on all devices.
-   **Visual Appeal**: A consistent and attractive theme (purple/pink gradients, festive elements) should enhance the experience.
-   **Personalization**: The birthday message should feel personal and heartfelt.
-   **Smooth Performance**: Animations and transitions should be smooth.
-   **Mobile-First**: The mobile experience must be excellent.

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