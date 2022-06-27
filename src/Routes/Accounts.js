import { Router, json } from "express";
import { AuthController } from "../Controller/Accounts";

const router = Router();
const Controller = new AuthController();

//USER,ADMIN
router.post("/api/accounts/signup", json(), (req, res, next) => {
    Controller.signup(req, res, next);
});

//USER
router.post("/api/accounts/signin", json(), (req, res) => {
    Controller.signin(req, res);
});

//ADMIN
router.get("/api/accounts/getall", json(), (req, res) => {
    Controller.getAccounts(req, res);
});

export default router;