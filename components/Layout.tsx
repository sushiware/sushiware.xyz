import type { NextPage } from "next";
import { Meta } from "./Meta";
import { Body } from "./Body";
import { Header } from "./Header";

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
      <section className="min-h-screen flex flex-col bg-neutral-400 text-neutral-900">
        <section className="container mx-auto">
          <Meta title={title} description={description} />
          <Header title={title} date={date} />
          <Body>{children}</Body>
        </section>
      </section>
    </>
  );
};
