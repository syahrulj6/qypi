"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "~/lib/supabase/client";
import { Button } from "../ui/button";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export const Header = () => {
  const { theme, setTheme } = useTheme();
  const [session, setSession] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    };

    getSession();
  }, []);

  return (
    <header className="flex h-16 items-center justify-between border-b-2 border-border px-4 md:h-20 md:px-8">
      <Link
        href={"/"}
        className="text-2xl font-bold text-primary hover:cursor-pointer md:text-3xl"
      >
        Qypi
      </Link>

      <div className="flex items-center gap-4">
        <div>
          {session ? (
            <p>User</p>
          ) : (
            <Button asChild variant="secondary">
              <Link href="/login">Login</Link>
            </Button>
          )}
        </div>

        {mounted && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <Sun /> : <Moon />}
          </Button>
        )}
      </div>
    </header>
  );
};
