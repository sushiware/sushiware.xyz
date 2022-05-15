import { FunctionComponent } from "react";

type Props = {
  children: React.ReactNode;
};

export const Body: FunctionComponent<Props> = ({ children }) => {
  return (
    <>
      <main className="mx-2">{children}</main>
    </>
  );
};
