import { useState, useEffect } from "react";

export default function useSessionState(key, defaultValue) {
  const [value, setValue] = useState(() => {
    const savedItem = sessionStorage.getItem(key);

    return savedItem ? JSON.parse(savedItem) : defaultValue;
  });

  useEffect(() => {
    sessionStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}
