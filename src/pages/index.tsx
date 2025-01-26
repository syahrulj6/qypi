import { Button } from "~/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { api } from "~/utils/api";
import { useTheme } from "next-themes";

export default function Home() {
  const hello = api.post.hello.useQuery({ text: "from tRPC" });

  const { setTheme } = useTheme();

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center gap-y-6 bg-background">
        <h1 className="text-3xl text-primary">Hello World</h1>
        <Button onClick={() => alert(hello.data?.greeting)}>Test</Button>
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
