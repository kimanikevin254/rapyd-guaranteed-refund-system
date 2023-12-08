import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";
import bcrypt from "bcrypt"
import { makeRequest } from "@/utils/makeRequest";

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
            password TEXT,
            rapyd_cust_id TEXT UNIQUE
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

    // Create a customer in Rapyd
try {
    const body = {
        name: data.fullname,
        email: data.email,
        payment_method: {
            type: "us_debit_visa_card",
            fields: {
                number: data.card_number,
                expiration_month: data.expiration_month,
                expiration_year: data.expiration_year,
                name: data.fullname,
                cvv: data.cvv,
            },
        },
        addresses: [
            {
                name: data.fullname,
                line_1: data.address_line,
                country: data.country,
                zip: data.zip_code,
            },
        ],
    };
    const result = await makeRequest("POST", "/v1/customers", body);
 
    // Create the user
    await db.run(
        `INSERT INTO users (name, email, password, rapyd_cust_id) VALUES (?, ?, ?, ?)`,
        [
            data.fullname,
            data.email,
            await hashPassword(data.password), // Await the result of the asynchronous hashPassword function
            result.body.data.id,
        ]
    );
 
    // Fetch the created user
    const user = await db.get(
        `SELECT id, name, email, rapyd_cust_id FROM users WHERE email = ?`,
        [data.email]
    );
 
    // Return the user data as a json response
    return new Response(
        JSON.stringify({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                rapyd_cust_id: user.rapyd_cust_id,
                card_auth_link:
                    result.body.data.payment_methods.data[0].redirect_url,
            },
        }),
        {
            headers: { "Content-Type": "application/json" },
            status: 200,
        }
    );
 } catch (error) {
    console.error("Error completing request", error);
 
    // Return an error
    return new Response(
        JSON.stringify({
            error: "Unable to create the customer on Rapyd.",
        }),
        {
            headers: { "Content-Type": "application/json" },
            status: 400,
        }
    );
 } 
}