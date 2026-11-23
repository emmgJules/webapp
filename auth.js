const crypto = require('crypto');

// Demo user store. Passwords are stored as salted scrypt hashes, never plain text.
// The demo password comes from an environment variable so it is not hardcoded.
const DEMO_USER = process.env.DEMO_USER || 'student';
const DEMO_PASSWORD = process.env.DEMO_PASSWORD || 'change-me';

const salt = crypto.randomBytes(16);
const users = {
  [DEMO_USER]: crypto.scryptSync(DEMO_PASSWORD, salt, 64),
};

function authenticate(username, password) {
  const stored = users[username];
  if (!stored || typeof password !== 'string') return false;
  const candidate = crypto.scryptSync(password, salt, 64);
  return crypto.timingSafeEqual(stored, candidate);
}

module.exports = { authenticate };
