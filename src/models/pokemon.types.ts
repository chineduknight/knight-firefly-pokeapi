// src/models/pokemon.types.ts

export interface PokemonListItem {
  id: number;
  name: string;
  spriteUrl: string;
  isFavorite: boolean;
}

export interface PokemonListResponse {
  items: PokemonListItem[];
  total: number;
}

export interface PokemonEvolution {
  id: number;
  name: string;
}

export interface PokemonDetails {
  id: number;
  name: string;
  spriteUrl: string;
  types: string[];
  abilities: string[];
  isFavorite: boolean;
  evolutions: PokemonEvolution[];
}
