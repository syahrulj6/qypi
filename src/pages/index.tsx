import { useRouter } from "next/router";
import { PageContainer } from "~/components/layout/PageContainer";
import { SectionContainer } from "~/components/layout/SectionContainer";

import { Button } from "~/components/ui/button";
import { useSession } from "~/hooks/useSession";

export default function Home() {
  const router = useRouter();

  const { session, handleSignOut } = useSession();

  return (
    <>
      <PageContainer>
        <SectionContainer
          padded
          className="flex min-h-screen flex-col justify-center gap-y-3"
        >
          {session ? (
            <div className="flex gap-2">
              <Button onClick={() => router.push("/dashboard")}>
                Dashboard
              </Button>
              <Button variant="destructive" onClick={() => handleSignOut()}>
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Button onClick={() => router.push("/login")}>Login</Button>
              <Button variant="outline" onClick={() => router.push("register")}>
                Register
              </Button>
            </div>
          )}
        </SectionContainer>
      </PageContainer>
    </>
  );
}
