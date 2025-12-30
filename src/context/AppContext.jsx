import { createContext, useContext, useState } from "react";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [timeline, setTimeline] = useState([]);

  const addToTimeline = (text, source = "sign") => {
  const time = new Date().toLocaleTimeString();

  setTimeline((prev) => [
    ...prev,
    {
      text,
      source,
      time,
    },
  ]);
};


  return (
    <AppContext.Provider value={{ timeline, addToTimeline }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error("useApp must be used inside AppProvider");
  }
  return ctx;
}
