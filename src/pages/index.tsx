import { PageContainer } from "~/components/layout/PageContainer";
import { SectionContainer } from "~/components/layout/SectionContainer";
import { Button } from "~/components/ui/button";
import { api } from "~/utils/api";

export default function Home() {
  const hello = api.post.hello.useQuery({ text: "from tRPC" });

  return (
    <>
      <PageContainer>
        <SectionContainer
          padded
          className="flex min-h-[calc(100vh-144px)] flex-col justify-center gap-y-5"
        >
          <h1 className="text-center text-3xl font-semibold">
            Welcome to <span className="text-blue-500">Qypi</span>😊 Yuk kepoin
            Content Creator favorit kamu!
          </h1>
          <Button onClick={() => alert(hello.data?.greeting)}>Test</Button>
        </SectionContainer>
      </PageContainer>
    </>
  );
}
