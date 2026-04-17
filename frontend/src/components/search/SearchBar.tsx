import styles from "./SearchBar.module.css";
import { useEffect, useState, useRef } from "react";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
};

function SearchBar({ value, onChange }: SearchBarProps) {
  const [inputValue, setInputValue] = useState(value);
  const isComposingRef = useRef(false);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  return (
    <div className={styles.searchBar}>
      <input className={styles.searchBarInput}
        type="text"
        value={inputValue}
        onChange={(e) =>{
          const nextValue = e.target.value;
          setInputValue(nextValue);

          if (!isComposingRef.current) {
            onChange(nextValue);
          }
        }}
        onCompositionStart={() => { isComposingRef.current = true }}
        onCompositionEnd={(e) => {
          isComposingRef.current = false;
          onChange(e.currentTarget.value);
        }}
        placeholder="キーワードで検索"
      />
    </div>
  );
}

export default SearchBar;