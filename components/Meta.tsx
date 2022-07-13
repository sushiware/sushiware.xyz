import React from "react";

import Head from "next/head";
import { useRouter } from "next/router";

import { AppConfig } from "../app.config";

type Props = {
  title?: string;
  description?: string;
};

export const Meta = (props: Props) => {
  const router = useRouter();

  return (
    <>
      <Head>
        <meta charSet="UTF-8" key="charset" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1"
          key="viewport"
        />
        <link
          rel="apple-touch-icon"
          href={`${router.basePath}/apple-touch-icon.png`}
          key="apple"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href={`${router.basePath}/favicon-32x32.png`}
          key="icon32"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href={`${router.basePath}/favicon-16x16.png`}
          key="icon16"
        />
        <link
          rel="icon"
          href={`${router.basePath}/favicon.ico`}
          key="favicon"
        />
        <meta property="lang" content={AppConfig.locale} />
        <title>
          {props.title
            ? `${props.title} | ${AppConfig.site_name}`
            : AppConfig.site_name}
        </title>
        <meta
          name="description"
          content={
            props.description ? props.description : AppConfig.description
          }
          key="description"
        />
        <meta
          property="og:title"
          content={
            props.title
              ? `${props.title} | ${AppConfig.site_name}`
              : AppConfig.site_name
          }
          key="og:title"
        />
        <meta
          property="og:description"
          content={
            props.description ? props.description : AppConfig.description
          }
          key="og:description"
        />
        <meta property="og:locale" content={AppConfig.locale} key="og:locale" />
        <meta
          property="og:site_name"
          content={AppConfig.site_name}
          key="og:site_name"
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={AppConfig.url} />
        <meta
          property="og:image"
          // content={window && window.location.origin + "/og.png"}
          content={`${AppConfig.url}/ogp.png`}
        />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content={AppConfig.twitter} />
      </Head>
    </>
  );
};
