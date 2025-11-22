const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { redirectIfAuth } = require('../middleware/auth');

// GET /register - Show registration form
router.get('/register', redirectIfAuth, (req, res) => {
    res.render('auth/register', {
        user: null,
        error: null
    });
});

// POST /register - Handle registration
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, confirmPassword, role } = req.body;

        // Validation
        if (!name || !email || !password || !role) {
            return res.render('auth/register', {
                user: null,
                error: 'All fields are required'
            });
        }

        if (password !== confirmPassword) {
            return res.render('auth/register', {
                user: null,
                error: 'Passwords do not match'
            });
        }

        if (password.length < 6) {
            return res.render('auth/register', {
                user: null,
                error: 'Password must be at least 6 characters long'
            });
        }

        if (!['farmer', 'buyer'].includes(role)) {
            return res.render('auth/register', {
                user: null,
                error: 'Invalid role selected'
            });
        }

        // Check if user already exists
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.render('auth/register', {
                user: null,
                error: 'Email already registered'
            });
        }

        // Create user
        const user = await User.create({ name, email, password, role });

        // Set session
        req.session.userId = user._id.toString();
        req.session.userRole = user.role;
        req.session.userName = user.name;

        // Redirect based on role
        if (role === 'farmer') {
            res.redirect('/dashboard');
        } else {
            res.redirect('/marketplace');
        }

    } catch (error) {
        console.error('Registration error:', error);
        res.render('auth/register', {
            user: null,
            error: 'Registration failed. Please try again.'
        });
    }
});

// GET /login - Show login form
router.get('/login', redirectIfAuth, (req, res) => {
    res.render('auth/login', {
        user: null,
        error: null
    });
});

// POST /login - Handle login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.render('auth/login', {
                user: null,
                error: 'Email and password are required'
            });
        }

        // Find user
        const user = await User.findByEmail(email);
        if (!user) {
            return res.render('auth/login', {
                user: null,
                error: 'Invalid email or password'
            });
        }

        // Verify password
        const isValidPassword = await User.comparePassword(password, user.password);
        if (!isValidPassword) {
            return res.render('auth/login', {
                user: null,
                error: 'Invalid email or password'
            });
        }

        // Set session
        req.session.userId = user._id.toString();
        req.session.userRole = user.role;
        req.session.userName = user.name;

        // Redirect based on role
        if (user.role === 'farmer') {
            res.redirect('/dashboard');
        } else {
            res.redirect('/marketplace');
        }

    } catch (error) {
        console.error('Login error:', error);
        res.render('auth/login', {
            user: null,
            error: 'Login failed. Please try again.'
        });
    }
});

// POST /logout - Handle logout
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout error:', err);
        }
        res.redirect('/');
    });
});

module.exports = router;
