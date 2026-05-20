-- ============================================
-- Schéma BDD — Plateforme Projets ISEN 2026
-- ============================================

CREATE DATABASE IF NOT EXISTS plateforme_projets CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE plateforme_projets;

CREATE TABLE users (
  id            INT           AUTO_INCREMENT PRIMARY KEY,
  nom           VARCHAR(100)  NOT NULL,
  prenom        VARCHAR(100)  NOT NULL,
  email         VARCHAR(150)  NOT NULL UNIQUE,
  password_hash TEXT          NOT NULL,
  role          ENUM('student','supervisor') NOT NULL DEFAULT 'student',
  avatar_url    TEXT          DEFAULT NULL,
  created_at    DATETIME      DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE projects (
  id            INT           AUTO_INCREMENT PRIMARY KEY,
  titre         VARCHAR(200)  NOT NULL,
  description   TEXT          DEFAULT NULL,
  supervisor_id INT           NOT NULL,
  date_debut    DATE          DEFAULT NULL,
  date_fin      DATE          DEFAULT NULL,
  statut        ENUM('actif','en_pause','termine') DEFAULT 'actif',
  created_at    DATETIME      DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (supervisor_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE team_members (
  project_id      INT  NOT NULL,
  user_id         INT  NOT NULL,
  role_in_project ENUM('member','lead') DEFAULT 'member',
  joined_at       DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (project_id, user_id),
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id)    REFERENCES users(id)    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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
  FOREIGN KEY (assigned_to) REFERENCES users(id)    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE deliverables (
  id             INT           AUTO_INCREMENT PRIMARY KEY,
  project_id     INT           NOT NULL,
  uploaded_by    INT           NOT NULL,
  nom_fichier    VARCHAR(255)  NOT NULL,
  chemin_fichier TEXT          NOT NULL,
  uploaded_at    DATETIME      DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id)  REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (uploaded_by) REFERENCES users(id)    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE comments (
  id         INT      AUTO_INCREMENT PRIMARY KEY,
  project_id INT      NOT NULL,
  user_id    INT      NOT NULL,
  task_id    INT      DEFAULT NULL,
  contenu    TEXT     NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id)    REFERENCES users(id)    ON DELETE CASCADE,
  FOREIGN KEY (task_id)    REFERENCES tasks(id)    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
