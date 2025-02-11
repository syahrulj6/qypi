"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "~/components/ui/button";

type SettingsType = {
  title: string;
  link: string;
};

const settings: SettingsType[] = [
  {
    title: "User",
    link: "/dashboard/settings",
  },
  {
    title: "Integrations",
    link: "/dashboard/settings/integrations",
  },
  {
    title: "Security",
    link: "/dashboard/settings/security",
  },
];

export const SettingsHeader = () => {
  const pathname = usePathname();

  return (
    <nav className="flex w-fit items-center gap-4">
      {settings.map((setting, index) => {
        const isActive = pathname === setting.link;
        return (
          <Button
            key={index}
            asChild
            variant={isActive ? "default" : "secondary"}
          >
            <Link href={setting.link}>{setting.title}</Link>
          </Button>
        );
      })}
    </nav>
  );
};
