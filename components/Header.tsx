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
        <h1>🍣 {AppConfig.title} 🍣</h1>
        {title && <h2>{title}</h2>}

        {date && (
          <>
            <p>{date}</p>
          </>
        )}
      </header>
    </>
  );
};
