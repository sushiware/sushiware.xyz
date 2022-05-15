import type { NextPage } from "next";
import { Meta } from "./Meta";
import { Body } from "./Body";
import { Header } from "./Header";
import { ToggleColorModeButton } from "./ToggleColorModeButton";

type Props = {
  title?: string;
  description?: string;
  date?: string;
  children: React.ReactNode;
};

export const Layout: NextPage<Props> = ({
  title,
  description,
  date,
  children,
}) => {
  return (
    <>
      <section className={`min-h-screen`}>
        <section className="container mx-auto">
          <Meta title={title} description={description} />
          <Header title={title} date={date} />
          <ToggleColorModeButton />
          <Body>{children}</Body>
        </section>
      </section>
    </>
  );
};
