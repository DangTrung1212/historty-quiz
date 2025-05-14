import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import QuizSelection from "@/pages/quiz-selection";
import Quiz from "@/pages/quiz";
import Results from "@/pages/results";
import Reward from "@/pages/reward";
import { ProgressProvider } from "./contexts/ProgressContext";
import { MultipleChoiceQuizProvider, useMultipleChoiceQuiz } from "./contexts/MultipleChoiceQuizContext";
import { DungSaiQuizProvider } from "./contexts/DungSaiQuizContext";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/quiz-selection" component={QuizSelection} />
      <Route path="/quiz/:sectionId" component={Quiz} />
      <Route path="/results/:sectionId" component={Results} />
      <Route path="/reward" component={Reward} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <MultipleChoiceQuizProvider>
          <ProgressProvider>
            <DungSaiQuizProvider>
              <GlobalLoaderAndRouter />
              <Toaster />
            </DungSaiQuizProvider>
          </ProgressProvider>
        </MultipleChoiceQuizProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

function GlobalLoaderAndRouter() {
  const { sections } = useMultipleChoiceQuiz();
  if (sections.length === 0) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <svg className="animate-spin h-10 w-10 text-primary mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
          </svg>
          <span className="text-gray-500 text-lg">Đang tải...</span>
        </div>
      </section>
    );
  }
  return <Router />;
}

export default App;
