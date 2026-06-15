import React from "react";
import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";

const AppLayout = () => {
  return (
    <main className="h-screen max-h-screen w-full overflow-hidden">
      {/* // should not scroll */}
      <Toaster position="top-right" />
      <Outlet />
    </main>
  );
};

export default AppLayout;
