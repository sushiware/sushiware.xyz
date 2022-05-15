import { FunctionComponent } from "react";
import { AppConfig } from "../app.config";

type Props = {
  title?: string;
  date?: string;
};

export const Header: FunctionComponent<Props> = ({ title, date }) => {
  return (
    <>
      <header>
        <h1 className="text-5xl mb-8 mt-8">
          {title ? title : AppConfig.title}
        </h1>
        {date && <p className="text-3xl">{date}</p>}
      </header>
    </>
  );
};
