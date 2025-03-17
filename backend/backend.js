// Import required modules
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { exec } = require('child_process');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 3000;
const SECRET_KEY = 'your_secret_key';
const db = new sqlite3.Database('./database.sqlite');

app.use(express.json());
app.use(cors());

// Initialize database
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        action TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
});

// Register a new user
app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        // ✅ Check if username and password are provided
        if (!username || !password) {
            return res.status(400).json({ error: "Username and password are required" });
        }

        // ✅ Hash the password correctly
        const hashedPassword = await bcrypt.hash(password, 10);

        // ✅ Insert into the database
        db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], function(err) {
            if (err) return res.status(400).json({ error: 'User already exists' });
            res.json({ message: 'User registered successfully' });
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
// Login endpoint
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token });
    });
});

// Middleware for authentication
const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.status(401).json({ error: 'Invalid token' });
        req.userId = decoded.userId;
        next();
    });
};

// Trigger backup
app.post('/backup', authenticate, (req, res) => {
    exec('powershell.exe -ExecutionPolicy Bypass -File backup.ps1', (error, stdout, stderr) => {
        if (error) return res.status(500).json({ error: stderr });
        db.run('INSERT INTO logs (action) VALUES (?)', ['Backup triggered']);
        res.json({ message: 'Backup started', output: stdout });
    });
});

// List backups
app.get('/backups', authenticate, (req, res) => {
    fs.readdir('./backups', (err, files) => {
        if (err) return res.status(500).json({ error: 'Failed to list backups' });
        res.json({ backups: files });
    });
});

// Get logs
app.get('/logs', authenticate, (req, res) => {
    db.all('SELECT * FROM logs ORDER BY timestamp DESC', [], (err, rows) => {
        if (err) return res.status(500).json({ error: 'Failed to fetch logs' });
        res.json({ logs: rows });
    });
});

// Clear logs
app.delete('/logs', authenticate, (req, res) => {
    db.run('DELETE FROM logs', [], function(err) {
        if (err) return res.status(500).json({ error: 'Failed to clear logs' });
        res.json({ message: 'Logs cleared' });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
