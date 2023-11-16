import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";
import bcrypt from "bcrypt"

// Initialize the DB as null
// Connect it to the actual DB instance later
let db = null

export async function POST(req, res){
    const data = await req.json()
    console.log(data)
    // check if DB is initialized
    // connect if it is not
    if(!db){
        db = await open({
            filename: './db/database.db',
            driver: sqlite3.Database
        })
    }

    // function to hash the password
    const hashPassword = async (pwd) => await bcrypt.hash(pwd, 10)

    // create the users table
    await db.run(
        `CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY,
            name TEXT,
            email TEXT UNIQUE,
            password TEXT
        )`
    );

    // Check if the user with the given email already exists
    const existingUser = await db.get(
        `SELECT id, name, email FROM users WHERE email = ?`,
        [data.email]
    );
    
    // return a message if user already exists
    if(existingUser){
        return new Response(
            JSON.stringify({
              error: "User with this email already exists.",
            }),
            {
              headers: { 'Content-Type': 'application/json' },
              status: 400,
            }
        )
    }

    // create the user   
    await db.run(
        `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`,
        [
        data.fullname,
        data.email,
        await hashPassword(data.password), // You need to await the result of the asynchronous hashPassword function
        ]
    );

    // Fetch the created user
    const user = await db.get(
        `SELECT id, name, email FROM users WHERE email = ?`,
        [data.email]
    );

    // Creating a Rapyd customer functionality will go here

    // return the user data as a json response
    return new Response(JSON.stringify({
        user: {
            id: user.id,
            name: user.name,
            email: user.email
        }
    }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200
    })
}