const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Auth
app.use('/api/auth',          require('./src/routes/auth.routes'));

// Projets, équipes, livrables
app.use('/api/projects',      require('./src/routes/projects.routes'));
app.use('/api/projects',      require('./src/routes/teams.routes'));
app.use('/api/projects',      require('./src/routes/deliverables.routes'));

// Tâches (Kanban)
app.use('/api',               require('./src/routes/tasks.routes'));

// Commentaires
app.use('/api',               require('./src/routes/comments.routes'));

// Jalons
app.use('/api',               require('./src/routes/milestones.routes'));

// Messages
app.use('/api',               require('./src/routes/messages.routes'));

// Notifications
app.use('/api/notifications', require('./src/routes/notifications.routes'));

// Validation livrables
app.use('/api',               require('./src/routes/deliverable_reviews.routes'));

// Évaluations soutenance
app.use('/api',               require('./src/routes/evaluations.routes'));

// Dashboard
app.use('/api/dashboard',     require('./src/routes/dashboard.routes'));

app.get('/', (req, res) => {
  res.json({ message: 'API Plateforme Projets ISEN — opérationnelle ✅' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
});
