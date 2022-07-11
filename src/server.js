import express from 'express';
const cron = require('node-cron');
import MovieRoutes from "./Routes/Movies";
import AccoutRoutes from "./Routes/Accounts"
import BookingRoutes from "./Routes/Bookings"
import { ApiErrorWrapper } from "./Middlewares/Wrapper"
require('dotenv').config({path:'./src/.env'})

const cors = require('cors');
const server = express();

server.use(MovieRoutes);
server.use(AccoutRoutes);
server.use(BookingRoutes);
server.use(ApiErrorWrapper);
server.use(cors());

const port = process.env.PORT;

server.listen(port, () => {
    console.log(`Server started on PORT ${port}`);
    task.start;
});

import { DbConfig } from "./Config/db.config";
const moment = require('moment')
const task = cron.schedule('*/1 * * * *', () => {
    runTask();
});

const runTask = async () => {

    const pool = new DbConfig().getPool();

    try {
        
        const pgClient = await pool.connect();

        let query = {
            text: "SELECT * FROM BOOKINGS",
        }

        let booking = await pgClient.query(query);

        if(booking.rowCount == 0) {
            pgClient.release();
        }
        let bookings = booking.rows;
        for (let i = 0; i < bookings.length; i++) {
            const element = bookings[i];

            const id = element.id;
            const checkedOut = moment(element.checkedout)
            const futureDate = moment(checkedOut).add(1,'days')
            const currentDate = moment();
            if(currentDate >= futureDate) {
                checkTask(id, element)
            } else {              
                pgClient.release();
            }
        }
    } catch (error) {
        console.log(error);
    }
}

const checkTask = async (id, element) => {

    const pool = new DbConfig().getPool();

    try {
        
        const pgClient = await pool.connect();

        let updateQuery = {
            text: "UPDATE BOOKINGS SET isExpired = 'true' WHERE id = $1",
            values: [id]
        }

        await pgClient.query(updateQuery);

        if(element.isexpired === true) {

            let deleteQuery = {
                text: "DELETE FROM BOOKINGS WHERE id = $1",
                values: [id]
            }
    
            await pgClient.query(deleteQuery);
    
            pgClient.release();
            console.log("booking/bookings returned");
        }

    } catch (error) {
        console.log(error);
    }
}

const mail = () => {
    const nodemailer = require("nodemailer");
    let transporter = nodemailer.createTransport({
        service: 'SendinBlue',
        // host: "smtp-relay.sendinblue.com",
        // port: 587,
        // secure: false, 
        auth: {
            user: 'keananshawnswartz@gmail.com', // generated ethereal user
            pass: 'JQwSEkG5Th0j6NXO', // generated ethereal password
        },
    });

    const url = "http://localhost:3000/home";

    const mailOptions = {
        from: "noreply@keanan.co.za",
        to: "keananshawnswartz@gmail.com",
        // to: `${email}`,
        subject: "Account Terms and Conditions",
        text: "This is a proof of email on terms and conditions",
        html: `
            <h1>Account has been accepted, Please verify</h1>
            <a href=${url}>Verify</a>
        `,
    };

    transporter.sendMail(mailOptions, (error, info)=>{
        if (error) {
            return response.status(500).json(error);
        }
        return res.status(201).json({ msg: "New account created", info });
    })
}