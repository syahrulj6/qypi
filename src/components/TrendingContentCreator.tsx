import Image from "next/image";
import { Card } from "./ui/card";

type Creator = {
  name: string;
  platform: string;
  category: string;
  img: string;
};

const trendingCreator: Creator[] = [
  {
    name: "Deddy Corbuzier",
    platform: "Youtube",
    category: "Edukasi",
    img: "/creator/deddy.jpeg",
  },
  {
    name: "Yb",
    platform: "Youtube",
    category: "Gaming",
    img: "/creator/yb.jpeg",
  },
  {
    name: "Ferry Irwandi",
    platform: "Youtube",
    category: "Edukasi",
    img: "/creator/ferry.jpg",
  },
  {
    name: "Afif Yulistian",
    platform: "Youtube",
    category: "Gaming",
    img: "/creator/afif.jpeg",
  },
  {
    name: "Ria Ricis",
    platform: "Youtube",
    category: "Lifestyle",
    img: "/creator/ria.jpeg",
  },
  {
    name: "Fadil Jaidi",
    platform: "Instagram",
    category: "Comedy",
    img: "/creator/fadil.jpeg",
  },
];

export const TrendingContentCreator = () => {
  return (
    <div className="flex flex-col items-center px-4">
      <h1 className="text-center text-xl font-semibold tracking-tight md:text-3xl">
        🔥 Trending Content Creator
      </h1>
      <div className="mt-6 grid w-full grid-cols-1 gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {trendingCreator.map((creator, index) => (
          <Card
            key={index}
            className="flex min-h-full flex-col justify-between p-4 shadow-md"
          >
            <div className="relative aspect-[4/3] w-full md:h-48 lg:h-52">
              <Image
                src={creator.img}
                alt={`${creator.name} Image`}
                fill
                className="absolute inset-0 rounded-lg object-cover"
              />
            </div>
            {/* Text Content */}
            <div className="mt-3 text-center">
              <h2 className="text-lg font-medium">{creator.name}</h2>
              <p className="text-sm text-gray-500">
                {creator.platform} - {creator.category}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
