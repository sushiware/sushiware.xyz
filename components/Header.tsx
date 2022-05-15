import { FunctionComponent } from "react";
import Link from "next/link";
import { AppConfig } from "../app.config";

type Props = {
  title?: string;
  date?: string;
};

export const Header: FunctionComponent<Props> = ({ title, date }) => {
  return (
    <>
      <header>
        <h1 className="text-5xl pt-8">🍣 {title ? title : AppConfig.title}</h1>
        {date && (
          <>
            <p className="text-5xl">{date}</p>
            <Link href="/">
              <a className="text-4xl m-2">🏠↩️</a>
            </Link>
          </>
        )}
      </header>
    </>
  );
};
