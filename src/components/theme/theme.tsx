import { useTheme } from "@/lib/theme";
import { Moon, Sun } from "lucide-react";

export default function Theme() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => {
        if (theme === "light") {
          setTheme("dark");
        } else {
          setTheme("light");
        }
      }}
    >
      {theme === "light" ? <Sun /> : <Moon />}
    </button>
  );
}
