import { useState } from 'react';

// Custom hook to be used for conditionally showing various appointment views
export function useVisualMode(initial) {
  // Mode to be used as current state to render appropriate appointment view
  const [mode, setMode] = useState(initial);
  // History state used to allow back function to work properly
  const [history, setHistory] = useState([initial]);
  // Transition function allows dev to transition to a new mode
  function transition(newMode, replace = false) {
    if (replace) {
      setMode((prev) => newMode)
      let replaceHistory = [...history];
      replaceHistory[replaceHistory.length - 1] = mode;
      setHistory((prev) => replaceHistory);
    } else {
      setMode((prev) => newMode);
      let newHistory = [...history];
      newHistory.push(newMode);
      setHistory((prev) => newHistory);
    }
  };
  // Back function allows dev to call back to return to previous mode
  function back() {
    let newHistory = [...history];
    newHistory.pop(mode);
    setHistory((prev) => newHistory);
    if (history.length > 1) {
      setMode((prev) => newHistory[(newHistory.length - 1)]);
    }
  };

  // Export state and functions to be used from this custom hook
  return { mode, transition, back };
}

export default useVisualMode;