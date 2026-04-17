import styles from "./HomePage.module.css";
import "react-tabs/style/react-tabs.css";
import { useEffect, useMemo, useState, type SetStateAction } from "react";
import { useSearchParams } from "react-router-dom";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

import Header from "../components/Header";
import PostList from "../components/PostList";
import SearchPanel from "../components/search/Panel";
import ScrollTopButton from "../components/ScrollTopButton";
import {
  OtherSortSelect,
  PokemonSortSelect,
  type OtherSortOption,
  type PokemonSortOption,
} from "../components/SortSelect";

import { fetchPokemonList } from "../api/pokemon";
import { fetchOtherList } from "../api/other";
import { createLike, deleteLike } from "../api/illusts";
import type {
  CurrentUser,
  OtherIllustSummaryResponse,
  OtherListItemResponse,
  PokemonIllustSummaryResponse,
  PokemonListItemResponse,
} from "../types/api";
import { normalizeJapanese } from "../utils/string";
import {
  type IllustNames,
  type LikeNames,
  type RegionNames,
  type TypeNames,
} from "../constants/nameTexts";

import { type DisplayPokemonCard, type DisplayOtherCard } from "../types/displayPost"

type HomePageProps = {
  currentUser: CurrentUser | null;
  onCurrentUserChange: (user: CurrentUser) => void;
};

// インデックス制御
function getSafeIndex(length: number, index: number): number {
  if (length <= 0) return 0;
  if (index < 0) return 0;
  if (index >= length) return length - 1;
  return index;
}

// 現在表示対象のイラスト取得(pokemon)
function getCurrentPokemonIllust(
  item: PokemonListItemResponse,
  indexMap: Record<number, number>,
): PokemonIllustSummaryResponse | null {
  if (item.illusts.length === 0) return null;
  const index = getSafeIndex(item.illusts.length, indexMap[item.id] ?? 0);
  return item.illusts[index] ?? null;
}

// 現在表示対象のイラスト取得(other)
function getCurrentOtherIllust(
  item: OtherListItemResponse,
  indexMap: Record<number, number>,
): OtherIllustSummaryResponse | null {
  if (item.illusts.length === 0) return null;
  const index = getSafeIndex(item.illusts.length, indexMap[item.id] ?? 0);
  return item.illusts[index] ?? null;
}

// APIレスポンスを一覧表示用のデータへ変換(pokemon)
function toDisplayPokemonCards(
  items: PokemonListItemResponse[],
  indexMap: Record<number, number>,
): DisplayPokemonCard[] {
  return items.map((item) => {
    const currentIndex = getSafeIndex(item.illusts.length, indexMap[item.id] ?? 0);
    const currentIllust = item.illusts[currentIndex] ?? null;

    return {
      id: item.id,
      detailPath: `/pokemon/${item.id}?index=${currentIndex}`,
      kind: "pokemon",
      name: item.name,
      subname: item.subname,
      dexNo: item.dexNo,
      types: item.types,
      region: item.region,
      postedAt: null,
      postUrl: currentIllust?.postUrl ?? null,
      imageUrl: currentIllust?.imageUrl ?? null,
      originalUrl: null,
      likeCount: currentIllust?.likeCount ?? 0,
      viewCount: currentIllust?.viewCount ?? 0,
      commentCount: currentIllust?.commentCount ?? 0,
      likedByUser: currentIllust?.likedByUser ?? false,
      illustCount: item.illusts.length,
      currentIllustIndex: currentIndex,
      currentIllustId: currentIllust?.id ?? null,
    };
  });
}

