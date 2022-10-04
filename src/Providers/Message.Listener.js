import { useEffect } from "react";

export default function MessageListener({ children }) {
  useEffect(() => {
    window.addEventListener("message", messageResolver);
  }, []);

  function messageResolver(event) {
    // console.log(event.data)
  }

  return children;
}
