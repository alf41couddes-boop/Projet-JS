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

// Deuxieme insertion de données de test pour plus de questions

INSERT INTO utilisateur (email, password, nom, prenom, age, bio, type_utilisateur) VALUES
('membre2@phl.com', 'password123', 'Martin', 'Alice', 28, 'Je déteste le bruit et les gens pressés', 'membre');

INSERT INTO question (id, texte, texte_libre) VALUES
(4, 'Détestes-tu attendre dans une file trop longue ?', FALSE),
(5, 'Quel type de personnes te fait lever les yeux au ciel ?', FALSE),
(6, 'Détestes-tu parler au téléphone ?', FALSE),
(7, 'Quel moment de la journée détestes-tu le plus ?', FALSE),
(8, 'Quelle activité quotidienne te fatigue le plus ?', FALSE),
(9, 'Détestes-tu les réunions inutiles ?', FALSE),
(10, 'Qu’est-ce qui t’énerve le plus sur les réseaux sociaux ?', FALSE);

INSERT INTO reponse (id, texte, question_id) VALUES
(12, 'Oui', 4),
(13, 'Non', 4),
(14, 'Les gens arrogants', 5),
(15, 'Les bavards', 5),
(16, 'Les pessimistes', 5),
(17, 'Les optimistes', 5),
(18, 'Oui', 6),
(19, 'Non', 6),
(20, 'Le matin', 7),
(21, 'L’après-midi', 7),
(22, 'Le soir', 7),
(23, 'La nuit', 7),
(24, 'Faire les courses', 8),
(25, 'Faire le ménage', 8),
(26, 'Aller au travail', 8),
(27, 'Oui', 9),
(28, 'Non', 9);
(30, 'Les commentaires agressifs', 10),
(31, 'Les fake news', 10),
(32, 'Les influenceurs', 10),
(33, 'Les pubs incessantes', 10),
(34, 'Les débats inutiles', 10),
(35, 'Les gens qui étalent leur vie', 10),
(36, 'Les trucs de nourriture là', 10);

CREATE TABLE IF NOT EXISTS like_membre (
    id INT AUTO_INCREMENT PRIMARY KEY,
    membre_id INT NOT NULL,        -- qui a été liké
    liker_id INT NOT NULL,         -- qui a liké
    date_like TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(membre_id, liker_id),
    FOREIGN KEY (membre_id) REFERENCES utilisateur(id),
    FOREIGN KEY (liker_id) REFERENCES utilisateur(id)
);

