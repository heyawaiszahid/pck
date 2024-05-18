import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import IconButton from "@mui/material/IconButton";
import { useColorScheme } from "@mui/material/styles";
import { useEffect, useState } from "react";

const ModeSwitcher = () => {
  const { mode, setMode } = useColorScheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <IconButton onClick={() => setMode(mode === "light" ? "dark" : "light")} color="inherit">
      {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
    </IconButton>
  );
};

export default ModeSwitcher;
