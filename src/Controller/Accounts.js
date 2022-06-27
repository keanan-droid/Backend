import { DbConfig } from "../Config/db.config";
import { sign } from "jsonwebtoken";

export class AuthController {
    //NEW ACCOUNT
    async signup(req, res) {
        const pool = new DbConfig().getPool();

        const {firstname, surname, id_number, age, phonenumber, role} = req.body;

        if (!firstname || !surname || !id_number || !age || !phonenumber || !role) {
            return res.status(400).json({ msg: "All fields are required" });
        }

        try {
            
            const pgClient = await pool.connect();


            const query = {
                text: "INSERT INTO Accounts (firstname, surname, id_number, age, phonenumber, role) VALUES ($1, $2, $3, $4, $5, $6)",
                values: [firstname, surname, id_number, age, phonenumber, role],
            }

            await pgClient.query(query);
            pgClient.release();
            return res.status(201).json({ msg: "New account created" });

        } catch (error) {
            return res.status(500).json(error)
        }
    }

    //SIGN INTO ACCOUNT
    async signin(req, res, next) {
        const pool = new DbConfig().getPool();

        const {id_number, phonenumber} = req.body;

        if (!id_number || !phonenumber) {
            return res.status(400).json({ msg: "Please provide all information" })
        }

        try {
            
            const pgClient = await pool.connect();

            const query = {
                text: "SELECT * FROM Accounts WHERE id_number = $1",
                values: [id_number],
            }

            let account = await (await pgClient.query(query)).rows[0];

            if (!account) {
                return res.status(404).json({  msg: "Account does not exist"})
            }

            if (phonenumber != account.phonenumber) {
                return res.status(404).json({  msg: "Invalid credentials"})
            }

            //TOKEN
            const token_payload = {
                uid: account.id,
                phonenumber: account.phonenumber,
                role:account.role,
            };
            const token = await sign(token_payload, "privateKey", {
                expiresIn: "3d",
            });

            pgClient.release();
            return res.status(201).json({ token })

        } catch (error) {
            return res.status(500).json(error)
        }
    }

    //GET ALL ACCOUNTS
    async getAccounts (req, res) {
        const pool = new DbConfig().getPool();

        try {

            const pgClient = await pool.connect();

            let query = {
                text: "SELECT * FROM Accounts",
            }

            let accounts = (await pgClient.query(query)).rows;

            pgClient.release();
            return res.status(201).json({ accounts })
            
        } catch (error) {
            return res.status(500).json(error)
        }
    }
}




// firstname VARCHAR(89) NOT NULL,
// surname VARCHAR(89) NOT NULL,
// id_number VARCHAR(10) NOT NULL,
// age VARCHAR(100) NOT NULL,
// phonenumber VARCHAR(89) NOT NULL,
// role ROLE NOT NULL,
// bookings BOOKINGS