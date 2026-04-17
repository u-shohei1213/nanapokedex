import styles from "./SearchRegion.module.css";
import { RegionButton } from "./Buttons";
import { regionNames, type RegionNames } from "../../constants/nameTexts";

type SearchRegionProps = {
  selectedRegions: RegionNames[];
  onSelectedRegionsChange: (regions: RegionNames[]) => void;
};

function SearchRegion({
  selectedRegions,
  onSelectedRegionsChange,
}: SearchRegionProps) {
  const handleToggleRegion = (regionName: RegionNames) => {
    const isSelected = selectedRegions.includes(regionName);

    if (isSelected) {
      onSelectedRegionsChange(
        selectedRegions.filter((region) => region !== regionName),
      );
      return;
    }

    onSelectedRegionsChange([...selectedRegions, regionName]);
  };

  return (
    <div className={styles.searchRegionList}>
      {regionNames.map((regionName) => {
        const isSelected = selectedRegions.includes(regionName);
        
        return (
          <button
            key={regionName}
            className={`${styles.searchRegionButton} ${isSelected ? styles.isSelected : ""}`}
            type="button"
            onClick={() => handleToggleRegion(regionName)}
          >
            <RegionButton
              regionName={regionName}
              isSelected={isSelected}
            />
          </button>
        );
      })}
    </div>
  );
}

export default SearchRegion;