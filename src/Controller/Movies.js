import { DbConfig } from "../Config/db.config";
import { APIError } from "../Middlewares/Error";

export class MovieController {
    //ADD MOVIE
    async addMovie(request, response) {
        const pool = new DbConfig().getPool();

        const { title, genre, ageRestriction, imageUrl, isAvaliable } = request.body;

        if (!title || !genre || !ageRestriction ||!imageUrl || !isAvaliable) {
            return response.status(400).json({ msg: "All fields are required to register a book on the database" })
             // next(new APIError('All fields are required to register a book on the database').badRequest())
        }

        try {
            
            const pgClient = await pool.connect();

            const query = {
                text: "INSERT INTO Movies (title, genre, ageRestriction, imageUrl, isAvaliable) VALUES ($1, $2, $3, $4, $5)",
                values: [title, genre, ageRestriction, imageUrl, isAvaliable],
            };

            await pgClient.query(query);
            pgClient.release();
            return response
            .status(201)
            .json({ msg: "Movie created"})

        } catch (error) {
            return response.status(500).json(error)
        }
    }

    //DELETE MOVIE
    async deleteMovie(request, response) {
        const pool = new DbConfig().getPool();

        const title = request.body;

        if (!title) {
            return response.status(400).json({ msg: "Please input a title" })
        }

        try {
            
            const pgClient = await pool.connect();

            const query = {
                text:"DELETE FROM Movies WHERE title = $1",
                values: [title],
            }

            await pgClient.query(query).rows;
            pgClient.release();
            return response
            .status(201)
            .status({ msg: "Movie deleted" })

        } catch (error) {
            return response.status(500).json(error)
        }
    }

    // GET MOVIE BY ID
    async movieById(request, response) {
        const pool = new DbConfig().getPool();

        const id = request.parms.id;

        if (!id) {
            return response.status(400).json({ msg: "No movie has been selected" })
        }

        try {
            
            const pgClient = await pool.connect();

            let query = {
                text: "SELECT * FROM Movies WHERE id = $1",
                values: [id],
            }

            let movie = await (await pgClient.query(query)).rows;
            pgClient.release();
            return response
            .status(201)
            .json({ movie })

        } catch (error) {
            return response.status(500).json(error);
        }
    }

    //GET ALL MOVIES
    async allMovies(resquest, repsonse) {
        const pool = new DbConfig().getPool();

        try {
            
            const pgClient = await pool.connect();

            let query = {
                text: "SELECT * FROM Movies",
            }

            let movies = await (await pgClient.query(query)).rows;

            pgClient.release();
            return response
            .status(201)
            .json({ movies })

        } catch (error) {
            return response.status(500).json(error)
        }
    }

    //FILTER BY GENRE
    async filterByGenre(request, response) {
        const pool = new DbConfig().getPool();

        const genre = request.body;

        if (!genre) {
            return response.status(400).json({ msg: "Please select a genre" })
        }
        
        try {

            const pgClient = await pool.connect();

            let query = {
                text: "SELECT * FROM Movies WHERE genre = $1",
                values: [genre],
            }

           let category = await (await pgClient.query(query)).rows;
           
           pgClient.release();
           return response
           .status(201)
           .json({ category });
            
        } catch (error) {
            return response.status(500).json(error)
        }
    }

    //FILTER BY UNRETURNED
    async filterByUnReturned(request, response) {
        const pool = new DbConfig().getPool();

        const isAvailable = false;
        
        try {

            const pgClient = await pool.connect();

            let query = {
                text: "SELECT * FROM Movies WHERE isAvaliable = $1",
                values: [isAvailable],
            }

           let notReturned = await (await pgClient.query(query)).rows;
           
           pgClient.release();
           return response
           .status(201)
           .json({ notReturned });
            
        } catch (error) {
            return response.status(500).json(error)
        }
    }

    async rentMovie(request, response) {
        const pool = new DbConfig().getPool();

        const id = request.params.id;

        if (!id) {
            return res.status(400).json({ msg: "You have not selected a movie" })
        }

        try {
            
            const pgClient = await pool.connect();

            const query = {
                text: "SELECT * FROM Movies WHERE id = $1",
                values: [id],
            }

            const movie = await (await pgClient.query(query)).rows[0];
            pgClient.release();
            return res.status(201).json({ movie })

        } catch (error) {
            return res.status(500).json(error)
        }
    }

}