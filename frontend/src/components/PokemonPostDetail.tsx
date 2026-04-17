import styles from "./PokemonPostDetail.module.css";
import type {
  PokemonDetailResponse,
  IllustDetailResponse,
} from "../types/api";
import { typeColorsBg } from "../constants/typeColors";
import TypeBadge from "./TypeBadge";
import { ChartNoAxesColumn, Heart, ExternalLink, MessageCircle } from "lucide-react";

type PokemonPostDetailProps = {
  detail: PokemonDetailResponse;
  currentIllust: IllustDetailResponse | null;
  currentIndex: number;
  illustCount: number;
  onPrevIllust: () => void;
  onNextIllust: () => void;
  onSelectIllust: (index: number) => void;
  commentText: string;
  commentError: string | null;
  isSubmittingComment: boolean;
  onCommentTextChange: (value: string) => void;
  onSubmitComment: () => void;
  onToggleLike: () => void;
  isSubmittingLike: boolean;
};

function PokemonPostDetail({
  detail,
  currentIllust,
  currentIndex,
  illustCount,
  onPrevIllust,
  onNextIllust,
  onSelectIllust,
  commentText,
  commentError,
  isSubmittingComment,
  onCommentTextChange,
  onSubmitComment,
  onToggleLike,
  isSubmittingLike,
}: PokemonPostDetailProps) {
  const type1 = detail.types[0] ?? "";
  const type2 = detail.types[1] ?? type1;

  const color1 = typeColorsBg[type1] ?? "white";
  const color2 = typeColorsBg[type2] ?? color1;

  const imageUrl =
    currentIllust?.imageUrl || "https://placehold.jp/300x300.png?text=NoImage";
  const hasMultipleIllusts = illustCount > 1;
  const hasIllust = currentIllust !== null;

  const text = `${currentIllust?.postUrl}\n`;
  const url = `${window.location.href}\n`;

  const shareUrl =
    `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}&hashtags=${encodeURIComponent("ななポケ図鑑")}`;

  return (
    <div className={styles.detail}>
      <div
        className={styles.pokeContainer}
        style={{
          background: `linear-gradient(${color1}, ${color2})`,
        }}
      >
        <div className={styles.illustContainer}>
          <img
            className={styles.illust}
            src={imageUrl}
            alt={detail.name}
          />

          {hasMultipleIllusts && (
            <>
              <button
                type="button"
                className={`${styles.illustArrow} ${styles.left}`}
                onClick={onPrevIllust}
                aria-label="前のイラスト"
              >
                ‹
              </button>

              <button
                type="button"
                className={`${styles.illustArrow} ${styles.right}`}
                onClick={onNextIllust}
                aria-label="次のイラスト"
              >
                ›
              </button>

              <div className={styles.illustDots}>
                {Array.from({ length: illustCount }).map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`${styles.illustDot} ${
                      index === currentIndex ? styles.illustDotActive : ""
                    }`}
                    onClick={() => onSelectIllust(index)}
                    aria-label={`イラスト ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <div className={styles.infoContainer}>
          <div className={styles.pokeInfoContainer}>
            <div className={styles.noContainer}>
              <p>No.{detail.dexNo}</p>
            </div>

            <div className={styles.nameContainer}>
              <p>{detail.name}</p>
              {detail.subname && (
                <span className={styles.subname}>{detail.subname}</span>
              )}
            </div>

            <div className={styles.typeContainer}>
              <TypeBadge
                typeName={detail.types[0]}
                width={60}
                height={20}
                fontSize={12}
              />
              {detail.types.length === 2 && (
                <TypeBadge
                  typeName={detail.types[1]}
                  width={60}
                  height={20}
                  fontSize={12}
                />
              )}
            </div>

            <div className={styles.regionContainer}>
              <p>{detail.region}</p>
            </div>
          </div>

            <>
              {hasIllust && currentIllust && (
                <div className={styles.illustInfoContainer}>
                  <div className={styles.viewContainer}>
                    <ChartNoAxesColumn className={styles.viewIcon} />
                    <p className={styles.text}>閲覧数</p>
                    <p>: {currentIllust.viewCount}</p>
                  </div>

                  <div className={styles.likeContainer}>
                    <button
                      className={styles.likeButton}
                      type="button"
                      onClick={onToggleLike}
                      disabled={isSubmittingLike}
                    >
                      <Heart
                        className={`${styles.likeButtonIcon} ${
                          currentIllust.likedByUser ? styles.liked : ""
                        }`}
                      />
                      <span>{currentIllust.likeCount}</span>
                    </button>
                  </div>

                  <div className={styles.commentInfoRow}>
                    <MessageCircle className={styles.commentIcon} />
                    <p className={styles.text}>コメント数</p>
                    <p>: {currentIllust.commentCount}</p>
                  </div>

                  <div className={styles.dateContainer}>
                    <p>
                      投稿日 : {new Date(currentIllust.postedAt).toLocaleString("ja-JP")}
                    </p>
                  </div>
                </div>
              )}

              <div className={styles.linkInfoContainer}>
                {hasIllust && currentIllust && (
                  <div className={styles.linkContainer}>
                    <a href={currentIllust.postUrl} target="_blank" rel="noreferrer">
                      <div className={styles.linkTextContainer}>
                        <span className={styles.xIcon}>𝕏</span>
                        <span>元ポスト</span>
                        <ExternalLink className={styles.linkIcon} />
                      </div>
                    </a>
                  </div>
                )}

                <div className={styles.originalContainer}>
                  <a href={detail.originalUrl} target="_blank" rel="noreferrer">
                    <div className={styles.originalTextContainer}>
                      <span className={styles.pIcon}>Ⓟ</span>
                      <span>正解画像</span>
                      <ExternalLink className={styles.linkIcon} />
                    </div>
                  </a>
                </div>

                {hasIllust && currentIllust && (
                  <div className={styles.shareContainer}>
                    <a href={shareUrl} target="_blank" rel="noreferrer">
                      <div className={styles.shareTextContainer}>
                        <span className={styles.pIcon}>𝕏</span>
                        <span>共有</span>
                        <ExternalLink className={styles.linkIcon} />
                      </div>
                    </a>
                  </div>
                )}
              </div>
            </>
        </div>
      </div>

      {hasIllust && currentIllust && (
        <div className={styles.commentContainer}>
          <div className={styles.commentPlaceholder}>
            <p>コメント欄</p>

            {currentIllust.comments.length === 0 ? (
              <p className={styles.emptyComment}>コメントはまだありません。</p>
            ) : (
              <div className={styles.commentList}>
                {currentIllust.comments.map((comment) => (
                  <div key={comment.id} className={styles.commentItem}>
                    <div className={styles.commentMeta}>
                      <span className={styles.commentUser}>
                        {comment.displayUserName ?? "匿名"}
                      </span>
                      <span className={styles.commentDate}>
                        {new Date(comment.postedAt).toLocaleString("ja-JP")}
                      </span>
                    </div>
                    <p className={styles.commentContent}>{comment.content}</p>
                  </div>
                ))}
              </div>
            )}

            {commentError && (
              <p className={styles.commentError}>{commentError}</p>
            )}

            <textarea
              className={styles.commentTextarea}
              value={commentText}
              onChange={(event) => onCommentTextChange(event.target.value)}
              placeholder="コメントを入力"
              disabled={isSubmittingComment}
            />
            <button
              className={styles.commentButton}
              type="button"
              onClick={onSubmitComment}
              disabled={isSubmittingComment}
            >
              {isSubmittingComment ? "送信中..." : "コメント送信"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PokemonPostDetail;