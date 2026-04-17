import { apiFetch } from "./client";
import type {
  PokemonDetailResponse,
  PokemonListItemResponse,
} from "../types/api";

export async function fetchPokemonList(): Promise<PokemonListItemResponse[]> {
  return apiFetch<PokemonListItemResponse[]>("/pokemon");
}

export async function fetchPokemonDetail(
  id: number,
): Promise<PokemonDetailResponse> {
  return apiFetch<PokemonDetailResponse>(`/pokemon/${id}`);
}