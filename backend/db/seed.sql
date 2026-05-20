-- Données de test
USE plateforme_projets;

INSERT INTO users (nom, prenom, email, password_hash, role) VALUES
('Dupont', 'Jean', 'jean.dupont@isen.fr', '$2b$10$placeholder_hash', 'supervisor'),
('Martin', 'Alice', 'alice.martin@isen.fr', '$2b$10$placeholder_hash', 'student'),
('Leclerc', 'Tom', 'tom.leclerc@isen.fr', '$2b$10$placeholder_hash', 'student'),
('Bernard', 'Sara', 'sara.bernard@isen.fr', '$2b$10$placeholder_hash', 'student');

INSERT INTO projects (titre, description, supervisor_id, date_debut, date_fin) VALUES
('Plateforme Projets ISEN', 'Application de gestion et suivi des projets étudiants', 1, '2026-05-18', '2026-06-24');

INSERT INTO team_members (project_id, user_id, role_in_project) VALUES
(1, 2, 'lead'),
(1, 3, 'member'),
(1, 4, 'member');

INSERT INTO tasks (project_id, assigned_to, titre, statut, priorite, deadline) VALUES
(1, 2, 'Schéma BDD', 'done', 'haute', '2026-05-22'),
(1, 3, 'Init backend Node.js', 'en_cours', 'haute', '2026-05-25'),
(1, 4, 'Init frontend React', 'en_cours', 'haute', '2026-05-25'),
(1, 2, 'Authentification JWT', 'todo', 'haute', '2026-06-01');
