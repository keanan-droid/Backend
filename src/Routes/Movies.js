import { Router,json } from "express";
import { MovieController } from "../Controller/Movies";
import { isAdmin } from "../Middlewares/isAdmin";

const router = Router();
const Controller = new MovieController();

//ADMIN
router.post("/database/inventory", json(), isAdmin, (request, response, next) => {
    Controller.addMovie(request, response, next);
});

//ADMIN
router.delete("/database/inventory", json(), (request, response) => {
    Controller.deleteMovie(request, response);
});

//USER
router.get("/database/inventory/:id", json(), (request, response) => {
    Controller.movieById(request, response);
});

//USER
router.get("/database/inventory", json(), (request, response) => {
    Controller.allMovies(request, response);
});

//USER
router.get("/database/inventory/genre", json(), (request, response) => {
    Controller.filterByGenre(request, response);
});

//ADMIN
router.get("/database/inventory/unreturned", json(), (request, response) => {
    Controller.filterByUnReturned(request, response);
});

export default router;