export type CurrentUser = {
  userId: number;
  displayUserName: string | null;
  isGuest: boolean;
  isAdmin: boolean;
};

export type RandomDisplayNameResponse = {
  displayUserName: string;
};

export type UserLoginRequest = {
  loginId: string;
  password: string;
};

export type UserRegisterRequest = {
  loginId: string;
  password: string;
  displayName?: string | null;
};

export type IllustCommentCreateRequest = {
  commentText: string;
};

export type IllustCommentResponse = {
  id: number;
  content: string;
  postedAt: string;
  displayUserName: string | null;
};

export type IllustLikeResponse = {
  likedByUser: boolean;
  likeCount: number;
};

export type IllustViewResponse = {
  viewCount: number;
};

export type PokemonIllustSummaryResponse = {
  id: number;
  postUrl: string;
  imageUrl: string;
  likeCount: number;
  viewCount: number;
  commentCount: number;
  likedByUser: boolean;
};

export type PokemonListItemResponse = {
  id: number;
  kind: "pokemon";
  name: string;
  subname: string | null;
  dexNo: string;
  types: string[];
  region: string;
  illusts: PokemonIllustSummaryResponse[];
};

export type OtherIllustSummaryResponse = {
  id: number;
  postUrl: string;
  imageUrl: string;
  likeCount: number;
  viewCount: number;
  commentCount: number;
  likedByUser: boolean;
};

export type OtherListItemResponse = {
  id: number;
  kind: "other";
  name: string;
  postedAt: string;
  illusts: OtherIllustSummaryResponse[];
};

export type IllustDetailResponse = {
  id: number;
  postUrl: string;
  imageUrl: string;
  postedAt: string;
  likeCount: number;
  viewCount: number;
  commentCount: number;
  likedByUser: boolean;
  comments: IllustCommentResponse[];
};

export type PokemonDetailResponse = {
  id: number;
  kind: "pokemon";
  name: string;
  subname: string | null;
  dexNo: string;
  types: string[];
  region: string;
  originalUrl: string;
  illusts: IllustDetailResponse[];
};

export type OtherDetailResponse = {
  id: number;
  kind: "other";
  name: string;
  postedAt: string;
  illusts: IllustDetailResponse[];
};