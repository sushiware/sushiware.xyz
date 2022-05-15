import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ColorModeProvider } from "../components/ColorModeProvider";
const MyApp = ({ Component, pageProps }: AppProps) => (
  <ColorModeProvider>
    <Component {...pageProps} />
  </ColorModeProvider>
);

export default MyApp;
