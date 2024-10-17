require('dotenv/config');
const cors =require ('cors');
const mysql = require('mysql2');
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const port = 7000;

const app = express();
app.use(cors());
app.use(express.json({limit: '30mb'}));
app.use(express.urlencoded({limit: '30mb', extended: true}))


// Database connection

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD

});
db.connect((err) =>{
    if (err) {
        return console.log("Error connecting to database: ", err);
    }
    console.log("database connected successfully");

    db.query(`CREATE DATABASE IF NOT EXISTS online; `, (err) =>{
        if (err) {
            return console.log("Error creating database: ", err);
        }
        console.log("Database created successfully");

        // selecting the database
        db.changeUser({database: 'online'}, (err) =>{
            if (err){ 
                return console.log("Error Changing database: ", err);
            }
            console.log("Changed to oline");
             

            //create users table
            const createUsersTable =   `
            CREATE TABLE IF NOT EXISTS users(
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(100) NOT NULL UNIQUE,
                username VARCHAR(50) NOT NULL,
                password VARCHAR(255) NOT NULL
                );
            `;
            db.query(createUsersTable, (err) => {

                if(err) {
                    return console.log("Error creating users table:", err);

                }
                console.log("Users table already exists");
            });

            //Expenses table

            const createExpensesTable = `
            CREATE TABLE IF NOT EXISTS expense (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT,
            amount DECIMAL(10, 2) NOT NULL, 
            transaction_date DATE NOT NULL, 
            category VARCHAR(50) NOT NULL,
            description TEXT,
            FOREIGN KEY (user_id) REFERENCES users(id)
            );

            `;
            db.query(createExpensesTable, (err) => {
                if(err) {
                    return console.log("Error creating Expenses Table: ", err);

                }
                console.log("Expenses table already exists");

            });

       });
    });
});

// Middleware for authentication

const authenticate = (req, res, next) =>{
     const token = req.headers.authorization?.split(' ')
     [1]; 
     if(!token) {
        return res.status(401).json({message: 'Unauthorized'});
     }
     try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded);
        req.userId = decoded.id;
        next();
     } catch (error) {
        return res.status(401).json({message: 'Invalid Token'});
        
     }
};

// User registration route
app.post('/api/register', async (req, res) => {
    try {
        const {email, username, password} = req.body;
        // Check if any input is empty
        if (!email || !username || !password) return res.status(400).json({message: 'All fields are required'})
        // Check if user already exists
        const UsersQuery = 'SELECT * FROM users WHERE email = ?';
        db.query(UsersQuery, [email], async (err, data) => {
            if (err) {
                return res.status(500).json({message: 'Error checking user existence'});
            }
            if (data.length) {
                return res.status(409).json({message: 'User already exists'});
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Insert the new user
            const newUserQuery = `INSERT INTO users (email, username, password) VALUES (?, ?, ?)`;
            db.query(newUserQuery, [email, username, hashedPassword], (err) => {
                if (err) {
                    return res.status(500).json({message: 'Error inserting new user'});
                }
                return res.status(200).json({message: 'User created successfully'});
            });

        });
    } catch (err) {
        res.status(500).json({message: 'Internal server error', error: err.message});
    }
});


app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const query = `SELECT * FROM users WHERE username = ?`;
        
        db.query(query, [username], async (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Database query error' });
            }
            if (result.length === 0) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const user = result[0];
            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                return res.status(401).json({ message: 'Invalid details' });
            }

            const token = jwt.sign({ username: user.username, id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

            // Send both token and user data
            return res.status(200).json({
                message: 'Access granted',
                token: token,
                user: { id: user.id, username: user.username, email: user.email } // Include user data
            });
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
