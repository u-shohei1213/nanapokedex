import styles from "./Panel.module.css";
import SearchBar from "./SearchBar";
import { type TypeNames, type RegionNames, type IllustNames, type LikeNames } from "../../constants/nameTexts";
import SearchType from "./SearchType";
import SearchRegion from "./SearchRegion";
import SearchIllust from "./SearchIllust";
import SearchLike from "./SearchLike";

type SearchPanelProps = {
  selectedTabIndex: number;
  isOpen: boolean;
  onToggleOpen: () => void;
  searchText: string;
  onSearchTextChange: (value: string) => void;
  selectedTypes: TypeNames[];
  onSelectedTypesChange: (types: TypeNames[]) => void;
  selectedRegions: RegionNames[];
  onSelectedRegionsChange: (regions: RegionNames[]) => void;
  selectedIllusts: IllustNames[];
  onSelectedIllustsChange: (illusts: IllustNames[]) => void;
  selectedLikes: LikeNames[];
  onSelectedLikesChange: (likes: LikeNames[]) => void;
  onReset: () => void;
};

function SearchPanel({
  selectedTabIndex,
  isOpen,
  onToggleOpen,
  searchText,
  onSearchTextChange,
  selectedTypes,
  onSelectedTypesChange,
  selectedRegions,
  onSelectedRegionsChange,
  selectedIllusts,
  onSelectedIllustsChange,
  selectedLikes,
  onSelectedLikesChange,
  onReset,
}: SearchPanelProps) {
  const handleOpen = () => {
    onToggleOpen();
  };

  const handleClose = () => {
    onToggleOpen();
  };

  const toggleIcon = (
    <span
      className={`${styles.searchPanelToggleIcon} ${isOpen ? styles.isOpen : ""}`}
      aria-hidden="true"
    >
      <span className={styles.searchPanelToggleLine} />
      <span className={styles.searchPanelToggleLine} />
      <span className={styles.searchPanelToggleLine} />
    </span>
  );

  return (
    <div className={styles.searchPanel}>
      {!isOpen ? (
        <button
          className={styles.searchPanelHeader}
          type="button"
          onClick={handleOpen}
          aria-expanded={false}
        >
          <span className={styles.searchPanelTitle}>検索</span>
          {toggleIcon}
        </button>
      ) : (
        <button
          className={styles.searchPanelHeader}
          type="button"
          onClick={handleClose}
          aria-expanded={true}
        >
          <span className={styles.searchPanelTitle}>検索</span>
          {toggleIcon}
        </button>
      )}

      <div className={`${styles.searchPanelContent} ${isOpen ? styles.isOpen : ""}`}>
        <div className={styles.searchPanelBody}>
          <section className={styles.searchPanelSection}>
            <h3 className={styles.searchPanelSectionTitle}>キーワード</h3>
            <SearchBar value={searchText} onChange={onSearchTextChange} />
          </section>

          {selectedTabIndex === 0 && (
            <section className={styles.searchPanelSection}>
              <h3 className={styles.searchPanelSectionTitle}>タイプ</h3>
              <SearchType
                selectedTypes={selectedTypes}
                onSelectedTypesChange={onSelectedTypesChange}
              />
            </section>
          )}

          {selectedTabIndex === 0 && (
            <section className={styles.searchPanelSection}>
              <h3 className={styles.searchPanelSectionTitle}>地方</h3>
              <SearchRegion
                selectedRegions={selectedRegions}
                onSelectedRegionsChange={onSelectedRegionsChange}
              />
            </section>
          )}

          {selectedTabIndex === 0 && (
            <section className={styles.searchPanelSection}>
              <h3 className={styles.searchPanelSectionTitle}>イラスト</h3>
              <SearchIllust
                selectedIllusts={selectedIllusts}
                onSelectedIllustsChange={onSelectedIllustsChange}
              />
            </section>
          )}

          <section className={styles.searchPanelSection}>
            <h3 className={styles.searchPanelSectionTitle}>いいね</h3>
            <SearchLike
              selectedLikes={selectedLikes}
              onSelectedLikesChange={onSelectedLikesChange}
            />
          </section>

          <div className={styles.searchPanelFooter}>
            <button className={styles.searchPanelResetButton} 
              type="button"
              onClick={onReset}
            >
              リセット
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchPanel;