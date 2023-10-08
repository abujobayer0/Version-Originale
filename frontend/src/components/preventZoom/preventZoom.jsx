import { useEffect } from "react";

function usePreventZoom(scrollCheck = true, keyboardCheck = true) {
  useEffect(() => {
    const handleScroll = () => {
      // Prevent the user from zooming in or out using the scroll wheel
      if (event.deltaY > 0) {
        event.preventDefault();
      }
    };

    const handleKeyboard = (event) => {
      // Prevent the user from zooming in or out using the keyboard
      if (event.ctrlKey || event.metaKey) {
        event.preventDefault();
      }
    };

    if (scrollCheck) {
      window.addEventListener("scroll", handleScroll);
    }

    if (keyboardCheck) {
      window.addEventListener("keydown", handleKeyboard);
    }

    return () => {
      if (scrollCheck) {
        window.removeEventListener("scroll", handleScroll);
      }

      if (keyboardCheck) {
        window.removeEventListener("keydown", handleKeyboard);
      }
    };
  }, []);
}
export default usePreventZoom;
