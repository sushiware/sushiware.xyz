import { FunctionComponent } from "react";

type Props = {
  href: string;
  text: string;
};

export const SNS: FunctionComponent<Props> = ({ href, text }) => {
  return (
    <a className="text-2xl" href={href}>
      {text}
    </a>
  );
};
