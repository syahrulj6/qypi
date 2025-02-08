import { PageContainer } from "~/components/layout/PageContainer";
import { SectionContainer } from "~/components/layout/SectionContainer";
import { TrendingContentCreator } from "~/components/TrendingContentCreator";
import { TrendingTopics } from "~/components/TrendingTopicsSection";
import { Button } from "~/components/ui/button";

export default function Home() {
  return (
    <>
      <PageContainer>
        <SectionContainer
          padded
          className="flex min-h-[calc(100vh-144px)] flex-col justify-center gap-y-3"
        >
          <h1 className="text-center text-3xl font-semibold tracking-tighter md:text-5xl">
            Kepoin Semua Tentang Content Creator Favoritmu di{" "}
            <span className="text-blue-500">Qypi!</span>
          </h1>
          <p className="text-center text-base tracking-tight text-muted-foreground md:text-xl">
            Dari YouTube hingga TikTok, dari gaming hingga edukasi – semua
            tentang content creator ada di sini! Temukan profil, tren terbaru,
            dan konten eksklusif hanya di{" "}
            <span className="text-blue-500">Qypi.</span>
          </p>
          <Button>Jelajahi Sekarang</Button>
        </SectionContainer>
        <SectionContainer
          padded
          className="flex min-h-[calc(100vh-144px)] flex-col justify-center gap-y-3"
        >
          <TrendingContentCreator />
        </SectionContainer>
        <SectionContainer
          padded
          className="flex min-h-[calc(100vh-144px)] flex-col justify-center gap-y-3"
        >
          <TrendingTopics />
        </SectionContainer>
      </PageContainer>
    </>
  );
}
