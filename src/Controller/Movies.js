import { response } from "express";
import { DatabaseError } from "pg";
import { DbConfig } from "../Config/db.config";
import { APIError } from "../Middlewares/Error";

export class MovieController {

    //ADD MOVIE
    async addMovie(req, res) {
        const { IncomingForm } = require('formidable');
        const cloudinary = require('cloudinary');

        cloudinary.v2.config({
            cloud_name:'dvmv4ezpg',
            api_key:'246889587876586',
            api_secret:'ynmEFmpxWQmvNZEBzaQufPX6Lkg'
        })

        const form = new IncomingForm();

        form.parse(req, (error, fields,files) => {
            const {movie} = files;
            const { title, genre, ageRestriction } = fields;
            const isAvaliable = "true";
                
            cloudinary.v2.uploader.upload(
                movie.filepath,
                { folder: '/movieThumbnail' },
                (error, info) => {
                    if (error) {
                        return response.status(500).json({msg: 'File upload failed', error});
                    }
                    const imageUrl = info.secure_url

                    console.log(imageUrl);
                    if (!title || !genre || !ageRestriction || !imageUrl || !isAvaliable) {
                        return res.status(400).json({ msg: "All fields are required to register a movie on the database" })
                        // next(new APIError('All fields are required to register a book on the database').badRequest())
                    }

                    const pool = new DbConfig().getPool();

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

            );
    
        })
    }

    //DELETE MOVIE
    async deleteMovie(request, response) {
        const pool = new DbConfig().getPool();

        const id = request.params.id

        if (!id) {
            return response.status(400).json({ msg: "No movie has been selected" })
        }

        try {
            
            const pgClient = await pool.connect();

            const query = {
                text:"DELETE FROM Movies WHERE id = $1",
                values: [id],
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

    // GET MOVIE BY TITLE FOR USER
    async movieByTitle(request, response) {
        const pool = new DbConfig().getPool();

        const title = request.parms.title;

        if (!title) {
            return response.status(400).json({ msg: "No movie has been selected" })
        }

        try {
            
            const pgClient = await pool.connect();

            let query = {
                text: "SELECT * FROM Movies WHERE title = $1",
                values: [title],
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

}