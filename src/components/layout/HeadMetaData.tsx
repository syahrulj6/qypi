import React from "react";
import Head from "next/head";
import { env } from "~/env";

export const HeadMetaData: React.FC<{
  title?: string;
  metaDescription?: string;
  //   ogImageUrl?: string;
  pathname?: string;
}> = ({
  title = "Qypi Ya",
  metaDescription,
  // ogImageUrl = env.NEXT_PUBLIC_OG_IMAGE_URL
  pathname = "",
}) => {
  const defaultTitle = "Qypi.gg";

  const baseUrl =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : env.NEXT_PUBLIC_BASE_URL;

  const pageUrl = new URL(pathname, baseUrl).toString();

  return (
    <Head>
      <title>{title + " | " + defaultTitle}</title>
      <link rel="icon" href="/favicon.ico" />

      {/* metadata */}
      <meta name="title" content={title + " | " + defaultTitle} />
      <meta name="description" content="metaDescription" />
      {/* <meta name="og:image" itemProp="image" content={ogImageUrl}/> */}
      <meta property="og:url" content={pageUrl} />

      <meta property="og:type" content="website" />
      {/* <meta name="og:image" itemProp="image" content={ogImageUrl}/> */}
      <meta property="og:title" content={title + " | " + defaultTitle} />
      <meta property="og:description" content={metaDescription} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={pageUrl} />
      <meta property="twitter:title" content={title + " | " + defaultTitle} />
    </Head>
  );
};
