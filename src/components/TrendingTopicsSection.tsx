import Image from "next/image";
import { Card, CardFooter } from "./ui/card";
import Link from "next/link";
import { Button } from "./ui/button";

type Topic = {
  title: string;
  description: string;
  img: string;
  link: string;
};

const trendingTopics: Topic[] = [
  {
    title: "Marapthon Streaming  oleh YB",
    description:
      "YB melakukan live streaming marapthon di YouTube, menarik ribuan penonton!",
    img: "/topics/yb-marapthon.jpeg",
    link: "/topics/yb-marapthon",
  },
  {
    title: "Podcast Eksklusif Deddy Corbuzier dengan Presiden RI Prabowo!",
    description:
      "Deddy Corbuzier menghadirkan Presiden RI, Prabowo untuk membahas untuk membahas indonesia ",
    img: "/topics/deddy-prabowo.jpeg",
    link: "/topics/deddy-prabowo",
  },

  {
    title: "Ferry Irwandi Mengulas program makan siang gratis!",
    description:
      "Ferry Irwandi Mengulas program makan siang gratis! yang sedang ramai Dibicarakan!",
    img: "/topics/ferry-makan-siang.jpeg",
    link: "/topics/ferry-makan-siang",
  },
];

export const TrendingTopics = () => {
  return (
    <div className="mt-24 flex flex-col items-center px-4 md:mt-40">
      <h1 className="text-center text-xl font-semibold tracking-tight md:text-3xl">
        🚀 Trending Topics
      </h1>
      <div className="mt-6 grid w-full grid-cols-1 gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {trendingTopics.map((topic, index) => (
          <Card
            key={index}
            className="flex min-h-full flex-col items-center justify-between p-4 shadow-md"
          >
            <div className="relative aspect-[4/3] w-full md:h-48 lg:h-52">
              <Image
                src={topic.img}
                alt={`${topic.title} Image`}
                fill
                className="absolute inset-0 rounded-lg object-cover"
              />
            </div>
            <div className="mt-3 text-center">
              <h2 className="text-lg font-medium">{topic.title}</h2>
              <p className="text-sm text-muted-foreground">
                {topic.description}
              </p>
            </div>
            <CardFooter className="mt-4">
              <Button asChild variant="default" size={"sm"}>
                <Link href={topic.link}>Baca Selengkapnya</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};
