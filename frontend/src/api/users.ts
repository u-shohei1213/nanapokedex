import { apiFetch } from "./client";
import type {
  CurrentUser,
  RandomDisplayNameResponse,
  UserLoginRequest,
  UserRegisterRequest,
} from "../types/api";

/**
 * 現在ユーザー取得
 * GET /users/me
 */
export async function fetchCurrentUser(): Promise<CurrentUser> {
  return apiFetch<CurrentUser>("/users/me");
}

/**
 * ゲストユーザー作成または復元
 * POST /users/guest
 */
export async function createGuestUser(): Promise<CurrentUser> {
  return apiFetch<CurrentUser>("/users/guest", {
    method: "POST",
  });
}

/**
 * ランダム表示名取得
 * GET /users/random-display-name
 */
export async function fetchRandomDisplayName(): Promise<string> {
  const response = await apiFetch<RandomDisplayNameResponse>(
    "/users/random-display-name",
  );
  return response.displayUserName;
}

/**
 * ログイン
 * POST /users/login
 */
export async function loginUser(
  body: UserLoginRequest,
): Promise<CurrentUser> {
  return apiFetch<CurrentUser>("/users/login", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

/**
 * ユーザー登録
 * POST /users/register
 */
export async function registerUser(
  body: UserRegisterRequest,
): Promise<CurrentUser> {
  return apiFetch<CurrentUser>("/users/register", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

/**
 * 表示名変更
 * POST /users/me/display-name
 */
export async function updateDisplayName(
  displayName: string | null,
): Promise<CurrentUser> {
  return apiFetch<CurrentUser>("/users/me/display-name", {
    method: "PATCH",
    body: JSON.stringify({ displayName }),
  });
}