import styles from "./SearchIllust.module.css";
import { IllustButton } from "./Buttons";
import { illustNames, type IllustNames } from "../../constants/nameTexts";

type SearchIllustProps = {
  selectedIllusts: IllustNames[];
  onSelectedIllustsChange: (illusts: IllustNames[]) => void;
};

function SearchIllust({
  selectedIllusts,
  onSelectedIllustsChange,
}: SearchIllustProps) {
  const handleToggleIllust = (illustName: IllustNames) => {
    const isSelected = selectedIllusts.includes(illustName);

    if (isSelected) {
      onSelectedIllustsChange(
        selectedIllusts.filter((illust) => illust !== illustName),
      );
      return;
    }

    onSelectedIllustsChange([...selectedIllusts, illustName]);
  };

  return (
    <div className={styles.searchIllustList}>
      {illustNames.map((illustName) => {
        const isSelected = selectedIllusts.includes(illustName);

        return (
          <button
            key={illustName}
            className={`${styles.searchIllustButton} ${isSelected ? styles.isSelected : ""}`}
            type="button"
            onClick={() => handleToggleIllust(illustName)}
          >
            <IllustButton
              illustName={illustName}
              isSelected={isSelected}
            />
          </button>
        );
      })}
    </div>
  );
}

export default SearchIllust;