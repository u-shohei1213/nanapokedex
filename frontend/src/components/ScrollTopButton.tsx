import styles from "./ScrollTopButton.module.css"
import { useEffect, useState } from "react";
import { ArrowUpToLine } from "lucide-react";

function ScrollTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 200);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      className={styles.scrollTopButton}
      onClick={() =>
        window.scrollTo({ top: 0, behavior: "smooth" })
      }
    >
      <ArrowUpToLine />
    </button>
  );
}

export default ScrollTopButton;