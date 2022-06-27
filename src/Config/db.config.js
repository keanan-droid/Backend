import { Pool } from "pg";
import { config } from "dotenv";
config();

export class DbConfig {
    constructor() {
        this.pool = new Pool({
            connectionString: "postgres://dmsgagsz:rP-gredFzGiDI8n_fuf4nYNTcgEFoD57@tiny.db.elephantsql.com/dmsgagsz",
        });
    }

    getPool() {
        return this.pool;
    }
}