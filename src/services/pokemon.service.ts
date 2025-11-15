// src/services/pokemon.service.ts
import { FavoritesRepository } from "../repositories/favorites.repository";
import {
  fetchEvolutionChain,
  fetchPokemonDetails,
  fetchPokemonList,
  fetchPokemonSpecies,
} from "../clients/pokeapi.client";
import {
  mapEvolutionChain,
  mapPokemonDetails,
  mapPokemonListResponse,
} from "../utils/pokeapiToDomain.mapper";
import { PokemonDetails, PokemonListResponse } from "../models/pokemon.types";

export class PokemonService {
  constructor(private readonly favoritesRepo: FavoritesRepository) {}

  async getPokemonList(limit: number): Promise<PokemonListResponse> {
    const [apiList, favoriteIds] = await Promise.all([
      fetchPokemonList(limit),
      this.favoritesRepo.getIds(),
    ]);

    return mapPokemonListResponse(apiList, favoriteIds);
  }

  async getPokemonDetails(id: number): Promise<PokemonDetails> {
    const [apiPokemon, species, isFavorite] = await Promise.all([
      fetchPokemonDetails(id),
      fetchPokemonSpecies(id),
      this.favoritesRepo.isFavorite(id),
    ]);

    const evolutionChainResponse = await fetchEvolutionChain(
      species.evolution_chain.url
    );

    const evolutions = mapEvolutionChain(evolutionChainResponse);

    return mapPokemonDetails(apiPokemon, evolutions, isFavorite);
  }
}
