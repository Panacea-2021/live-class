require('dotenv').config({ path: __dirname + '/.env' });
const express = require('express');
const jwt = require('jsonwebtoken');
const { AccessToken } = require('livekit-server-sdk');

const app = express();
app.use(express.json());
app.use(express.static('public'));

// All users and classes are stored in data.json (edit that file to add your data)
const { users, classes } = require('./data.json');

// Login -> returns our own session token
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ error: 'Invalid login' });
  const token = jwt.sign({ id: user.id, name: user.name, role: user.role }, process.env.APP_SECRET, { expiresIn: '8h' });
  res.json({ token, name: user.name, role: user.role });
});

function auth(req, res, next) {
  try {
    const h = req.headers.authorization || '';
    req.user = jwt.verify(h.replace('Bearer ', ''), process.env.APP_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Not logged in' });
  }
}

// Classes visible to this user
app.get('/api/classes', auth, (req, res) => {
  const list = classes.filter(c => c.teacherId === req.user.id || c.enrolled.includes(req.user.id));
  res.json(list);
});

// Join class: check permission, then issue a short-lived LiveKit token
app.post('/api/classes/:id/join', auth, async (req, res) => {
  const cls = classes.find(c => c.id === req.params.id);
  if (!cls) return res.status(404).json({ error: 'Class not found' });

  const isTeacher = cls.teacherId === req.user.id;
  if (!isTeacher && !cls.enrolled.includes(req.user.id)) {
    return res.status(403).json({ error: 'You are not enrolled in this class' });
  }

  const at = new AccessToken(process.env.LIVEKIT_API_KEY, process.env.LIVEKIT_API_SECRET, {
    identity: String(req.user.id),
    name: req.user.name,
    ttl: '2h',
  });
  at.addGrant({
  room: cls.id,
  roomJoin: true,
  canSubscribe: true,
  canPublish: isTeacher,   // teacher matrame video pampagaladu
  canPublishData: true     // chat andariki
});

app.listen(process.env.PORT || 3001, () => console.log('Running on port', process.env.PORT || 3001));