import {
  FavoritePokemon,
  FavoritePokemonAttrs,
} from "../models/favorites.model";
import { FavoritesRepository } from "../repositories/favorites.repository";

export class FavoritesService {
  constructor(private readonly favoritesRepo: FavoritesRepository) {}

  getAllFavorites(): Promise<FavoritePokemon[]> {
    return this.favoritesRepo.getAll();
  }

  addFavorite(attrs: FavoritePokemonAttrs): Promise<FavoritePokemon> {
    return this.favoritesRepo.addFavorite(attrs);
  }

  removeFavorite(pokemonId: number): Promise<void> {
    return this.favoritesRepo.removeFavorite(pokemonId);
  }
}
