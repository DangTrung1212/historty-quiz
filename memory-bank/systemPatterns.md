# System Patterns

## Architecture Overview
The application follows a modern React architecture with a client-server structure:

```
HistoryQuizVN/
├── client/                # React frontend
│   └── src/
│       ├── components/    # UI components
│       ├── contexts/      # React Context providers
│       ├── hooks/         # Custom React hooks
│       ├── lib/           # Utility functions
│       └── pages/         # Page components
├── server/                # Backend server
│   ├── handlers/          # API request handlers
│   └── question-json/     # Quiz question data
└── shared/                # Shared types and utilities
```

## State Management
The application uses React Context API for global state management:

1. **ProgressContext**: Tracks quiz completion status, scores, and unlocked rewards
2. **MultipleChoiceQuizContext**: Manages state for multiple-choice quiz sections
3. **DungSaiQuizContext**: Manages state for true/false quiz section

Local storage is used to persist user progress between sessions.

## Component Structure
- UI components are built following Atomic Design principles with a separation of concerns
- Radix UI is used for accessible, unstyled components that are then styled with Tailwind CSS
- Components are structured to be reusable and maintainable

## Routing
- Routing is implemented using the Wouter library
- The application has the following routes:
  - `/`: Landing page
  - `/quiz-selection`: Quiz section selection page
  - `/quiz/:sectionId`: Quiz interaction page
  - `/results/:sectionId`: Quiz results page
  - `/reward`: Final reward page

## Data Flow
1. Question data is stored on the server in the question-json folder
2. The client fetches questions via API calls
3. User answers are processed client-side
4. Progress is stored locally in the browser's localStorage
5. No server-side persistence is required for user data

## Design Patterns
- **Provider Pattern**: Used with React Context to provide state across components
- **Custom Hooks**: Encapsulate and reuse stateful logic
- **Compound Components**: Used for complex UI components with multiple related parts 