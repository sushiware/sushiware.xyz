import { FunctionComponent } from "react";

type Props = {
  children: React.ReactNode;
};

export const Body: FunctionComponent<Props> = ({ children }) => {
  return (
    <>
      <main>{children}</main>
    </>
  );
};
