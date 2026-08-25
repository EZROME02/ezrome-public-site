/**
 * Signal Ledger design reminder: maintain a dark editorial archive with precise cyan evidence markers.
 */
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import { ChannelPage, CommunityLane, ExploreLane, FootballHub, NotificationsPage, ShortsLane, UploadStudio, WatchPage } from "./pages/HubPages";
import ProjectDetail from "./pages/ProjectDetail";
function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/shorts" component={ShortsLane} />
      <Route path="/football" component={FootballHub} />
      <Route path="/community" component={CommunityLane} />
      <Route path="/explore" component={ExploreLane} />
      <Route path="/create" component={UploadStudio} />
      <Route path="/watch/:id" component={WatchPage} />
      <Route path="/channel/:handle" component={ChannelPage} />
      <Route path="/notifications" component={NotificationsPage} />
      <Route path="/projects/:slug" component={ProjectDetail} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
