import { SunIcon, MoonIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import { useState } from "react";

const ChangeTheme = () => {
  const { theme, setTheme } = useTheme();
  const [isDarkMode, setIsDarkMode] = useState(theme === "dark");

  const toggleTheme = () => {
    const newTheme = isDarkMode ? "light" : "dark";
    setTheme(newTheme);
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div
      onClick={toggleTheme}
      className="w-full flex items-center gap-2 cursor-pointer"
    >
      {isDarkMode ? (
        <SunIcon className="h-5 w-5 transition-all" />
      ) : (
        <MoonIcon className="h-5 w-5 transition-all" />
      )}
      <span className="">Mudar tema</span>
    </div>
  );
};

export default ChangeTheme;
