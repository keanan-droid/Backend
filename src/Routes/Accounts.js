import { Router, json } from "express";
import { AuthController } from "../Controller/Accounts";

const router = Router();
const Controller = new AuthController();

                    //USER

router.post("/api/accounts/signup/user", json(), (req, res, next) => {
    Controller.signup(req, res, next);
});

router.post("/api/accounts/signin/user", json(), (req, res) => {
    Controller.signin(req, res);
});

                    //ADMIN

router.get("/api/accounts/getall", json(), (req, res) => {
    Controller.getAccounts(req, res);
});

router.post("/api/accounts/signin/admin", json(), (req, res) => {
    Controller.signinAdmin(req, res);
});

router.put("/api/accounts/update/:id", json(), (req, res) => {
    Controller.updateAccount(req, res);
});

router.delete("/api/accounts/delete/:id", json(), (req, res) => {
    Controller.deleteAccount(req, res);
});

export default router;