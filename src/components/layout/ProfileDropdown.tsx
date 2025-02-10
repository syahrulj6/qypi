"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import Link from "next/link";
import type { Session } from "@supabase/supabase-js";
import Image from "next/image";
import { ChevronDown, Moon, Sun } from "lucide-react";
import { api } from "~/utils/api";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface ProfileDropdownProps {
  session: Session | null;
  handleSignOut: () => void;
}

export const ProfileDropdown = ({ handleSignOut }: ProfileDropdownProps) => {
  const { data: getProfileData } = api.profile.getProfile.useQuery(undefined, {
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 3000),
  });

  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const profilePictureUrl =
    getProfileData?.profilePictureUrl ?? "/blank-profile-picture.png";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="group -mr-2 flex cursor-pointer gap-2">
          <Image
            src={profilePictureUrl}
            alt="profile picture"
            width={30}
            height={30}
            className="rounded-full object-cover"
          />
          <button className="rounded-full text-primary/60 transition-colors group-hover:text-primary">
            <ChevronDown className="h-5 w-5" />
          </button>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-24 md:w-44">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/profile" className="hover:cursor-pointer">
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/dashboard" className="hover:cursor-pointer">
              Dashboard
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
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
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Button
            variant="ghost"
            onClick={handleSignOut}
            className="hover:cursor-pointer"
          >
            Log out
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
