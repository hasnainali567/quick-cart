import Router from "./router/router";
import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/api/query-client";
import "@fontsource/poppins";

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
