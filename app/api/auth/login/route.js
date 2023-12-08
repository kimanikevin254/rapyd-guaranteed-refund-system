import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";
import bcrypt from "bcrypt"

// Initialize the DB as null
// Connect it to the actual DB instance later
let db = null

export async function POST(req, res){
    const data = await req.json()

    // check if DB is initialized
    // connect if it is not
    if(!db){
        db = await open({
            filename: './db/database.db',
            driver: sqlite3.Database
        })
    }

    // check if user with the provided email address exists
    const existingUser = await db.get(
        `SELECT * FROM users WHERE email=?`, 
        [data.email]
    )

    // Return an error if user does not exist
    if(!existingUser){
        return new Response(
            JSON.stringify({
              error: "User with this email does not exist.",
            }),
            {
              headers: { 'Content-Type': 'application/json' },
              status: 400,
            }
        )
    }


    // Compare the provided password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(data.password, existingUser.password)

    // Return an error if the password is incorrect
    if (!passwordMatch) {
        return new Response(
        JSON.stringify({
            error: "Incorrect password.",
        }),
        {
            headers: { 'Content-Type': 'application/json' },
            status: 401,
        }
        );
    }

    // return user data as a json response
    return new Response(JSON.stringify({
        user: {
            id: existingUser.id,
            name: existingUser.name,
            email: existingUser.email,
            rapyd_cust_id: existingUser.rapyd_cust_id
        }
    }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200
    })
}