import styles from "./PostList.module.css";
import PokemonPostCard from "./PokemonPostCard";
import OtherPostCard from "./OtherPostCard";
import type {
  DisplayOtherCard,
  DisplayPokemonCard,
} from "../types/displayPost";

type PostListProps = {
  selectedTabIndex: number;
  posts: DisplayPokemonCard[] | DisplayOtherCard[];
  onPrevIllust: (id: number) => void;
  onNextIllust: (id: number) => void;
  onSelectIllust: (id: number, index: number) => void;
  onToggleLike: (post: DisplayPokemonCard | DisplayOtherCard) => void;
};

function PostList({
  selectedTabIndex,
  posts,
  onPrevIllust,
  onNextIllust,
  onSelectIllust,
  onToggleLike,
}: PostListProps) {
  if (posts.length === 0) {
    return <div className={styles.empty}>該当する投稿がありません。</div>;
  }

  return (
    <div className={styles.postList}>
      {selectedTabIndex === 0
        ? (posts as DisplayPokemonCard[]).map((post) => (
            <PokemonPostCard
              key={post.id}
              post={post}
              onPrevIllust={onPrevIllust}
              onNextIllust={onNextIllust}
              onSelectIllust={onSelectIllust}
              onToggleLike={() => onToggleLike(post)}
            />
          ))
        : (posts as DisplayOtherCard[]).map((post) => (
            <OtherPostCard
              key={post.id}
              post={post}
              onPrevIllust={onPrevIllust}
              onNextIllust={onNextIllust}
              onSelectIllust={onSelectIllust}
              onToggleLike={() => onToggleLike(post)}
            />
          ))}
    </div>
  );
}

export default PostList;