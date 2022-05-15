import { FunctionComponent } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

export const ToHome: FunctionComponent = () => {
  const router = useRouter();
  const isHome = router.pathname === "/";

  return (
    <>
      {!isHome ? (
        <Link href="/">
          <a className="text-2xl">🏠</a>
        </Link>
      ) : (
        <></>
      )}
    </>
  );
};
