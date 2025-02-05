import Link from "next/link";
import { Button } from "../ui/button";
import { useSession } from "~/hooks/useSession";
import { ProfileDropdown } from "./ProfileDropdown";

export const Header = () => {
  const { session, handleSignOut } = useSession();

  return (
    <header className="flex h-16 items-center justify-between border-b-2 border-border px-4 md:h-20 md:px-8">
      <Link
        href={"/"}
        className="text-2xl font-bold text-primary hover:hover:cursor-pointer md:text-3xl"
      >
        Qypi
      </Link>

      <div className="flex items-center gap-4">
        <div>
          {session ? (
            <ProfileDropdown session={session} handleSignOut={handleSignOut} />
          ) : (
            <Button asChild variant="secondary">
              <Link href="/login">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
