import { Request, Response, NextFunction } from "express";
import { PokemonService } from "../services/pokemon.service";
import { MongoFavoritesRepository } from "../repositories/favorites.mongo.repository";

const favoritesRepo = new MongoFavoritesRepository();
const pokemonService = new PokemonService(favoritesRepo);

export const getPokemonList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const limitParam = req.query.limit as string | undefined;
    const limit = limitParam ? Number(limitParam) : 150;

    const data = await pokemonService.getPokemonList(limit);
    res.json({
      success: true,
      data: {
        ...data.items,
        total: data.total,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getPokemonDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id) || id <= 0) {
      return res.status(400).json({ message: "Invalid pokemon id" });
    }

    const data = await pokemonService.getPokemonDetails(id);
    res.json(data);
  } catch (error) {
    next(error);
  }
};
