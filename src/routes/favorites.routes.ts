import { Router } from "express";
import {
  getFavorites,
  addFavorite,
  removeFavorite,
} from "../controllers/favorites.controller";

const router = Router();

router.get("/", getFavorites); // GET /api/favorites
router.post("/", addFavorite); // POST /api/favorites
router.delete("/:pokemonId", removeFavorite); // DELETE /api/favorites/25

export default router;
