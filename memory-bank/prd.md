# **Product Requirements Document (PRD)**  
**Project:** *Sử Nhanh* – History Quiz App  
**Goal:** A React-based web app for practicing history for Vietnam's national exam, with interactive rewards (unlockable image + letter) for high scores.  

---

## **1. Overview**  
- **Target Audience:** Vietnamese high school students preparing for the national graduation exam.  
- **Core Philosophy:** **Learning through rewards** – Users unlock a hidden image and personalized letter as they master history topics.  
- **Tech Stack:**  
  - **Frontend:** React (with Hooks/Context API), Tailwind CSS (or Chakra UI).  
  - **Data:** Questions stored in `question-json folder`.  
  - **State:** Local storage for progress tracking.  
  - **Animations:** CSS transitions and confetti (via `canvas-confetti`).  
  - **Deployment:** Vercel or Netlify (free tier).  

---

## **2. Core Features & User Flows**  
### **Feature Map:**  
1. **Landing Page**  
2. **Quiz Section Selection**  
3. **Quiz Question Screen**  
4. **Quiz Completion Result**  
5. **Answer Review**  
6. **Unlock Animation**  
7. **Final Reward Screen**  

### **User Flow:**  
```plaintext
[LANDING PAGE]  
   ↓  
[SECTION SELECTION]  
   ↓ (Select Section)  
[QUIZ QUESTION SCREEN (Q1–Q10 or Q1–Q5 for Đúng Sai)]  
   ↓ (Score ≥90% in Section)  
[RESULT SCREEN] → [UNLOCK ANIMATION]  
   ↓ (View Answers)  
[ANSWER REVIEW]  
   ↓ (Repeat for All Sections)  
[FINAL REWARD]  
```

---

## **3. Feature Breakdown (Wireframes + Functional Requirements)**  

---

### **3.1 Landing Page**  
**Wireframe:**  
```plaintext  
-------------------------------------------  
|               SỬ NHANH                   |  
|  "Practice history for Vietnam's        |  
|  national exam through quizzes"         |  
|                                         |  
|  [Start Quiz]                           |  
|  Progress: ████ 0/3 sections complete   |  
-------------------------------------------  
```  
**Functional Requirements (FRs):**  
1. Display **app title**, tagline, and **[Start Quiz]** button.  
2. Show **overall section completion** visual (e.g., progress bar + "X sections complete").  
3. Disable back/swipe gestures (entry point of the app).  

---

### **3.2 Quiz Section Selection**  
**Wireframe:**  
```plaintext  
-------------------------------------------  
|        ← BACK    | Section Selection    |  
|------------------------------------------|  
| [ ] Trắc Nghiệm 1                        |  
| [ ] Trắc Nghiệm 2                        |  
| [ ] Trắc Nghiệm Đúng Sai                 |  
|------------------------------------------|  
| [START SELECTED SECTION]                 |  
| [RESET PROGRESS]                         |  
-------------------------------------------  
```  
**FRs:**  
1. Allow **single-section selection** via radio buttons.  
2. **[START]** button disabled until a section is selected.  
3. **[RESET PROGRESS]** clears localStorage and resets section statuses.  
4. **← BACK** returns to Landing Page.  

---

### **3.3 Quiz Question Screen**  
**Wireframe:**  
```plaintext  
----------------------------------------------------------------------
| BACK      ←  [Q3/10]  →       |   Trắc Nghiệm 2             |
| BACK      ←  [Q3/5]   →       |   Trắc Nghiệm Đúng Sai         |
----------------------------------------------------------------------
|  What event marked Vietnam's independence?                         |
|                                                                   |
| [A] August Revolution                                              |
| [B] Geneva Accords                                                 |
| [C] Fall of Saigon                                                 |
| [D] Fall of Hanoi                                                  |
----------------------------------------------------------------------  
```  
**FRs:**  
1. **Single-click answering**: Immediate validation & auto-save to localStorage on selection.  
2. **← / → arrows** for **question navigation** (from Q1–Q10 or Q1–Q5 for Đúng Sai).  
3. **[BACK]** button exits quiz and returns to Section Selection immediately.  
4. Display:  
   - Current **question number** (Q3/10 or Q3/5).  
   - **Section name** in header.  

---

### **3.4 Quiz Completion Result**  
**Wireframe:**  
```plaintext  
-------------------------------------------  
| ← BACK     | Section Complete           |  
|-----------------------------------------|  
|          ✅ Your Score: 92%             |  
|                                          |  
| [VIEW ANSWERS]                           |  
| [CHOOSE ANOTHER SECTION]                 |  
-------------------------------------------  
```  
**FRs:**  
1. Show **final score** (rounded %) after quiz.  
2. Trigger **confetti animation** + **image slice reveal** if score ≥90%.  
3. **[VIEW ANSWERS]** redirects to Answer Review Page.  
4. **[CHOOSE ANOTHER SECTION]** returns to Section Selection.  

---

### **3.5 Answer Review Page**  
**Wireframe:**  
```plaintext  
-------------------------------------------  
| ← BACK   |    Review Answers            |  
|-----------------------------------------|  
| Q1: Causes of Civil War (1850–65)       |  
| Your Answer:  ⇒ [X] Option C / Incorrect |  
| [SHOW CORRECT ANSWER]                   |  
| Explanation: The solution lies in the... |  
|                                          |  
|         [BACK TO QUIZ]                  |  
-------------------------------------------  
```  
**FRs:**  
1. Display each question with:  
   - Selected answer (highlighted if incorrect).  
   - Button to **show/hide** correct answer (default: hidden).  
   - Optional **explanation** (from `questions.json`).  
2. Auto-save toggle state (show/hide) in localStorage (optional UX enhancement).  

---

### **3.6 Unlock Animation**  
**Wireframe:**  
```plaintext  
-------------------------------------------  
|          🎉 CONGRATULATIONS!              |  
|                                           |  
| You've unlocked a new piece:             |  
|                                           |  
|  (Partial image reveal + champagne icon) |  
|                                           |  
|         [NEXT SECTION]                   |  
-------------------------------------------  
```  
**FRs:**  
1. Trigger **confetti animation** on unlock.  
2. Reveal **a slice of the composite image** with CSS transition.  
3. Save unlocked slice in localStorage.  
4. **[NEXT SECTION]** returns to Section Selection.  

---

### **3.7 Final Reward Screen**  
**Wireframe:**  
```plaintext  
-------------------------------------------  
| ← BACK     | Full Unlock Achieved       |  
|-----------------------------------------|  
| (Fully revealed image with animation)   |  
|                                         |  
| "Dear Student, your exceptional..."     |  
|                                         |  
|    [RETRY ALL]         [SHARE]          |  
-------------------------------------------  
```  
**FRs:**  
1. Show **full composite image** with smooth animation.  
2. Display **personalized letter** with motivational text.  
3. **[RETRY ALL]** clears localStorage and resets progress.  
4. **[SHARE]** generates a screenshot/shareable link (platform TBD).  

---

## **4. Non-Functional Requirements**  
### **Technical Specs:**  
1. **LocalStorage:**  
   - Store progress (section completion, total %), and unlocked image slices.  
   - Ensure data persists across sessions.  

---

**Note:**  
- The app now has **three main sections**: "Trắc Nghiệm 1" (10 questions), "Trắc Nghiệm 2" (10 questions), and **"Trắc Nghiệm Đúng Sai"** (5 questions, can be implemented later).  
- All static section data has been removed; everything is API-driven and dynamic.  