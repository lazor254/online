require('dotenv/config');
const cors = require('cors');
const mysql = require('mysql2/promise'); // use promise-based version
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const Proof ={
    pending: 'pending', 
    verified: 'verified', 
    declined:'declined'
}

const port = 7000;

const app = express();
app.use(cors());
app.use('/uploads', express.static('uploads'));
app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ limit: '30mb', extended: true }));

// Database connection and creation
async function initializeDatabase() {
    try {
        const db = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD
        });
        console.log("Database connected successfully");

        // Create the database if it doesn't exist
        await db.query(`CREATE DATABASE IF NOT EXISTS online`);
        console.log("Database created successfully");

        // Select the database
        await db.changeUser({ database: 'online' });
        console.log("Switched to 'online' database");

        // Create tables
        const createUsersTable = `
            CREATE TABLE IF NOT EXISTS users(
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(100) NOT NULL UNIQUE,
                username VARCHAR(50) NOT NULL,
                password VARCHAR(255) NOT NULL,
                usertype VARCHAR(255) NOT NULL
            );
        `;
        await db.query(createUsersTable);
        console.log("Users table created or already exists");

        const createVideoTasks = `
            CREATE TABLE IF NOT EXISTS videos(
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                url VARCHAR(255) NOT NULL,
                instructions TEXT,
                positions INT NOT NULL ,
                position_filled INT NOT NULL DEFAULT 0,
                remaining_positions INT NOT NULL DEFAULT 0,
                budget INT NOT NULL,
                buyerId INT,
                FOREIGN KEY (buyerId) REFERENCES users(id),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;
        await db.query(createVideoTasks);
        console.log("Videos table created or already exists");
  

        const createWallet = `
           CREATE TABLE IF NOT EXISTS wallet (
                id INT PRIMARY KEY AUTO_INCREMENT,
                user_id INT,
                earnings DECIMAL(10, 2) DEFAULT 0,
                pending DECIMAL(10, 2) DEFAULT 0
            );

        
        `;
        await db.query(createWallet);
        console.log("wallet table created successfully");


                const createProofs = `
            CREATE TABLE IF NOT EXISTS proofs(
                id INT PRIMARY KEY AUTO_INCREMENT,
                video_id INT NOT NULL,
                user_id INT NOT NULL,
                amount DECIMAL(10, 2),
                video_link VARCHAR(255),
                screenshot_path VARCHAR(255),
                status ENUM('pending', 'verified', 'declined') DEFAULT 'pending',
                verified BOOLEAN DEFAULT FALSE,
                FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE,
                FOREIGN KEY (user_id) REFERENCES users(id)
            );
        `;
        await db.query(createProofs);
        console.log("Proofs table created successfully");


 
            const createVideo_status =`
        CREATE TABLE IF NOT EXISTS Videostatus (
            id INT PRIMARY KEY AUTO_INCREMENT,
            user_id INT,
            video_id INT,
            status ENUM('pending', 'done') DEFAULT 'pending',
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (video_id) REFERENCES videos(id)
        );
        
        `;
        await db.query(createVideo_status);
        console.log("createVideo_status table created successfully");




        return db;
    } catch (error) {
        console.error("Database initialization error:", error);
        process.exit(1); // Exit if database setup fails
    }
}

initializeDatabase().then((db) => {
    // Assign the `db` connection object to `app.locals` for global access
    app.locals.db = db;

    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
});

// Middleware for authentication
const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        console.log('Token missing');
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded Token:', decoded);
        req.userId = decoded.id;
        next();
    } catch (error) {
        console.error('Token verification failed:', error.message);
        return res.status(401).json({ message: 'Invalid Token' });
    }
};

// User registration route
app.post('/api/register', async (req, res) => {
    try {
        const { email, username, password, userType } = req.body;
        if (!email || !username || !password || !userType) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const db = req.app.locals.db;
        const [existingUser] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

        if (existingUser.length) {
            return res.status(409).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query('INSERT INTO users (email, username, password, usertype) VALUES (?, ?, ?, ?)', [email, username, hashedPassword, userType]);
        return res.status(200).json({ message: 'User created successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    const db = req.app.locals.db; 

    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
        return res.status(200).json({ message: 'Already logged in, redirecting to home' });
    }

    try {
        const [result] = await db.query('SELECT * FROM users WHERE username = ?', [username]);

        if (result.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = result[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ message: 'Invalid details' });
        }

        const token = jwt.sign(
            { username: user.username, id: user.id },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        return res.status(200).json({
            message: 'Access granted',
            token: token,
            user: { id: user.id, username: user.username, email: user.email, usertype: user.usertype }
        });
    } catch (err) {
        console.error('Database query error:', err);
        res.status(500).json({ message: 'Database query error' });
    }
});

app.post('/api/videos', authenticate, async (req, res) => {
    const db = req.app.locals.db; 
    const { title, url, instructions, positions, budget } = req.body;
    const buyerId = req.userId;
    const query = 'INSERT INTO videos (title, url, instructions, positions, budget, buyerId) VALUES (?, ?, ?, ?, ?, ?)';

    try {
        // Use promise-based query
        const [result] = await db.query(query, [title, url, instructions, positions, budget, buyerId]);
        
        // If insertion is successful, send a response
        res.status(201).json({ message: 'Task posted successfully', result: result });
    } catch (err) {
        // Handle any errors
        console.error(err);
        res.status(500).json({ message: 'Error saving task', error: err.message });
    }
});


app.get('/api/videos/all', authenticate, (req, res) => {
    const db = req.app.locals.db;
    const query = 'SELECT * FROM videos';

    db.query(query)
        .then(([videos]) => {
            res.json(videos);  // Send videos as JSON response
        })
        .catch((error) => {
            console.error('Error fetching all videos:', error);
            res.status(500).json({ message: 'Server error' });
        });
});


    app.get('/api/videos/view', authenticate, (req, res) => {
        const db = req.app.locals.db;
        const buyerId = req.userId; // Get buyerId from decoded token
    
      
        const query = 'SELECT id, title, positions, position_filled, remaining_positions FROM videos WHERE buyerId = ?';
    
        db.query(query, [buyerId])
            .then(([videos]) => {
                if (videos.length === 0) {
                    return res.status(404).json({ message: 'No videos found for this buyer' });
                }

                res.json(videos); 
            })
            .catch((error) => {
                console.error('Error fetching videos:', error);
                res.status(500).json({ message: 'Server error' });
            });
    });
    


app.get('/api/videos/update', authenticate, async (req, res) => {
    const db = req.app.locals.db;
    const buyerId = req.userId;

    try {
        const [videoResults] = await db.query('SELECT * FROM videos WHERE buyerId = ?', [buyerId]);

        if (!videoResults || videoResults.length === 0) {
            return res.status(404).json({ message: 'No videos found' });
        }

        res.status(200).json(videoResults);  // Return all videos for the buyer
    } catch (error) {
        console.error('Error fetching videos:', error);
        res.status(500).json({ message: 'Error fetching videos' });
    }
});




    app.delete('/api/videos/:id', authenticate, async (req, res) => {
        const db = req.app.locals.db;
        const videoId = req.params.id;
        const buyerId = req.userId;
    
        const deleteProofsQuery = 'DELETE FROM proofs WHERE video_id = ?';
        const deleteVideoQuery = 'DELETE FROM videos WHERE id = ? AND buyerId = ?';
    
        try {
            await db.beginTransaction();
    
            // Delete from `proofs` first
            await db.query(deleteProofsQuery, [videoId]);
    
            // Delete from `videos`
            const [result] = await db.query(deleteVideoQuery, [videoId, buyerId]);
    
            await db.commit();
    
            if (result.affectedRows === 0) {
                res.status(404).json({ message: 'Video not found or not authorized to delete' });
            } else {
                res.status(200).json({ message: 'Video deleted successfully' });
            }
        } catch (error) {
            await db.rollback();
            console.error('Error deleting video:', error);
            res.status(500).json({ message: 'Error deleting video' });
        }
    });

  


//proof
app.post('/api/proofs', authenticate, upload.single('screenshot'), async (req, res) => {
    console.log("Request Headers:", req.headers); 
    const db = req.app.locals.db;
    const { videoLink, videoId } = req.body;
    const screenshotPath = req.file.filename ? req.file.path : null;

    const taskerId = req.userId;

    try {
        const [result] = await db.query(
            'INSERT INTO proofs (video_id, amount, video_link, screenshot_path, user_id, verified) VALUES (?, ?, ?, ?, ?, ?)',
            [videoId, videoLink, screenshotPath, taskerId, false]
        );
        const [videoStats] = await db.query(
            `SELECT COUNT(*) AS positionsFilled, 
                    (SELECT positions FROM videos WHERE id = ?) - COUNT(*) AS remainingPositions
             FROM proofs WHERE video_id = ?`,
            [videoId, videoId]
        );

        
        res.status(201).json({ 
            message: 'Proof submitted successfully', 
            proofId: result.insertId, 
            positionsFilled: videoStats[0].positionsFilled, 
            remainingPositions: videoStats[0].remainingPositions 
        });
    }
    catch (error) {
        console.error('Error saving proof:', error);
        res.status(500).json({ message: 'Failed to submit proof'});

    }
    });

// Fetch proofs from the database
app.get('/api/verify', async (req, res) => {
    try {
        const [proofs] = await req.app.locals.db.query(`
            SELECT id, video_id, video_link, screenshot_path, user_id, verified 
            FROM proofs 
            WHERE verified = false
        `);

        res.status(200).json(proofs);
    } catch (error) {
        console.error('Error fetching proofs:', error);
        res.status(500).json({ message: 'Failed to fetch proofs' });
    }
});


app.get('/api/videos/:id', authenticate, async (req, res) => {
     const db = req.app.locals.db;
         const videoId = req.params.id;
        const buyerId = req.userId;
    
         try {
            const [videoData] = await db.query(
              'SELECT id, position_filled, remaining_positions FROM videos WHERE id = ? AND buyerId = ?',
              [videoId, buyerId]
            );
    
             if (!videoData || videoData.length === 0) {
            return res.status(404).json({ message: 'Video not found' });
            }
    
              res.status(200).json(videoData[0]);
        } catch (error) {
          console.error('Error fetching video data:', error);
         res.status(500).json({ message: 'Error fetching video data' });
     }
    });
    


        // wallet to add proof
        app.post('/api/award/:proofId', async (req, res) => {
            const db = req.app.locals.db;
            const { videoId, userId, awardAmount, status } = req.body;
            const {proofId} = req.params

            try {

                await db.query(
                    'UPDATE videos SET position_filled = position_filled +?, remaining_positions = remaining_positions -? WHERE id = ?',
                    [1, 1, videoId]
                );
                
                await db.query(
                    'UPDATE proofs SET verified = true WHERE id = ?',
                    [proofId, status]
                );
                if(status !==Proof.verified){
                    // Add amount to user wallet's pending section
                    await req.db.query(
                        'UPDATE wallet SET amount =? status = ? WHERE user_id = ?',
                        [awardAmount, status, userId]
                    );
                return  res.status(200).json({ message: 'User awarded successfully' });

                }
                return res.status(200).json({ message: `Task has been marked as ${status}` });

            } catch (error) {
                console.error('Error awarding user:', error);
                res.status(500).json({ message: 'Failed to award user' });
            }
        });








