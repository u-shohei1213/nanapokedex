import styles from "./SearchLike.module.css";
import { LikeButton } from "./Buttons";
import { likeNames, type LikeNames } from "../../constants/nameTexts";

type SearchLikeProps = {
  selectedLikes: LikeNames[];
  onSelectedLikesChange: (likes: LikeNames[]) => void;
};

function SearchLike({
  selectedLikes,
  onSelectedLikesChange,
}: SearchLikeProps) {
  const handleToggleLike = (likeName: LikeNames) => {
    const isSelected = selectedLikes.includes(likeName);

    if (isSelected) {
      onSelectedLikesChange(
        selectedLikes.filter((like) => like !== likeName),
      );
      return;
    }

    onSelectedLikesChange([...selectedLikes, likeName]);
  };

  return (
    <div className={styles.searchLikeList}>
      {likeNames.map((likeName) => {
        const isSelected = selectedLikes.includes(likeName);

        return (
          <button
            key={likeName}
            className={`${styles.searchLikeButton} ${isSelected ? styles.isSelected : ""}`}
            type="button"
            onClick={() => handleToggleLike(likeName)}
          >
            <LikeButton
              likeName={likeName}
              isSelected={isSelected}
            />
          </button>
        );
      })}
    </div>
  );
}

export default SearchLike;