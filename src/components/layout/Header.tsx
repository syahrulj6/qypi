import Link from "next/link";
import { Button } from "../ui/button";
import { useSession } from "~/hooks/useSession";
import { ProfileDropdown } from "./ProfileDropdown";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export const Header = () => {
  const { session, handleSignOut } = useSession();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <header
      className={`fixed top-0 z-10 flex h-16 w-full items-center justify-between border-b-2 border-border bg-secondary px-4 transition-transform duration-300 md:h-20 md:px-8 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <Link
        href={"/"}
        className="text-2xl font-bold text-primary hover:hover:cursor-pointer md:text-3xl"
      >
        Qypi
      </Link>

      <div className="flex items-center gap-4">
        {session ? (
          <ProfileDropdown session={session} handleSignOut={handleSignOut} />
        ) : (
          <div className="flex items-center gap-3">
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="hover:cursor-pointer"
              >
                {theme === "dark" ? <Sun /> : <Moon />}
              </Button>
            )}
            <Button asChild variant="secondary">
              <Link href="/login">Login</Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};
