import styles from "./SearchType.module.css";
import { TypeButton } from "./Buttons";
import { typeNames, type TypeNames } from "../../constants/nameTexts";

type SearchTypeProps = {
  selectedTypes: TypeNames[];
  onSelectedTypesChange: (types: TypeNames[]) => void;
};

function SearchType({
  selectedTypes,
  onSelectedTypesChange,
}: SearchTypeProps) {
  const handleToggleType = (typeName: TypeNames) => {
    const isSelected = selectedTypes.includes(typeName);

    if (isSelected) {
      onSelectedTypesChange(
        selectedTypes.filter((type) => type !== typeName),
      );
      return;
    }

    onSelectedTypesChange([...selectedTypes, typeName]);
  };

  return (
    <div className={styles.searchTypeList}>
      {typeNames.map((typeName) => {
        const isSelected = selectedTypes.includes(typeName);

        return (
          <button
            key={typeName}
            className={`${styles.searchTypeButton} ${isSelected ? styles.isSelected : ""}`}
            type="button"
            onClick={() => handleToggleType(typeName)}
          >
            <TypeButton 
              typeName={typeName} 
              isSelected={isSelected} 
            />
          </button>
        );
      })}
    </div>
  );
}

export default SearchType;