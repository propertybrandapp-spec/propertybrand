import { createContext, useContext, useState, useCallback } from "react";

// The city picked in the top bar. "" means "All Cities". It is remembered
// between visits and used everywhere a list of properties is shown, so picking
// Bhubaneswar means Bhubaneswar on the homepage, in search and in "Discover" —
// not just on the search page.
const KEY = "pb_selected_city";
const CityContext = createContext({ city: "", setCity: () => {} });

function readStored() {
  try { return window.localStorage.getItem(KEY) || ""; } catch { return ""; }
}

export function CityProvider({ children }) {
  const [city, setCityState] = useState(readStored);
  const setCity = useCallback((c) => {
    const next = c || "";
    setCityState(next);
    try { window.localStorage.setItem(KEY, next); } catch { /* private mode */ }
  }, []);
  return <CityContext.Provider value={{ city, setCity }}>{children}</CityContext.Provider>;
}

export function useCity() {
  return useContext(CityContext);
}
