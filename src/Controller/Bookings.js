import { DbConfig } from "../Config/db.config";
const moment = require('moment')
export class BookingController {
    //RENT MOVIE
    async rentMovie(request, response) {
        const pool = new DbConfig().getPool();

        const { booker, movie, isExpired } = request.body;
        
        const checkedOut = moment();

        if (!booker || !movie || !isExpired || !checkedOut) {
            return response.status(400).json({ msg: "You have not filled in all fields" })
        }

        try {
            
            const pgClient = await pool.connect();

            const query = {
                text: "INSERT INTO BOOKINGS (booker, movie, checkedOut, isExpired) VALUES ($1, $2, $3, $4)",
                values: [booker, movie, checkedOut, isExpired],
            }

            await (await pgClient.query(query)).rows[0];

            pgClient.release();
            return response.status(201).json({ msg: "Movie is rented" })

        } catch (error) {
            return response.status(500).json(error)
        }
    }

    async returnMovie(request, response) {
        //RETURN MOVIE
        const pool = new DbConfig().getPool();

        const id = request.params.id;

        if (!id) {
            return response.status(400).json({ msg: "No movie has been selected" })
        }

        try {
            
            const pgClient = await pool.connect();

            const query = {
                text: "DELETE * FROM BOOKINGS WHERE id = $1",
                values: [id],
            }

            await pgClient.query(query).rows[0];

            pgClient.release();
            return response.status(201).json({ msg:"Movie has been returned" })

        } catch (error) {
            return response.status(500).json(error)
        }
    }

    async getBookings(request, response) {
        const pool = new DbConfig().getPool();

        try {
            
            const pgClient = await pool.connect();

            let query = {
                text: "SELECT * FROM BOOKINGS",
            }

            let booking = await pgClient.query(query);

            let bookings = booking.rows;
            console.log(bookings);

            pgClient.release();
            return response.status(201).json({ bookings })

        } catch (error) {
            return response.status(500).json(error)
        }
    }
    
}

// id BIGSERIAL PRIMARY KEY,
// booker INTEGER REFERENCES Account(id) NOT NULL,
// movie INTEGER REFERENCES Movies(id) NOT NULL,
// checkedOut DATE NOT NULL,
// isExpired boolean NOT NULL