import { FunctionComponent } from "react";
import { ToggleColorModeButton } from "./ToggleColorModeButton";
import { ToHome } from "./ToHome";
import { SNS } from "./SNS";
import { AppConfig } from "../app.config";
import { RssFeed } from "./RssFeed";

export const Nav: FunctionComponent = () => {
  return (
    <nav className="mt-3">
      <ToggleColorModeButton />
      <span className="mr-3"></span>
      <SNS href={`https://twitter.com/${AppConfig.twitter}`} text="🐦" />
      <span className="mr-3"></span>
      <SNS href={`https://github.com/${AppConfig.github}`} text="😺" />
      <span className="mr-3"></span>
      <RssFeed />
      <span className="mr-3"></span>
      <ToHome />
    </nav>
  );
};
