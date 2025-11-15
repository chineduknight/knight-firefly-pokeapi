// src/utils/pokeapiToDomain.mapper.ts
import {
  PokemonDetails,
  PokemonEvolution,
  PokemonListItem,
} from "../models/pokemon.types";
import {
  PokeApiListResponse,
  PokeApiPokemonResponse,
  PokeApiEvolutionChainResponse,
  EvolutionChainLink,
} from "../clients/pokeapi.client";

export const buildSpriteUrl = (id: number): string =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

export const mapPokemonListResponse = (
  apiResponse: PokeApiListResponse,
  favoriteIds: number[]
): { items: PokemonListItem[]; total: number } => {
  const items = apiResponse.results.map((item) => {
    const id = extractIdFromUrl(item.url);
    return {
      id,
      name: item.name,
      spriteUrl: buildSpriteUrl(id),
      isFavorite: favoriteIds.includes(id),
    };
  });

  return {
    items,
    total: apiResponse.count,
  };
};

export const mapPokemonDetails = (
  apiPokemon: PokeApiPokemonResponse,
  evolutions: PokemonEvolution[],
  isFavorite: boolean
): PokemonDetails => {
  const spriteFromOfficial =
    apiPokemon.sprites.other?.["official-artwork"]?.front_default;

  const spriteUrl =
    spriteFromOfficial ?? apiPokemon.sprites.front_default ?? "";

  return {
    id: apiPokemon.id,
    name: apiPokemon.name,
    spriteUrl,
    types: apiPokemon.types.map((t) => t.type.name),
    abilities: apiPokemon.abilities.map((a) => a.ability.name),
    isFavorite,
    evolutions,
  };
};

export const mapEvolutionChain = (
  evolutionChain: PokeApiEvolutionChainResponse
): PokemonEvolution[] => {
  const result: PokemonEvolution[] = [];

  const visitNode = (node: EvolutionChainLink) => {
    const { name, url } = node.species;

    const id = extractIdFromUrl(url);
    result.push({ id, name });

    // Recurse into all evolution branches (handles branched evolutions like Eevee)
    node.evolves_to.forEach(visitNode);
  };

  visitNode(evolutionChain.chain);

  // Optional: de-duplicate in case of weird data or shared branches
  const unique = new Map<number, PokemonEvolution>();
  for (const evo of result) {
    if (!unique.has(evo.id)) {
      unique.set(evo.id, evo);
    }
  }

  return Array.from(unique.values());
};

export const extractIdFromUrl = (url: string): number => {
  const segments = url.split("/").filter(Boolean);
  const idSegment = segments[segments.length - 1];
  return Number(idSegment);
};
