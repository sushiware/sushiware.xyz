import type { NextPage } from "next";
import { Meta } from "./Meta";
import { Body } from "./Body";
import { Header } from "./Header";
import { ColorModeProvider } from "../components/ColorModeProvider";
import { Nav } from "./Nav";

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
      <ColorModeProvider>
        <Meta title={title} description={description} />
        <section className="min-h-screen container mx-auto">
          <section className="mx-3">
            <Nav />
            <Header title={title} date={date} />
            <Body>{children}</Body>
          </section>
        </section>
      </ColorModeProvider>
    </>
  );
};
