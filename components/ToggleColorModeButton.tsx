import { FunctionComponent } from "react";
import { useColorModeContext } from "./ColorModeProvider";

export const ToggleColorModeButton: FunctionComponent = () => {
  const { isDarkMode, toggleColorMode } = useColorModeContext();

  return (
    <>
      <button className="text-4xl m-2" onClick={toggleColorMode}>
        {isDarkMode ? "🌞" : "🌝"}
      </button>
    </>
  );
};
