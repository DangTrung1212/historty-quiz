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
import { MultipleChoiceQuizProvider } from "./contexts/MultipleChoiceQuizContext";
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
        <ProgressProvider>
          <MultipleChoiceQuizProvider>
            <DungSaiQuizProvider>
              <Toaster />
              <Router />
            </DungSaiQuizProvider>
          </MultipleChoiceQuizProvider>
        </ProgressProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
