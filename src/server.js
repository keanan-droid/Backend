import express from 'express';
import MovieRoutes from "./Routes/Movies";
import AccoutRoutes from "./Routes/Accounts"
import { ApiErrorWrapper } from "./Middlewares/Wrapper"
require('dotenv').config({path:'./src/.env'})

const cors = require('cors');
const server = express();

server.use(MovieRoutes);
server.use(AccoutRoutes);
server.use(ApiErrorWrapper);
server.use(cors());

const port = process.env.PORT;

server.listen(port, () => {
    console.log(`Server started on PORT ${port}`);
});