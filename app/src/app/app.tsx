import React, { useState, useMemo } from "react";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,

} from "@mui/material";
import SetRetail from "./pages/set-retail";

const App: React.FC = () => {
  const [darkMode] = useState<boolean>(true); 

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? "dark" : "light",
          primary: {
            main: "#90caf9",
          },
          secondary: {
            main: "#f48fb1",
          },
          background: {
            default: darkMode ? "#121212" : "#f5f5f5",
            paper: darkMode ? "#1e1e1e" : "#fff",
          },
          text: {
            primary: darkMode ? "#ffffff" : "#000000",
          },
        },
      }),
    [darkMode]
  );


  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SetRetail />
    </ThemeProvider>
  );
};

export default App;
