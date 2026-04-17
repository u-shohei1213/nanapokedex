import styles from "./SortSelect.module.css";

export type PokemonSortOption =
  | "dexNo-asc"
  | "dexNo-desc"
  | "name-asc"
  | "name-desc"
  | "viewCount-desc"
  | "viewCount-asc"
  | "commentCount-desc"
  | "commentCount-asc"
  | "likeCount-desc"
  | "likeCount-asc"

type PokemonSortSelectProps = {
  value: PokemonSortOption;
  onChange: (value: PokemonSortOption) => void;
};

export function PokemonSortSelect({ value, onChange }: PokemonSortSelectProps) {
  return (
    <div className={styles.sortSelect}>
      <select
        className={styles.sortSelectInput}
        value={value}
        onChange={(e) => onChange(e.target.value as PokemonSortOption)}
      >
        <option value="dexNo-asc">No.が小さい順</option>
        <option value="dexNo-desc">No.が大きい順</option>
        <option value="name-asc">五十音昇順</option>
        <option value="name-desc">五十音降順</option>
        <option value="viewCount-desc">閲覧数が多い順</option>
        <option value="viewCount-asc">閲覧数が少ない順</option>
        <option value="commentCount-desc">コメントが多い順</option>
        <option value="commentCount-asc">コメントが少ない順</option>
        <option value="likeCount-desc">いいねが多い順</option>
        <option value="likeCount-asc">いいねが少ない順</option>
      </select>
    </div>
  );
}

export type OtherSortOption =
  | "name-asc"
  | "name-desc"
  | "viewCount-desc"
  | "viewCount-asc"
  | "commentCount-desc"
  | "commentCount-asc"
  | "likeCount-desc"
  | "likeCount-asc"
  | "postedAt-desc"
  | "postedAt-asc";

type OtherSortSelectProps = {
  value: OtherSortOption;
  onChange: (value: OtherSortOption) => void;
};

export function OtherSortSelect({ value, onChange }: OtherSortSelectProps) {
  return (
    <div className={styles.sortSelect}>
      <select
        className={styles.sortSelectInput}
        value={value}
        onChange={(e) => onChange(e.target.value as OtherSortOption)}
      >
        <option value="name-asc">五十音昇順</option>
        <option value="name-desc">五十音降順</option>
        <option value="viewCount-desc">閲覧数が多い順</option>
        <option value="viewCount-asc">閲覧数が少ない順</option>
        <option value="commentCount-desc">コメントが多い順</option>
        <option value="commentCount-asc">コメントが少ない順</option>
        <option value="likeCount-desc">いいねが多い順</option>
        <option value="likeCount-asc">いいねが少ない順</option>
        <option value="postedAt-desc">投稿が新しい順</option>
        <option value="postedAt-asc">投稿が古い順</option>
      </select>
    </div>
  );
}