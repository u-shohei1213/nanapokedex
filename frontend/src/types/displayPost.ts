export type DisplayPokemonCard = {
  id: number;
  detailPath: string;
  kind: "pokemon";
  name: string;
  subname: string | null;
  dexNo: string;
  types: string[];
  region: string;
  postedAt: string | null;
  postUrl: string | null;
  originalUrl: string | null;
  imageUrl: string | null;
  likeCount: number;
  viewCount: number;
  commentCount: number;
  likedByUser: boolean;
  illustCount: number;
  currentIllustIndex: number;
  currentIllustId: number | null;
};

export type DisplayOtherCard = {
  id: number;
  detailPath: string;
  kind: "other";
  name: string;
  postedAt: string | null;
  postUrl: string | null;
  imageUrl: string | null;
  likeCount: number;
  viewCount: number;
  commentCount: number;
  likedByUser: boolean;
  illustCount: number;
  currentIllustIndex: number;
  currentIllustId: number | null;
};