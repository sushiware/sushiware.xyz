import { FunctionComponent, createContext, useContext } from "react";
import { useState, useEffect } from "react";

const ColorModeContext = createContext({
  isDarkMode: false,
  toggleColorMode: () => {},
});

type Props = {
  children: React.ReactNode;
};

export const ColorModeProvider: FunctionComponent<Props> = ({ children }) => {
  const { isDarkMode, toggleColorMode } = useColorMode();
  return (
    <ColorModeContext.Provider value={{ isDarkMode, toggleColorMode }}>
      {children}
    </ColorModeContext.Provider>
  );
};

export const useColorModeContext = () => useContext(ColorModeContext);

const useColorMode = () => {
  const [isDarkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const defaultDarkMode = localStorage.getItem("darkMode") === "true";
    if (defaultDarkMode) {
      applyDarkMode();
      return;
    }
    revertDarkMode();
  }, []);

  const applyDarkMode = () => {
    setDarkMode(true);
    localStorage.setItem("darkMode", "true");
    document.documentElement.classList.add("dark");
  };

  const revertDarkMode = () => {
    setDarkMode(false);
    localStorage.setItem("darkMode", "false");
    document.documentElement.classList.remove("dark");
  };

  const toggleColorMode = () => {
    if (isDarkMode) {
      revertDarkMode();
      return;
    }
    applyDarkMode();
  };

  return { isDarkMode, toggleColorMode };
};
