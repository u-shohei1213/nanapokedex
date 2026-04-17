import { apiFetch } from "./client";
import type {
  OtherDetailResponse,
  OtherListItemResponse,
} from "../types/api";

export async function fetchOtherList(): Promise<OtherListItemResponse[]> {
  return apiFetch<OtherListItemResponse[]>("/other");
}

export async function fetchOtherDetail(
  id: number,
): Promise<OtherDetailResponse> {
  return apiFetch<OtherDetailResponse>(`/other/${id}`);
}