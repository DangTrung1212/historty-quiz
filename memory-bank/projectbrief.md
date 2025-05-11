# Project Brief: Sử Nhanh (History Quiz App)

## Overview
Sử Nhanh is a React-based web application designed for Vietnamese high school students preparing for the national graduation exam. The app provides an interactive way to practice history through quizzes, with a reward system that unlocks parts of a hidden image and a personalized letter as users achieve high scores across different quiz sections.

## Core Requirements
- Provide multiple history quiz sections with different question types
- Track user progress and quiz scores using local storage
- Implement a reward system that unlocks pieces of a hidden image upon achieving high scores (≥90%)
- Allow users to review their answers after completing quizzes
- Ensure a responsive, intuitive interface suitable for high school students

## Target Audience
Vietnamese high school students preparing for the national graduation exam.

## Core Philosophy
**Learning through rewards** – Users unlock a hidden image and personalized letter as they master history topics.

## Technical Constraints
- Frontend: React with hooks and context API for state management
- Styling: Tailwind CSS 
- Data storage: Local storage for progress tracking
- Question data: Stored in server's question-json folder
- Animations: CSS transitions and confetti for reward animations
- Deployment: Vercel or Netlify (free tier) 