// APIレスポンスを一覧表示用のデータへ変換(other)
function toDisplayOtherCards(
  items: OtherListItemResponse[],
  indexMap: Record<number, number>,
): DisplayOtherCard[] {
  return items.map((item) => {
    const currentIndex = getSafeIndex(item.illusts.length, indexMap[item.id] ?? 0);
    const currentIllust = item.illusts[currentIndex] ?? null;

    return {
      id: item.id,
      detailPath: `/other/${item.id}?index=${currentIndex}`,
      kind: "other",
      name: item.name,
      postedAt: item.postedAt,
      postUrl: currentIllust?.postUrl ?? null,
      imageUrl: currentIllust?.imageUrl ?? null,
      likeCount: currentIllust?.likeCount ?? 0,
      viewCount: currentIllust?.viewCount ?? 0,
      commentCount: currentIllust?.commentCount ?? 0,
      likedByUser: currentIllust?.likedByUser ?? false,
      illustCount: item.illusts.length,
      currentIllustIndex: currentIndex,
      currentIllustId: currentIllust?.id ?? null,
    };
  });
}

// HomePage 本体
function HomePage({
  currentUser,
  onCurrentUserChange
}: HomePageProps) {
  // ========================================
  // 画面状態
  // ========================================
  // 検索パネルの状態
  const [isSearchPanelOpen, setIsSearchPanelOpen] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  // 一覧データ
  const [pokemonItems, setPokemonItems] = useState<PokemonListItemResponse[]>([]);
  const [otherItems, setOtherItems] = useState<OtherListItemResponse[]>([]);
  // 表示中のイラスト番号
  const [pokemonIllustIndexes, setPokemonIllustIndexes] = useState<Record<number, number>>({});
  const [otherIllustIndexes, setOtherIllustIndexes] = useState<Record<number, number>>({});
  // 読み込み状態とエラー
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // ========================================
  // URLクエリから現在の表示条件を復元
  // ========================================
  // タブ
  const selectedTabIndex = Number(searchParams.get("tab")) || 0;
  // ソート条件
  const pSortKey =
    (searchParams.get("p_sort") as PokemonSortOption) || "dexNo-asc";
  const oSortKey =
    (searchParams.get("o_sort") as OtherSortOption) || "postedAt-desc";
  // 検索キーワード
  const pKeyword = searchParams.get("p_keyword") ?? "";
  const oKeyword = searchParams.get("o_keyword") ?? "";
  // タイプ
  const pSelectedTypes =
    (searchParams.get("p_types")?.split(",").filter(Boolean) as TypeNames[]) ?? [];
  // 地域
  const pSelectedRegions =
    (searchParams.get("p_regions")?.split(",").filter(Boolean) as RegionNames[]) ?? [];
  // イラスト有無
  const pSelectedIllusts =
    (searchParams.get("p_illusts")?.split(",").filter(Boolean) as IllustNames[]) ?? [];
  // いいね有無
  const pSelectedLikes =
    (searchParams.get("p_likes")?.split(",").filter(Boolean) as LikeNames[]) ?? [];
  const oSelectedLikes =
    (searchParams.get("o_likes")?.split(",").filter(Boolean) as LikeNames[]) ?? [];

  // ========================================
  // 一覧データ取得
  // 初回表示時、およびユーザー切り替え時の一覧再取得
  // ========================================
  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        setIsLoading(true);
        setLoadError(null);

        const [pokemonData, otherData] = await Promise.all([
          fetchPokemonList(),
          fetchOtherList(),
        ]);

        if (cancelled) return;

        setPokemonItems(pokemonData);
        setOtherItems(otherData);
      } catch (error) {
        if (cancelled) return;

        setLoadError(
          error instanceof Error ? error.message : "一覧の取得に失敗しました",
        );
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadData();

    return () => {
      cancelled = true;
    };
  }, [currentUser?.userId]);

  // ========================================
  // URLクエリ更新系ハンドラ
  // URLを単一の状態ソースとして扱う
  // ========================================
  // パラメータ更新
  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);

    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }

    setSearchParams(next);
  };
  // タブ選択
  const handleTabSelect = (index: SetStateAction<number>) => {
    updateParam("tab", index.toString());
  };
  // キーワード変更
  const handlePokemonKeywordChange = (keyword: string) => {
    updateParam("p_keyword", keyword);
  };
  const handleOtherKeywordChange = (keyword: string) => {
    updateParam("o_keyword", keyword);
  };
  // タイプ変更
  const handlePokemonSelectedTypesChange = (types: TypeNames[]) => {
    updateParam("p_types", types.join(","));
  };
  // 地域変更
  const handlePokemonSelectedRegionsChange = (regions: RegionNames[]) => {
    updateParam("p_regions", regions.join(","));
  };
  // イラスト有無変更
  const handlePokemonSelectedIllustsChange = (illusts: IllustNames[]) => {
    updateParam("p_illusts", illusts.join(","));
  };
  // いいね有無変更
  const handlePokemonSelectedLikesChange = (likes: LikeNames[]) => {
    updateParam("p_likes", likes.join(","));
  };
  const handleOtherSelectedLikesChange = (likes: LikeNames[]) => {
    updateParam("o_likes", likes.join(","));
  };
  // 検索条件リセット
  const handlePokemonSearchReset = () => {
    const next = new URLSearchParams(searchParams);
    next.delete("p_keyword");
    next.delete("p_types");
    next.delete("p_regions");
    next.delete("p_illusts");
    next.delete("p_likes");
    setSearchParams(next);
  };
  const handleOtherSearchReset = () => {
    const next = new URLSearchParams(searchParams);
    next.delete("o_keyword");
    next.delete("o_likes");
    setSearchParams(next);
  };
  // ソート変更
  const handlePokemonSortChange = (sort: PokemonSortOption) => {
    updateParam("p_sort", sort);
  };
  const handleOtherSortChange = (sort: OtherSortOption) => {
    updateParam("o_sort", sort);
  };

  // ========================================
  // 一覧カード内のイラスト切り替え状態
  // 投稿ごとに現在表示中のイラスト番号を保持する
  // ========================================
  const handlePokemonIllustIndexChange = (pokemonId: number, nextIndex: number) => {
    setPokemonIllustIndexes((prev) => ({
      ...prev,
      [pokemonId]: nextIndex,
    }));
  };

  const handleOtherIllustIndexChange = (otherId: number, nextIndex: number) => {
    setOtherIllustIndexes((prev) => ({
      ...prev,
      [otherId]: nextIndex,
    }));
  };

  // ========================================
  // いいね・閲覧数など、イラスト単位の表示更新用ヘルパー
  // 対象投稿と対象イラストだけを部分的に更新する
  // ========================================
  const updatePokemonIllustReaction = (
    pokemonId: number,
    illustId: number,
    updater: (illust: PokemonIllustSummaryResponse) => PokemonIllustSummaryResponse,
  ) => {
    setPokemonItems((prev) =>
      prev.map((item) => {
        if (item.id !== pokemonId) return item;

        return {
          ...item,
          illusts: item.illusts.map((illust) =>
            illust.id === illustId ? updater(illust) : illust,
          ),
        };
      }),
    );
  };

  const updateOtherIllustReaction = (
    otherId: number,
    illustId: number,
    updater: (illust: OtherIllustSummaryResponse) => OtherIllustSummaryResponse,
  ) => {
    setOtherItems((prev) =>
      prev.map((item) => {
        if (item.id !== otherId) return item;

        return {
          ...item,
          illusts: item.illusts.map((illust) =>
            illust.id === illustId ? updater(illust) : illust,
          ),
        };
      }),
    );
  };

  // ========================================
  // 一覧カードのいいね切り替え
  // 現在表示中のイラストに対してAPIを呼び、
  // 成功したら一覧データ内の likedByUser / likeCount を更新する
  // ========================================
  const handleTogglePokemonLike = async (post: DisplayPokemonCard) => {
    if (!post.currentIllustId) return;

    try {
      const response = post.likedByUser
        ? await deleteLike(post.currentIllustId)
        : await createLike(post.currentIllustId);

      updatePokemonIllustReaction(post.id, post.currentIllustId, (illust) => ({
        ...illust,
        likedByUser: response.likedByUser,
        likeCount: response.likeCount,
      }));
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggleOtherLike = async (post: DisplayOtherCard) => {
    if (!post.currentIllustId) return;

    try {
      const response = post.likedByUser
        ? await deleteLike(post.currentIllustId)
        : await createLike(post.currentIllustId);

      updateOtherIllustReaction(post.id, post.currentIllustId, (illust) => ({
        ...illust,
        likedByUser: response.likedByUser,
        likeCount: response.likeCount,
      }));
    } catch (error) {
      console.error(error);
    }
  };

  // ========================================
  // 一覧の絞り込み
  // ========================================
  const filteredPokemonItems = useMemo(() => {
    const keyword = normalizeJapanese(pKeyword.trim()).toLowerCase();

    return pokemonItems.filter((item) => {
      const name = normalizeJapanese(item.name).toLowerCase();
      const dexNo = item.dexNo.toLowerCase();

      const matchesKeyword =
        keyword === "" || name.includes(keyword) || dexNo.includes(keyword);

      const matchesType =
        pSelectedTypes.length === 0 ||
        item.types.some((type) => pSelectedTypes.includes(type as TypeNames));

      const matchesRegion =
        pSelectedRegions.length === 0 ||
        pSelectedRegions.includes(item.region as RegionNames);

      const matchesIllust =
        pSelectedIllusts.length === 0 ||
        (item.illusts.length > 0 && pSelectedIllusts.includes("投稿あり")) ||
        (item.illusts.length === 0 && pSelectedIllusts.includes("未投稿"));

      const matchesLike =
        pSelectedLikes.length === 0 ||
        (item.illusts.some((illust) => illust.likedByUser) &&
          pSelectedLikes.includes("いいね済み")) ||
        (!item.illusts.some((illust) => illust.likedByUser) &&
          pSelectedLikes.includes("未いいね"));

      return (
        matchesKeyword &&
        matchesType &&
        matchesRegion &&
        matchesIllust &&
        matchesLike
      );
    });
  }, [
    pokemonItems,
    pKeyword,
    pSelectedTypes,
    pSelectedRegions,
    pSelectedIllusts,
    pSelectedLikes,
  ]);
  const filteredOtherItems = useMemo(() => {
    const keyword = normalizeJapanese(oKeyword.trim()).toLowerCase();

    return otherItems.filter((item) => {
      const name = normalizeJapanese(item.name).toLowerCase();

      const matchesKeyword = keyword === "" || name.includes(keyword);

      const matchesLike =
        oSelectedLikes.length === 0 ||
        (item.illusts.some((illust) => illust.likedByUser) &&
          oSelectedLikes.includes("いいね済み")) ||
        (!item.illusts.some((illust) => illust.likedByUser) &&
          oSelectedLikes.includes("未いいね"));

      return matchesKeyword && matchesLike;
    });
  }, [otherItems, oKeyword, oSelectedLikes]);

  // ========================================
  // 一覧のソート
  // ========================================
  const sortedPokemonItems = useMemo(() => {
    const items = [...filteredPokemonItems];

    items.sort((a, b) => {
      const aIllust = getCurrentPokemonIllust(a, pokemonIllustIndexes);
      const bIllust = getCurrentPokemonIllust(b, pokemonIllustIndexes);

      switch (pSortKey) {
        case "dexNo-asc":
          return Number(a.dexNo) - Number(b.dexNo);
        case "dexNo-desc":
          return Number(b.dexNo) - Number(a.dexNo);
        case "name-asc":
          return a.name.localeCompare(b.name, "ja");
        case "name-desc":
          return b.name.localeCompare(a.name, "ja");
        case "viewCount-desc":
          return (bIllust?.viewCount ?? 0) - (aIllust?.viewCount ?? 0);
        case "viewCount-asc":
          return (aIllust?.viewCount ?? 0) - (bIllust?.viewCount ?? 0);
        case "commentCount-desc":
          return (bIllust?.commentCount ?? 0) - (aIllust?.commentCount ?? 0);
        case "commentCount-asc":
          return (aIllust?.commentCount ?? 0) - (bIllust?.commentCount ?? 0);
        case "likeCount-desc":
          return (bIllust?.likeCount ?? 0) - (aIllust?.likeCount ?? 0);
        case "likeCount-asc":
          return (aIllust?.likeCount ?? 0) - (bIllust?.likeCount ?? 0);
        default:
          return 0;
      }
    });

    return items;
  }, [filteredPokemonItems, pSortKey, pokemonIllustIndexes]);
  const sortedOtherItems = useMemo(() => {
    const items = [...filteredOtherItems];

    const toTime = (value: string | null) => {
      if (!value) return 0;
      const time = new Date(value).getTime();
      return Number.isNaN(time) ? 0 : time;
    };

    items.sort((a, b) => {
      const aIllust = getCurrentOtherIllust(a, otherIllustIndexes);
      const bIllust = getCurrentOtherIllust(b, otherIllustIndexes);

      switch (oSortKey) {
        case "name-asc":
          return a.name.localeCompare(b.name, "ja");
        case "name-desc":
          return b.name.localeCompare(a.name, "ja");
        case "viewCount-desc":
          return (bIllust?.viewCount ?? 0) - (aIllust?.viewCount ?? 0);
        case "viewCount-asc":
          return (aIllust?.viewCount ?? 0) - (bIllust?.viewCount ?? 0);
        case "commentCount-desc":
          return (bIllust?.commentCount ?? 0) - (aIllust?.commentCount ?? 0);
        case "commentCount-asc":
          return (aIllust?.commentCount ?? 0) - (bIllust?.commentCount ?? 0);
        case "likeCount-desc":
          return (bIllust?.likeCount ?? 0) - (aIllust?.likeCount ?? 0);
        case "likeCount-asc":
          return (aIllust?.likeCount ?? 0) - (bIllust?.likeCount ?? 0);
        case "postedAt-desc":
          return toTime(b.postedAt) - toTime(a.postedAt);
        case "postedAt-asc":
          return toTime(a.postedAt) - toTime(b.postedAt);
        default:
          return 0;
      }
    });

    return items;
  }, [filteredOtherItems, oSortKey, otherIllustIndexes]);

  // ========================================
  // 表示用データ生成
  // ========================================
  const displayPokemonCards = useMemo(() => {
    return toDisplayPokemonCards(sortedPokemonItems, pokemonIllustIndexes);
  }, [sortedPokemonItems, pokemonIllustIndexes]);

  const displayOtherCards = useMemo(() => {
    return toDisplayOtherCards(sortedOtherItems, otherIllustIndexes);
  }, [sortedOtherItems, otherIllustIndexes]);

  // ========================================
  // 画面状態表示
  // ========================================
  // 読み込み中
  if (isLoading) {
    return <main className={styles.homePage}>読み込み中...</main>;
  }
  // エラー
  if (loadError) {
    return <main className={styles.homePage}>エラー: {loadError}</main>;
  }

  // ========================================
  // 描画
  // ========================================
  return (
    <main className={styles.homePage}>
      <div className={styles.homePageContainer}>
        <Header
          currentUser={currentUser}
          onCurrentUserChange={onCurrentUserChange}
        />

        <Tabs
          className={styles.homePageTab}
          selectedIndex={selectedTabIndex}
          onSelect={handleTabSelect}
        >
          <TabList>
            <Tab>ポケモン図鑑</Tab>
            <Tab>その他</Tab>
          </TabList>

          <TabPanel>
            <div className={styles.homePageTools}>
              <div className={styles.homePageSort}>
                <PokemonSortSelect
                  value={pSortKey}
                  onChange={handlePokemonSortChange}
                />
              </div>

              <SearchPanel
                selectedTabIndex={selectedTabIndex}
                isOpen={isSearchPanelOpen}
                onToggleOpen={() => setIsSearchPanelOpen((prev) => !prev)}
                searchText={pKeyword}
                onSearchTextChange={handlePokemonKeywordChange}
                selectedTypes={pSelectedTypes}
                onSelectedTypesChange={handlePokemonSelectedTypesChange}
                selectedRegions={pSelectedRegions}
                onSelectedRegionsChange={handlePokemonSelectedRegionsChange}
                selectedIllusts={pSelectedIllusts}
                onSelectedIllustsChange={handlePokemonSelectedIllustsChange}
                selectedLikes={pSelectedLikes}
                onSelectedLikesChange={handlePokemonSelectedLikesChange}
                onReset={handlePokemonSearchReset}
              />
            </div>

            <PostList
              selectedTabIndex={selectedTabIndex}
              posts={displayPokemonCards}
              onPrevIllust={(id) => {
                const item = sortedPokemonItems.find((x) => x.id === id);
                if (!item || item.illusts.length === 0) return;
                const current = pokemonIllustIndexes[id] ?? 0;
                const next = current <= 0 ? item.illusts.length - 1 : current - 1;
                handlePokemonIllustIndexChange(id, next);
              }}
              onNextIllust={(id) => {
                const item = sortedPokemonItems.find((x) => x.id === id);
                if (!item || item.illusts.length === 0) return;
                const current = pokemonIllustIndexes[id] ?? 0;
                const next = current >= item.illusts.length - 1 ? 0 : current + 1;
                handlePokemonIllustIndexChange(id, next);
              }}
              onSelectIllust={(id, index) => {
                handlePokemonIllustIndexChange(id, index);
              }}
              onToggleLike={(post) => {
                handleTogglePokemonLike(post as DisplayPokemonCard);
              }}
            />
          </TabPanel>

          <TabPanel>
            <div className={styles.homePageTools}>
              <div className={styles.homePageSort}>
                <OtherSortSelect
                  value={oSortKey}
                  onChange={handleOtherSortChange}
                />
              </div>

              <SearchPanel
                selectedTabIndex={selectedTabIndex}
                isOpen={isSearchPanelOpen}
                onToggleOpen={() => setIsSearchPanelOpen((prev) => !prev)}
                searchText={oKeyword}
                onSearchTextChange={handleOtherKeywordChange}
                selectedTypes={[]}
                onSelectedTypesChange={() => {}}
                selectedRegions={[]}
                onSelectedRegionsChange={() => {}}
                selectedIllusts={[]}
                onSelectedIllustsChange={() => {}}
                selectedLikes={oSelectedLikes}
                onSelectedLikesChange={handleOtherSelectedLikesChange}
                onReset={handleOtherSearchReset}
              />
            </div>

            <PostList
              selectedTabIndex={selectedTabIndex}
              posts={displayOtherCards}
              onPrevIllust={(id) => {
                const item = sortedOtherItems.find((x) => x.id === id);
                if (!item || item.illusts.length === 0) return;
                const current = otherIllustIndexes[id] ?? 0;
                const next = current <= 0 ? item.illusts.length - 1 : current - 1;
                handleOtherIllustIndexChange(id, next);
              }}
              onNextIllust={(id) => {
                const item = sortedOtherItems.find((x) => x.id === id);
                if (!item || item.illusts.length === 0) return;
                const current = otherIllustIndexes[id] ?? 0;
                const next = current >= item.illusts.length - 1 ? 0 : current + 1;
                handleOtherIllustIndexChange(id, next);
              }}
              onSelectIllust={(id, index) => {
                handleOtherIllustIndexChange(id, index);
              }}
              onToggleLike={(post) => {
                handleToggleOtherLike(post as DisplayOtherCard);
              }}
            />
          </TabPanel>
        </Tabs>
      </div>

      <ScrollTopButton />
    </main>
  );
}

export default HomePage;