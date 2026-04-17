export const typeNames = [
  "ノーマル",
  "ほのお",
  "みず",
  "でんき",
  "くさ",
  "こおり",
  "かくとう",
  "どく",
  "じめん",
  "ひこう",
  "エスパー",
  "むし",
  "いわ",
  "ゴースト",
  "ドラゴン",
  "あく",
  "はがね",
  "フェアリー",
] as const;

export type TypeNames = (typeof typeNames)[number];

export const regionNames = [
  "カントー",
  "ジョウト",
  "ホウエン",
  "シンオウ",
//  "イッシュ",
//  "カロス",
//  "アローラ",
//  "ガラル",
//  "ヒスイ",
//  "パルデア",
//  "未確認",
] as const;

export type RegionNames = (typeof regionNames)[number];

export const illustNames = [
  "投稿あり",
  "未投稿",
] as const;

export type IllustNames = (typeof illustNames)[number];

export const likeNames = [
  "いいね済み",
  "未いいね",
] as const;

export type LikeNames = (typeof likeNames)[number];