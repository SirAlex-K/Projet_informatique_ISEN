const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth',          require('./src/routes/auth.routes'));
app.use('/api/admin',         require('./src/routes/admin.routes'));
app.use('/api/projects',      require('./src/routes/projects.routes'));
app.use('/api/tasks',         require('./src/routes/tasks.routes'));
app.use('/api/milestones',    require('./src/routes/milestones.routes'));
app.use('/api/comments',      require('./src/routes/comments.routes'));
app.use('/api/deliverables',  require('./src/routes/deliverable_reviews.routes'));
app.use('/api/evaluations',   require('./src/routes/evaluations.routes'));
app.use('/api/notifications', require('./src/routes/notifications.routes'));
app.use('/api/dashboard',     require('./src/routes/dashboard.routes'));

app.get('/', (req, res) => {
  res.json({ message: 'API Plateforme Projets ISEN — opérationnelle ✅' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
});
