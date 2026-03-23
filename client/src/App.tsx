import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation, Router as WouterRouter } from "wouter";
import { useEffect } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Pronunciation from "./pages/Pronunciation";
import MandarinPronunciation from "./pages/MandarinPronunciation";
import Message from "./pages/Message";
import Culture from "./pages/Culture";
import DongLearn from "./pages/DongLearn";
import MandarinLearn from "./pages/MandarinLearn";
import ToneCompare from "./pages/ToneCompare";
import FieldData from "./pages/FieldData";
import Profile from "./pages/Profile";
import AiAssistant from "./pages/AiAssistant";
import AiFloatButton from "./components/AiFloatButton";

// 页面切换时自动滚动到顶部
function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location]);
  return null;
}

function Router() {
  return (
    <>
      <ScrollToTop />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/pronunciation" component={Pronunciation} />
        <Route path="/mandarin-pronunciation" component={MandarinPronunciation} />
        <Route path="/message" component={Message} />
        <Route path="/culture" component={Culture} />
        <Route path="/dong-learn" component={DongLearn} />
        <Route path="/mandarin-learn" component={MandarinLearn} />
        <Route path="/tone-compare" component={ToneCompare} />
        <Route path="/field-data" component={FieldData} />
        <Route path="/profile" component={Profile} />
        <Route path="/ai-assistant" component={AiAssistant} />
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

// base路径：通过Vite define注入（GitHub Pages下为/dong-language，本地开发为空）
declare const __BASE_PATH__: string;
const BASE_PATH = typeof __BASE_PATH__ !== 'undefined' ? __BASE_PATH__ : '';

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <WouterRouter base={BASE_PATH}>
            <Router />
            <AiFloatButton />
          </WouterRouter>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
