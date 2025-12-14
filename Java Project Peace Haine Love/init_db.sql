-- Création de la base de données
CREATE DATABASE IF NOT EXISTS peace DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE peace;

-- Table utilisateur unique (contient membres et admins)
CREATE TABLE IF NOT EXISTS utilisateur (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    nom VARCHAR(255),
    prenom VARCHAR(255),
    age INT,
    bio TEXT,
    type_utilisateur VARCHAR(50) DEFAULT 'membre'
);

-- Table question
CREATE TABLE IF NOT EXISTS question (
    id INT PRIMARY KEY AUTO_INCREMENT,
    texte TEXT NOT NULL,
    texte_libre BOOLEAN DEFAULT FALSE
);

-- Table reponse
CREATE TABLE IF NOT EXISTS reponse (
    id INT PRIMARY KEY AUTO_INCREMENT,
    texte VARCHAR(255) NOT NULL,
    question_id INT NOT NULL,
    FOREIGN KEY (question_id) REFERENCES question(id) ON DELETE CASCADE
);

-- Table pour lier les réponses d'un membre à un questionnaire (ListeReponse)
CREATE TABLE IF NOT EXISTS membre_reponse (
    membre_id INT NOT NULL,
    reponse_id INT NOT NULL,
    PRIMARY KEY (membre_id, reponse_id),
    FOREIGN KEY (membre_id) REFERENCES utilisateur(id) ON DELETE CASCADE,
    FOREIGN KEY (reponse_id) REFERENCES reponse(id) ON DELETE CASCADE
);

-- Insertion de données de test
INSERT INTO utilisateur (email, password, nom, prenom, age, bio, type_utilisateur) VALUES 
('demo@phl.com', 'demo', 'Dupont', 'John', 25, 'Passionné de haine', 'membre'),
('admin@phl.com', 'admin', 'Admin', 'Admin', NULL, NULL, 'admin');

-- Questions de test
INSERT INTO question (id, texte, texte_libre) VALUES 
(1, 'Détestes-tu les grandes soirées dans lesquelles tu ne connais pas beaucoup de monde ?', FALSE),
(2, 'Quel(s) type(s) de musique détestes-tu ?', FALSE),
(3, 'Quelle période de ta vie as-tu le plus détesté ?', TRUE);

-- Réponses de test
INSERT INTO reponse (id, texte, question_id) VALUES 
(1, 'Oui', 1),
(2, 'Non', 1),
(3, 'Métal', 2),
(4, 'Rap', 2),
(5, 'Jazz', 2),
(6, 'Classique', 2),
(7, '1-10 ans : la primaire', 3),
(8, '11-15 ans : le collège', 3),
(9, '16-18 ans : le lycée', 3),
(10, '19-23 ans : les études-sup', 3),
(11, '24+ ans : je hais ma vie actuelle', 3);
