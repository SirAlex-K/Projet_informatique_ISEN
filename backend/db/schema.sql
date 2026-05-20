-- ============================================
-- Schéma BDD — Plateforme Projets ISEN 2026
-- ============================================

CREATE DATABASE IF NOT EXISTS plateforme_projets CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE plateforme_projets;

-- ============================================
-- TABLE : users
-- Pourquoi : c'est la table centrale de toute l'application.
-- On y stocke à la fois les étudiants et les encadrants, différenciés
-- par le champ "role". Ça évite d'avoir deux tables séparées et permet
-- de gérer les droits d'accès avec un seul système d'authentification JWT.
-- ============================================
CREATE TABLE users (
  id            INT           AUTO_INCREMENT PRIMARY KEY,
  nom           VARCHAR(100)  NOT NULL,
  prenom        VARCHAR(100)  NOT NULL,
  email         VARCHAR(150)  NOT NULL UNIQUE,   -- email = identifiant de connexion, forcément unique
  password_hash TEXT          NOT NULL,           -- on ne stocke jamais le mot de passe en clair
  role          ENUM('student','supervisor') NOT NULL DEFAULT 'student',
  avatar_url    TEXT          DEFAULT NULL,       -- optionnel, pour personnaliser le profil
  created_at    DATETIME      DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ============================================
-- TABLE : projects
-- Pourquoi : chaque projet a ses propres infos (titre, dates, statut).
-- On lie chaque projet à un encadrant via supervisor_id.
-- Relation : 1 encadrant peut superviser plusieurs projets,
-- mais chaque projet n'a qu'un seul encadrant responsable.
-- ============================================
CREATE TABLE projects (
  id            INT           AUTO_INCREMENT PRIMARY KEY,
  titre         VARCHAR(200)  NOT NULL,
  description   TEXT          DEFAULT NULL,
  supervisor_id INT           NOT NULL,           -- FK vers users (rôle supervisor)
  date_debut    DATE          DEFAULT NULL,
  date_fin      DATE          DEFAULT NULL,
  statut        ENUM('actif','en_pause','termine') DEFAULT 'actif',
  created_at    DATETIME      DEFAULT CURRENT_TIMESTAMP,
  -- Si l'encadrant est supprimé, ses projets le sont aussi (CASCADE)
  FOREIGN KEY (supervisor_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ============================================
-- TABLE : team_members
-- Pourquoi : un étudiant peut être dans plusieurs projets, et un projet
-- a plusieurs étudiants. C'est une relation N:N qu'on ne peut pas gérer
-- avec juste une FK dans l'une ou l'autre table.
-- Cette table "pivot" résout ça : chaque ligne = 1 étudiant dans 1 projet.
-- On y ajoute aussi le rôle dans l'équipe (member ou lead).
-- ============================================
CREATE TABLE team_members (
  project_id      INT  NOT NULL,
  user_id         INT  NOT NULL,
  role_in_project ENUM('member','lead') DEFAULT 'member',
  joined_at       DATETIME DEFAULT CURRENT_TIMESTAMP,
  -- Clé primaire composite : un même user ne peut pas être deux fois dans le même projet
  PRIMARY KEY (project_id, user_id),
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id)    REFERENCES users(id)    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ============================================
-- TABLE : tasks
-- Pourquoi : les tâches sont le cœur du suivi de projet.
-- Chaque tâche appartient à un projet et peut être assignée à un étudiant.
-- On suit leur statut (todo/en_cours/done) et leur priorité pour que
-- l'encadrant puisse voir en un coup d'œil où en est chaque équipe.
-- assigned_to est NULL si la tâche n'est pas encore assignée à quelqu'un.
-- Si un user est supprimé, la tâche reste mais devient non-assignée (SET NULL).
-- ============================================
CREATE TABLE tasks (
  id          INT           AUTO_INCREMENT PRIMARY KEY,
  project_id  INT           NOT NULL,
  assigned_to INT           DEFAULT NULL,
  titre       VARCHAR(200)  NOT NULL,
  description TEXT          DEFAULT NULL,
  statut      ENUM('todo','en_cours','done') DEFAULT 'todo',
  priorite    ENUM('basse','normale','haute') DEFAULT 'normale',
  deadline    DATE          DEFAULT NULL,
  updated_at  DATETIME      DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id)  REFERENCES projects(id) ON DELETE CASCADE,
  -- SET NULL et non CASCADE : si un étudiant quitte, la tâche reste, juste non assignée
  FOREIGN KEY (assigned_to) REFERENCES users(id)    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ============================================
-- TABLE : deliverables
-- Pourquoi : les étudiants doivent pouvoir déposer des fichiers (rapports,
-- présentations, code zippé...) directement sur la plateforme.
-- On stocke le chemin du fichier sur le serveur (via Multer), pas le fichier
-- en base — la BDD garde juste les métadonnées (qui a uploadé quoi et quand).
-- ============================================
CREATE TABLE deliverables (
  id             INT           AUTO_INCREMENT PRIMARY KEY,
  project_id     INT           NOT NULL,
  uploaded_by    INT           NOT NULL,          -- quel étudiant a déposé le fichier
  nom_fichier    VARCHAR(255)  NOT NULL,
  chemin_fichier TEXT          NOT NULL,           -- chemin sur le serveur (ex: /uploads/rapport.pdf)
  uploaded_at    DATETIME      DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id)  REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (uploaded_by) REFERENCES users(id)    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ============================================
-- TABLE : comments
-- Pourquoi : permettre à l'encadrant et aux étudiants de communiquer
-- directement sur la plateforme, soit au niveau du projet en général,
-- soit sur une tâche précise (task_id NULL = commentaire général sur le projet).
-- Ça évite d'avoir à passer par Discord ou mail pour des retours sur le travail.
-- ============================================
CREATE TABLE comments (
  id         INT      AUTO_INCREMENT PRIMARY KEY,
  project_id INT      NOT NULL,
  user_id    INT      NOT NULL,                   -- qui a écrit le commentaire
  task_id    INT      DEFAULT NULL,               -- NULL = commentaire sur le projet, sinon sur une tâche
  contenu    TEXT     NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id)    REFERENCES users(id)    ON DELETE CASCADE,
  -- SET NULL : si la tâche est supprimée, le commentaire reste visible au niveau projet
  FOREIGN KEY (task_id)    REFERENCES tasks(id)    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
