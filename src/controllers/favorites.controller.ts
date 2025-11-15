import { Request, Response, NextFunction } from "express";
import { FavoritesService } from "../services/favorites.service";
import { MongoFavoritesRepository } from "../repositories/favorites.mongo.repository";
import { FavoritePokemonAttrs } from "../models/favorites.model";

const favoritesRepo = new MongoFavoritesRepository();
const favoritesService = new FavoritesService(favoritesRepo);

export const getFavorites = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const items = await favoritesService.getAllFavorites();
    res.json({ items });
  } catch (error) {
    next(error);
  }
};

export const addFavorite = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const body = req.body as Partial<FavoritePokemonAttrs>;

    if (
      !body ||
      typeof body.pokemonId !== "number" ||
      !body.name ||
      !body.spriteUrl ||
      !Array.isArray(body.types)
    ) {
      return res.status(400).json({ message: "Invalid favorite payload" });
    }

    const favorite = await favoritesService.addFavorite({
      pokemonId: body.pokemonId,
      name: body.name,
      spriteUrl: body.spriteUrl,
      types: body.types,
    });

    res.status(201).json(favorite);
  } catch (error) {
    next(error);
  }
};

export const removeFavorite = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const pokemonId = Number(req.params.pokemonId);
    if (Number.isNaN(pokemonId) || pokemonId <= 0) {
      return res.status(400).json({ message: "Invalid pokemon id" });
    }

    await favoritesService.removeFavorite(pokemonId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
