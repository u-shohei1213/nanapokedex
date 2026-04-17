import { apiFetch } from "./client";
import type {
  IllustCommentCreateRequest,
  IllustCommentResponse,
  IllustLikeResponse,
  IllustViewResponse,
} from "../types/api";

export async function createLike(illustId: number): Promise<IllustLikeResponse> {
  return apiFetch<IllustLikeResponse>(`/illusts/${illustId}/likes`, {
    method: "POST",
  });
}

export async function deleteLike(illustId: number): Promise<IllustLikeResponse> {
  return apiFetch<IllustLikeResponse>(`/illusts/${illustId}/likes`, {
    method: "DELETE",
  });
}

export async function incrementViewCount(
  illustId: number,
): Promise<IllustViewResponse> {
  return apiFetch<IllustViewResponse>(`/illusts/${illustId}/views`, {
    method: "POST",
  });
}

export async function postComment(
  illustId: number,
  body: IllustCommentCreateRequest,
): Promise<IllustCommentResponse> {
  return apiFetch<IllustCommentResponse>(`/illusts/${illustId}/comments`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}