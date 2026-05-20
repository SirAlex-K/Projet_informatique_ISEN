const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes (à connecter au fur et à mesure)
// app.use('/api/auth', require('./src/routes/auth.routes'));
// app.use('/api/projects', require('./src/routes/projects.routes'));
// app.use('/api/tasks', require('./src/routes/tasks.routes'));
// app.use('/api/teams', require('./src/routes/teams.routes'));
// app.use('/api/deliverables', require('./src/routes/deliverables.routes'));
// app.use('/api/dashboard', require('./src/routes/dashboard.routes'));

app.get('/', (req, res) => {
  res.json({ message: 'API Plateforme Projets ISEN — opérationnelle' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
