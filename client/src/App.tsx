import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Pronunciation from "./pages/Pronunciation";
import MandarinPronunciation from "./pages/MandarinPronunciation";
import Message from "./pages/Message";
import Culture from "./pages/Culture";
import DongLearn from "./pages/DongLearn";
import MandarinLearn from "./pages/MandarinLearn";
import Profile from "./pages/Profile";
import ToneCompare from "./pages/ToneCompare";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/pronunciation" component={Pronunciation} />
      <Route path="/mandarin-pronunciation" component={MandarinPronunciation} />
      <Route path="/message" component={Message} />
      <Route path="/culture" component={Culture} />
      <Route path="/dong-learn" component={DongLearn} />
      <Route path="/mandarin-learn" component={MandarinLearn} />
      <Route path="/profile" component={Profile} />
      <Route path="/tone-compare" component={ToneCompare} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
