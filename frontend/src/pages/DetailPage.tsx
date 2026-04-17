import styles from "./DetailPage.module.css";
import { useEffect, useMemo, useState } from "react";
import {
  Link,
  useParams,
  useLocation,
  useSearchParams,
} from "react-router-dom";

import type {
  CurrentUser,
  IllustDetailResponse,
  OtherDetailResponse,
  PokemonDetailResponse,
} from "../types/api";

import Header from "../components/Header";
import ScrollTopButton from "../components/ScrollTopButton";
import OtherPostDetail from "../components/OtherPostDetail";
import PokemonPostDetail from "../components/PokemonPostDetail";

import { fetchPokemonDetail } from "../api/pokemon";
import { fetchOtherDetail } from "../api/other";
import {
  postComment,
  createLike,
  deleteLike,
  incrementViewCount
} from "../api/illusts";

type DetailPageProps = {
  currentUser: CurrentUser | null;
  onCurrentUserChange: (user: CurrentUser) => void;
};

// インデックス制御
function getSafeIndex(length: number, index: number): number {
  if (length <= 0) return 0;
  if (Number.isNaN(index)) return 0;
  if (index < 0) return 0;
  if (index >= length) return length - 1;
  return index;
}

// DetailPage 本体
function DetailPage({
  currentUser,
  onCurrentUserChange,
}: DetailPageProps) {
  // ========================================
  // 画面状態
  // ========================================
  // 遷移前の画面状態
  const location = useLocation();
  const backTo = location.state?.from ?? "/";
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  // 詳細データ
  const [pokemonDetail, setPokemonDetail] = useState<PokemonDetailResponse | null>(null);
  const [otherDetail, setOtherDetail] = useState<OtherDetailResponse | null>(null);
  // 読み込み状態とエラー
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  // コメント制御
  const [commentText, setCommentText] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [commentError, setCommentError] = useState<string | null>(null);
  // いいね制御
  const [isSubmittingLike, setIsSubmittingLike] = useState(false);
  // 表示中のイラストの種類
  const isPokemonPage = location.pathname.startsWith("/pokemon/");
  // 表示中のイラストの番号
  const requestedIndex = Number(searchParams.get("index") ?? "0");

  // ========================================
  // 詳細データ取得
  // 初回表示時・ID変更時・ユーザー切り替え時に再取得
  // ========================================
  useEffect(() => {
    let cancelled = false;

    async function loadDetail() {
      if (!id) {
        setLoadError("IDが不正です");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setLoadError(null);
        setPokemonDetail(null);
        setOtherDetail(null);

        if (isPokemonPage) {
          const data = await fetchPokemonDetail(Number(id));
          if (!cancelled) {
            setPokemonDetail(data);
          }
        } else {
          const data = await fetchOtherDetail(Number(id));
          if (!cancelled) {
            setOtherDetail(data);
          }
        }
      } catch (error) {
        if (!cancelled) {
          setLoadError(
            error instanceof Error ? error.message : "詳細の取得に失敗しました",
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadDetail();

    return () => {
      cancelled = true;
    };
  }, [id, isPokemonPage, currentUser?.userId]);

  // ========================================
  // 現在表示中のイラスト決定
  // ========================================
  // イラストリストの取得
  const illusts = useMemo<IllustDetailResponse[]>(() => {
    if (pokemonDetail) return pokemonDetail.illusts;
    if (otherDetail) return otherDetail.illusts;
    return [];
  }, [pokemonDetail, otherDetail]);
  // イラスト番号の取得
  const currentIndex = getSafeIndex(illusts.length, requestedIndex);
  // イラストの取得
  const currentIllust = illusts[currentIndex] ?? null;

  // ========================================
  // 閲覧数加算
  // 現在表示中のイラストが切り替わったときに1回だけ閲覧数を送信する
  // sessionStorage を使って、同一セッション中の重複加算を抑制する
  // ========================================
  useEffect(() => {
    if (!currentIllust) return;

    const storageKey = `viewed-illust-${currentIllust.id}`;
    const alreadyViewed = sessionStorage.getItem(storageKey);

    if (alreadyViewed) {
      return;
    }

    let cancelled = false;

    async function addView() {
      try {
        const updated = await incrementViewCount(currentIllust.id);

        if (cancelled) return;

        sessionStorage.setItem(storageKey, "1");

        if (isPokemonPage) {
          setPokemonDetail((prev) => {
            if (!prev) return prev;

            return {
              ...prev,
              illusts: prev.illusts.map((illust) =>
                illust.id === currentIllust.id
                  ? { ...illust, viewCount: updated.viewCount }
                  : illust,
              ),
            };
          });
        } else {
          setOtherDetail((prev) => {
            if (!prev) return prev;

            return {
              ...prev,
              illusts: prev.illusts.map((illust) =>
                illust.id === currentIllust.id
                  ? { ...illust, viewCount: updated.viewCount }
                  : illust,
              ),
            };
          });
        }
      } catch (error) {
        console.error(error);
      }
    }

    addView();

    return () => {
      cancelled = true;
    };
  }, [currentIllust?.id, isPokemonPage]);

  // ========================================
  // URLクエリ補正
  // index が範囲外だった場合でも安全な index に補正し、
  // URLと実際の表示内容を一致させる
  // ========================================
  useEffect(() => {
    if (illusts.length === 0) return;
    if (currentIndex === requestedIndex) return;

    const next = new URLSearchParams(searchParams);
    next.set("index", String(currentIndex));
    setSearchParams(next, { replace: true });
  }, [illusts.length, currentIndex, requestedIndex, searchParams, setSearchParams]);

  // ========================================
  // イラスト切り替え操作
  // ========================================
  // ドット選択
  const handleSelectIllust = (index: number) => {
    const next = new URLSearchParams(searchParams);
    next.set("index", String(index));
    setSearchParams(next, { replace: true });
  };
  // 前のイラスト
  const handlePrevIllust = () => {
    if (illusts.length === 0) return;
    const nextIndex = currentIndex <= 0 ? illusts.length - 1 : currentIndex - 1;
    handleSelectIllust(nextIndex);
  };
  // 次のイラスト
  const handleNextIllust = () => {
    if (illusts.length === 0) return;
    const nextIndex = currentIndex >= illusts.length - 1 ? 0 : currentIndex + 1;
    handleSelectIllust(nextIndex);
  };

  // ========================================
  // コメント送信
  // 成功したら commentCount と comments を画面上で即時更新する
  // ========================================
  const handleSubmitComment = async () => {
    if (!currentIllust) return;

    const normalized = commentText.trim();
    if (!normalized) {
      setCommentError("コメントを入力してください。");
      return;
    }

    try {
      setIsSubmittingComment(true);
      setCommentError(null);

      const created = await postComment(currentIllust.id, {
        commentText: normalized,
      });

      if (isPokemonPage) {
        setPokemonDetail((prev) => {
          if (!prev) return prev;

          return {
            ...prev,
            illusts: prev.illusts.map((illust) =>
              illust.id === currentIllust.id
                ? {
                    ...illust,
                    commentCount: illust.commentCount + 1,
                    comments: [...illust.comments, created],
                  }
                : illust,
            ),
          };
        });
      } else {
        setOtherDetail((prev) => {
          if (!prev) return prev;

          return {
            ...prev,
            illusts: prev.illusts.map((illust) =>
              illust.id === currentIllust.id
                ? {
                    ...illust,
                    commentCount: illust.commentCount + 1,
                    comments: [...illust.comments, created],
                  }
                : illust,
            ),
          };
        });
      }

      setCommentText("");
    } catch (error) {
      setCommentError(
        error instanceof Error ? error.message : "コメント送信に失敗しました",
      );
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // ========================================
  // いいね切り替え
  // 成功したら likedByUser と likeCount を画面上で即時更新する
  // ========================================
  const handleToggleLike = async () => {
    if (!currentIllust) return;

    try {
      setIsSubmittingLike(true);

      const response = currentIllust.likedByUser
        ? await deleteLike(currentIllust.id)
        : await createLike(currentIllust.id);

      if (isPokemonPage) {
        setPokemonDetail((prev) => {
          if (!prev) return prev;

          return {
            ...prev,
            illusts: prev.illusts.map((illust) =>
              illust.id === currentIllust.id
                ? {
                    ...illust,
                    likedByUser: response.likedByUser,
                    likeCount: response.likeCount,
                  }
                : illust,
            ),
          };
        });
      } else {
        setOtherDetail((prev) => {
          if (!prev) return prev;

          return {
            ...prev,
            illusts: prev.illusts.map((illust) =>
              illust.id === currentIllust.id
                ? {
                    ...illust,
                    likedByUser: response.likedByUser,
                    likeCount: response.likeCount,
                  }
                : illust,
            ),
          };
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmittingLike(false);
    }
  };

  // ========================================
  // 画面状態表示
  // ========================================
  // 読み込み中
  if (isLoading) {
    return (
      <main className={styles.detailPage}>
        <div className={styles.detailPageContainer}>
          <Header
            currentUser={currentUser}
            onCurrentUserChange={onCurrentUserChange}
          />

          <div className={styles.detailPageActions}>
            <Link
              className={styles.detailPageBack}
              to={backTo}
            >
              ← 一覧に戻る
            </Link>
          </div>

          <p className={styles.detailPageMessage}>読み込み中...</p>
        </div>

        <ScrollTopButton />
      </main>
    );
  }
  // エラー
  if (loadError) {
    return (
      <main className={styles.detailPage}>
        <div className={styles.detailPageContainer}>
          <Header
            currentUser={currentUser}
            onCurrentUserChange={onCurrentUserChange}
          />

          <div className={styles.detailPageActions}>
            <Link
              className={styles.detailPageBack}
              to={backTo}
            >
              ← 一覧に戻る
            </Link>
          </div>

          <p className={styles.detailPageMessage}>エラー: {loadError}</p>
        </div>

        <ScrollTopButton />
      </main>
    );
  }

  // ========================================
  // 描画
  // ========================================
  if (isPokemonPage && !pokemonDetail) {
    return (
      <main className={styles.detailPage}>
        <div className={styles.detailPageContainer}>
          <Header
            currentUser={currentUser}
            onCurrentUserChange={onCurrentUserChange}
          />

          <div className={styles.detailPageActions}>
            <Link
              className={styles.detailPageBack}
              to={backTo}
            >
              ← 一覧に戻る
            </Link>
          </div>

          <p className={styles.detailPageMessage}>投稿が見つかりませんでした。</p>
        </div>

        <ScrollTopButton />
      </main>
    );
  }

  if (!isPokemonPage && (!otherDetail || !currentIllust)) {
    return (
      <main className={styles.detailPage}>
        <div className={styles.detailPageContainer}>
          <Header
            currentUser={currentUser}
            onCurrentUserChange={onCurrentUserChange}
          />

          <div className={styles.detailPageActions}>
            <Link
              className={styles.detailPageBack}
              to={backTo}
            >
              ← 一覧に戻る
            </Link>
          </div>

          <p className={styles.detailPageMessage}>投稿が見つかりませんでした。</p>
        </div>

        <ScrollTopButton />
      </main>
    );
  }

  return (
    <main className={styles.detailPage}>
      <div className={styles.detailPageContainer}>
        <Header
            currentUser={currentUser}
            onCurrentUserChange={onCurrentUserChange}
          />

        <div className={styles.detailPageActions}>
          <Link
            className={styles.detailPageBack}
            to={backTo}
          >
            ← 一覧に戻る
          </Link>
        </div>

        {isPokemonPage && pokemonDetail ? (
          <PokemonPostDetail
            detail={pokemonDetail}
            currentIllust={currentIllust}
            currentIndex={currentIndex}
            illustCount={pokemonDetail.illusts.length}
            onPrevIllust={handlePrevIllust}
            onNextIllust={handleNextIllust}
            onSelectIllust={handleSelectIllust}
            commentText={commentText}
            commentError={commentError}
            isSubmittingComment={isSubmittingComment}
            onCommentTextChange={setCommentText}
            onSubmitComment={handleSubmitComment}
            onToggleLike={handleToggleLike}
            isSubmittingLike={isSubmittingLike}
          />
        ) : (
          otherDetail && currentIllust && (
            <OtherPostDetail
              detail={otherDetail}
              currentIllust={currentIllust}
              currentIndex={currentIndex}
              illustCount={otherDetail.illusts.length}
              onPrevIllust={handlePrevIllust}
              onNextIllust={handleNextIllust}
              onSelectIllust={handleSelectIllust}
              commentText={commentText}
              commentError={commentError}
              isSubmittingComment={isSubmittingComment}
              onCommentTextChange={setCommentText}
              onSubmitComment={handleSubmitComment}
              onToggleLike={handleToggleLike}
              isSubmittingLike={isSubmittingLike}
            />
          )
        )}
      </div>

      <ScrollTopButton />
    </main>
  );
}

export default DetailPage;