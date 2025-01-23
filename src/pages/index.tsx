import { Button } from "~/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { api } from "~/utils/api";
import { useTheme } from "next-themes";

export default function Home() {
  const hello = api.post.hello.useQuery({ text: "from tRPC" });

  const { setTheme } = useTheme();

  return (
    <>
      <main className="bg-background flex min-h-screen flex-col items-center justify-center gap-y-6">
        <h1 className="text-primary text-3xl">Hello World</h1>
        <Button>Test</Button>
        <Button size="icon" onClick={() => setTheme("dark")}>
          <Moon />
        </Button>
        <Button size="icon" onClick={() => setTheme("light")}>
          <Sun />
        </Button>
      </main>
    </>
  );
}
