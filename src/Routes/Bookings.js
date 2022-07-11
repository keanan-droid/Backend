import { Router,json } from "express";
import { BookingController } from "../Controller/Bookings";

const router = Router();
const Controller = new BookingController();

router.post("/user/inventory/bookings", json(), (request, response, next) => {
    Controller.rentMovie(request, response, next);
});

router.delete("/user/inventory/bookings/:id", json(), (request, response, next) => {
    Controller.returnMovie(request, response, next);
});

router.get("/user/inventory/bookings", json(), (request, response, next) => {
    Controller.getBookings(request, response, next);
});

export default router;