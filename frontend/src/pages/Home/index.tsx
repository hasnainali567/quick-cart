import { Button } from "@/components/ui/button";
import { signOut, useSession } from "@/lib/auth";
import React from "react";

const Home = () => {
  const session = useSession();
  return (
    <div>
        {session.data?.user.name}
      <Button onClick={async () => await signOut()}>{session.data ? 'SIGN OUT' : "SINGED OUT"}</Button>
    </div>
  );
};

export default Home;
