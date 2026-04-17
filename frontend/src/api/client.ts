const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000";

type ErrorResponse = {
  detail?: string;
};

function isJsonResponse(response: Response): boolean {
  const contentType = response.headers.get("content-type");
  return contentType?.includes("application/json") ?? false;
}

/**
 * 共通APIクライアント
 *
 * - cookie を送るため credentials: "include" を固定
 * - FastAPI の {"detail": "..."} エラーを Error に変換
 * - 204 No Content に対応
 */
export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    headers: {
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (!response.ok) {
    let detail = `Request failed: ${response.status}`;

    if (isJsonResponse(response)) {
      try {
        const data = (await response.json()) as ErrorResponse;
        if (data.detail) {
          detail = data.detail;
        }
      } catch {
        // JSONパース失敗時はデフォルト文言のまま
      }
    }

    throw new Error(detail);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  if (!isJsonResponse(response)) {
    return undefined as T;
  }

  return (await response.json()) as T;
}