import styles from "./TypeBadge.module.css";
import { typeColors } from "../constants/typeColors";

type TypeBadgeProps = {
  typeName: string;
  width?: number;
  height?: number;
  fontSize?: number;
};

function TypeBadge({
  typeName,
  width,
  height,
  fontSize
}: TypeBadgeProps) {
  const bgColor = typeColors[typeName] || "#fff";
  
  return (
    <span className={styles.typeBadge}
      style={{ 
        backgroundColor: bgColor,
        width: width ?? 40,
        height: height ?? 10,
        fontSize: fontSize ?? 8
      }}>
      {typeName}
    </span>
  );
}

export default TypeBadge;