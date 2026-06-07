import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../db';

const router = Router();
const SALT_ROUNDS = 10; // Runs the hashing algorithm 2^10 = 1024 times

// POST /api/auth/signup
router.post('/signup', async (req: Request, res: Response) => {
  const { username, password } = req.body;

  // Check if the username and password is provided
  if (!username || !password) {
    res.status(400).json({ error: 'Username and password are required' });
    return;
  }

  try {
    // Check if the chosen username is already taken
    const existing = await pool.query(
      'SELECT id FROM users WHERE username = $1',
      [username]
    );

    if (existing.rows.length > 0) {
      res.status(409).json({ error: 'Username already taken' });
      return;
    }

    // Hash the password and insert the new user in the database
    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

    const result = await pool.query(
      'INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id, username',
      [username, password_hash]
    );

    const user = result.rows[0];

    // Create a JWT for the new user
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' }
    );

    res.status(201).json({ token, user: { id: user.id, username: user.username } });
  } catch (err) {
    console.error('[auth] signup error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ error: 'Username and password are required' });
    return;
  }

  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );

    // Check if the username povided exists
    if (result.rows.length === 0) {
      res.status(401).json({ error: 'Invalid username or password' });
      return;
    }

    // check if the password porvided is correct
    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);

    if (!valid) {
      res.status(401).json({ error: 'Invalid username or password' });
      return;
    }

    // Create a JWT for the user
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' }
    );

    res.json({ token, user: { id: user.id, username: user.username } });
  } catch (err) {
    console.error('[auth] login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/auth/google — redirect the browser to Google's consent screen
router.get('/google', (_req: Request, res: Response) => {
  const params = new URLSearchParams({
    client_id:     process.env.GOOGLE_CLIENT_ID!,
    redirect_uri:  process.env.GOOGLE_REDIRECT_URI!,
    response_type: 'code',
    scope:         'openid email profile',
    prompt:        'select_account',
  });
  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
});

// GET /api/auth/google/callback — Google sends the user back here with a code
router.get('/google/callback', async (req: Request, res: Response) => {
  const code = req.query.code as string;
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

  try {
    // 1. Exchange the code for an access token
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method:  'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body:    new URLSearchParams({
        code,
        client_id:     process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri:  process.env.GOOGLE_REDIRECT_URI!,
        grant_type:    'authorization_code',
      }),
    });
    const { access_token } = await tokenRes.json() as { access_token: string };

    // 2. Fetch the user's Google profile
    const profileRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    const profile = await profileRes.json() as { id: string; name: string };

    // 3. Find existing user or create a new one
    let result = await pool.query(
      'SELECT id, username FROM users WHERE google_id = $1',
      [profile.id]
    );

    if (result.rows.length === 0) {
      // Build a username from their Google display name
      const base   = profile.name.replace(/\s+/g, '').toLowerCase().slice(0, 20);
      const suffix = Math.random().toString(36).slice(2, 6);
      result = await pool.query(
        'INSERT INTO users (username, google_id) VALUES ($1, $2) RETURNING id, username',
        [`${base}${suffix}`, profile.id]
      );
    }

    const user = result.rows[0];

    // 4. Issue our own JWT — same shape as regular login
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' }
    );

    // 5. Redirect to the frontend callback page with the token in the URL
    res.redirect(
      `${frontendUrl}/auth/callback?token=${encodeURIComponent(token)}&username=${encodeURIComponent(user.username)}&id=${user.id}`
    );
  } catch (err) {
    console.error('[auth] Google OAuth error:', err);
    res.redirect(`${frontendUrl}/login?error=google_auth_failed`);
  }
});

export default router;
