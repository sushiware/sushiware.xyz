import { FunctionComponent } from "react";
import { useColorModeContext } from "./ColorModeProvider";

export const ToggleColorModeButton: FunctionComponent = () => {
  const { isDarkMode, toggleColorMode } = useColorModeContext();

  return (
    <>
      <a className="text-2xl" onClick={toggleColorMode}>
        {isDarkMode ? "🌞" : "🌝"}
      </a>
    </>
  );
};
