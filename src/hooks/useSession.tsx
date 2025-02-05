import { useEffect, useState } from "react";
import { supabase } from "~/lib/supabase/client";
import type { Session } from "@supabase/supabase-js";
import { useRouter } from "next/router";

export const useSession = () => {
  const [session, setSession] = useState<Session | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        setSession(data.session);
      } catch (error) {
        console.error("Error fetching session:", error);
      }
    };

    void getSession();
  }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      setSession(null);
      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return { session, handleSignOut };
};
