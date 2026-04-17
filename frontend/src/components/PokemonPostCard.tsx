import styles from "./PokemonPostCard.module.css";
import { Link, useLocation } from "react-router-dom";
import type { DisplayPokemonCard } from "../types/displayPost";
import TypeBadge from "./TypeBadge";
import { ChartNoAxesColumn, Heart, MessageCircle } from "lucide-react";

type PokemonPostCardProps = {
  post: DisplayPokemonCard;
  onPrevIllust: (id: number) => void;
  onNextIllust: (id: number) => void;
  onSelectIllust: (id: number, index: number) => void;
  onToggleLike: () => void;
};

function PokemonPostCard({
  post,
  onPrevIllust,
  onNextIllust,
  onSelectIllust,
  onToggleLike,
}: PokemonPostCardProps) {
  const location = useLocation();
  const imageUrl =
    post.imageUrl || "https://placehold.jp/300x300.png?text=NoImage";
  const hasMultipleIllusts = post.illustCount > 1;

  return (
    <article className={styles.card}>
      <Link
        className={styles.cardLink}
        to={post.detailPath}
        state={{ from: location.pathname + location.search }}
      >
        <div
          className={styles.cardImageWrapper}
          style={{ backgroundImage: `url(${imageUrl})` }}
        >
          {hasMultipleIllusts && (
            <>
              <button
                type="button"
                className={`${styles.cardIllustArrow} ${styles.left}`}
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  onPrevIllust(post.id);
                }}
              >
                ‹
              </button>

              <button
                type="button"
                className={`${styles.cardIllustArrow} ${styles.right}`}
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  onNextIllust(post.id);
                }}
              >
                ›
              </button>

              <div className={styles.cardIllustDots}>
                {Array.from({ length: post.illustCount }).map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`${styles.cardIllustDot} ${
                      index === post.currentIllustIndex
                        ? styles.cardIllustDotActive
                        : ""
                    }`}
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      onSelectIllust(post.id, index);
                    }}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <div className={styles.cardBody}>
          <div className={styles.cardHeader}>
            <span className={styles.cardNumber}>
              No.{post.dexNo}
            </span>

            <div className={styles.cardTypes}>
              {post.types.map((type) => (
                <TypeBadge key={type} typeName={type} />
              ))}
            </div>
          </div>

          <div className={styles.cardTitleWrapper}>
            <h2 className={styles.cardTitle}>
              {post.name}
            </h2>
            <span className={styles.cardSubTitle}>
              {post.subname}
            </span>
          </div>

          <div className={styles.cardStatusContainer}>
            <div className={`${styles.cardStatus} ${styles.cardView}`}>
              <span>
                <ChartNoAxesColumn
                  className={`${styles.cardIcon} ${styles.cardViewIcon}`}
                />
              </span>
              <span className={styles.cardCount}>
                {post.viewCount}
              </span>
            </div>

            <div className={`${styles.cardStatus} ${styles.cardLike}`}>
              <span>
                <Heart
                  className={`${styles.cardIcon} ${styles.cardLikeIcon} ${
                    post.likedByUser ? styles.liked : ""
                  }`}
                />
              </span>
              <span className={styles.cardCount}>
                {post.likeCount}
              </span>
            </div>

            <div className={`${styles.cardStatus} ${styles.cardComment}`}>
              <span>
                <MessageCircle
                  className={`${styles.cardIcon} ${styles.cardCommentIcon}`}
                />
              </span>
              <span className={styles.cardCount}>
                {post.commentCount}
              </span>
            </div>
          </div>
        </div>
      </Link>

      <button
        type="button"
        className={styles.cardLikeButton}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          onToggleLike();
        }}
      >
        <Heart
          className={`${styles.cardLikeButtonIcon} ${
            post.likedByUser ? styles.liked : ""
          }`}
        />
      </button>
    </article>
  );
}

export default PokemonPostCard;