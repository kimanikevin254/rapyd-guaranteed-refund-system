import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";

// Initialize the DB as null
// Connect it to the actual DB instance later
let db = null

export async function GET(req, res){
    // check if DB is initialized
    // connect if it is not
    if(!db){
        db = await open({
            filename: './db/database.db',
            driver: sqlite3.Database
        })
    }

    // perform db query
    const items = await db.all('SELECT * FROM items')

    // return items as a json response
    return new Response(JSON.stringify(items), {
        headers: { 'Content-Type': 'application/json' },
        status: 200
    })
}