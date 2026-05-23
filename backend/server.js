const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Servir les fichiers uploadés statiquement
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth',       require('./src/routes/auth.routes'));
app.use('/api/projects',   require('./src/routes/projects.routes'));
app.use('/api/projects',   require('./src/routes/teams.routes'));
app.use('/api/projects',   require('./src/routes/deliverables.routes'));
app.use('/api',            require('./src/routes/kanban.routes'));
app.use('/api',            require('./src/routes/messages.routes'));
app.use('/api/dashboard',  require('./src/routes/dashboard.routes'));

// Route de test
app.get('/', (req, res) => {
  res.json({ message: 'API Plateforme Projets ISEN — opérationnelle ✅' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
});
