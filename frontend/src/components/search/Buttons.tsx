import styles from "./Buttons.module.css";
import { typeColors, typeColorsBg } from "../../constants/typeColors";

type TypeButtonProps = {
  typeName: string;
  isSelected: boolean;
};

type RegionButtonProps = {
  regionName: string;
  isSelected: boolean;
};

type IllustButtonProps = {
  illustName: string;
  isSelected: boolean;
};

type LikeButtonProps = {
  likeName: string;
  isSelected: boolean;
};

export function TypeButton({ typeName, isSelected }: TypeButtonProps) {
  const bgColor = isSelected ? typeColors[typeName] : typeColorsBg[typeName] || "#fff";

  return (
    <span className={styles.searchTypeButton}
      style={{ 
        backgroundColor: bgColor,
        color: "#fff",
      }}>
      {typeName}
    </span>
  );
}

export function RegionButton({ regionName, isSelected }: RegionButtonProps) {
  const bgColor = isSelected ? "#00000018" : "#00000000";
  const frColor = isSelected ? "#000000" : "#00000080";

  return (
    <span className={styles.searchRegionButton}
      style={{ 
        backgroundColor: bgColor,
        color: frColor,
      }}>
      {regionName}
    </span>
  );
}

export function IllustButton({ illustName, isSelected }: IllustButtonProps) {
  const bgColor = isSelected ? "#00000018" : "#00000000";
  const frColor = isSelected ? "#000000" : "#00000080";

  return (
    <span className={styles.searchIllustButton}
      style={{ 
        backgroundColor: bgColor,
        color: frColor,
      }}>
      {illustName}
    </span>
  );
}

export function LikeButton({ likeName, isSelected }: LikeButtonProps) {
  const bgColor = isSelected ? "#00000018" : "#00000000";
  const frColor = isSelected ? "#000000" : "#00000080";

  return (
    <span className={styles.searchLikeButton}
      style={{ 
        backgroundColor: bgColor,
        color: frColor,
      }}>
      {likeName}
    </span>
  );
}