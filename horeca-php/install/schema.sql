-- Base de données HORECA Prospection
-- Version PHP + MySQL
-- Compatible hébergement OVH classique

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- --------------------------------------------------------
-- Table: users
-- --------------------------------------------------------

CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `role` enum('admin','manager','commercial') NOT NULL DEFAULT 'commercial',
  `phone` varchar(20) DEFAULT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table: prospects
-- --------------------------------------------------------

CREATE TABLE `prospects` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `type` enum('hotel','restaurant','traiteur','ecole','hopital','autre') NOT NULL DEFAULT 'autre',
  `address` varchar(255) DEFAULT NULL,
  `postal_code` varchar(10) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `country` varchar(100) DEFAULT 'France',
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `manager_name` varchar(100) DEFAULT NULL,
  `status` enum('to_visit','in_progress','converted','lost') NOT NULL DEFAULT 'to_visit',
  `latitude` decimal(10, 8) DEFAULT NULL,
  `longitude` decimal(11, 8) DEFAULT NULL,
  `note_avg` decimal(3, 2) DEFAULT 0.00,
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  KEY `status` (`status`),
  KEY `city` (`city`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table: visits
-- --------------------------------------------------------

CREATE TABLE `visits` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `prospect_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `tour_id` int(11) DEFAULT NULL,
  `visited_at` datetime NOT NULL,
  `duration_minutes` int(11) DEFAULT NULL,
  `objective` text DEFAULT NULL,
  `summary` text DEFAULT NULL,
  `score` int(1) DEFAULT NULL CHECK (`score` >= 1 AND `score` <= 5),
  `signed_by` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `prospect_id` (`prospect_id`),
  KEY `user_id` (`user_id`),
  KEY `tour_id` (`tour_id`),
  KEY `visited_at` (`visited_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table: tours
-- --------------------------------------------------------

CREATE TABLE `tours` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `date` date NOT NULL,
  `status` enum('planned','in_progress','completed','cancelled') NOT NULL DEFAULT 'planned',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `date` (`date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table: tour_steps
-- --------------------------------------------------------

CREATE TABLE `tour_steps` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tour_id` int(11) NOT NULL,
  `prospect_id` int(11) NOT NULL,
  `step_order` int(11) NOT NULL DEFAULT 0,
  `status` enum('pending','done','skipped') NOT NULL DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `tour_id` (`tour_id`),
  KEY `prospect_id` (`prospect_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Contraintes de clés étrangères
-- --------------------------------------------------------

ALTER TABLE `visits`
  ADD CONSTRAINT `visits_prospect_fk` FOREIGN KEY (`prospect_id`) REFERENCES `prospects` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `visits_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `visits_tour_fk` FOREIGN KEY (`tour_id`) REFERENCES `tours` (`id`) ON DELETE SET NULL;

ALTER TABLE `tours`
  ADD CONSTRAINT `tours_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

ALTER TABLE `tour_steps`
  ADD CONSTRAINT `tour_steps_tour_fk` FOREIGN KEY (`tour_id`) REFERENCES `tours` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `tour_steps_prospect_fk` FOREIGN KEY (`prospect_id`) REFERENCES `prospects` (`id`) ON DELETE CASCADE;

ALTER TABLE `prospects`
  ADD CONSTRAINT `prospects_user_fk` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

-- --------------------------------------------------------
-- Données initiales
-- --------------------------------------------------------

-- Utilisateurs par défaut
INSERT INTO `users` (`email`, `password`, `first_name`, `last_name`, `role`, `phone`, `active`) VALUES
('admin@horeca-prospection.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin', 'HORECA', 'admin', '+33612345678', 1),
('manager@horeca-prospection.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Manager', 'Commercial', 'manager', '+33612345679', 1),
('commercial@horeca-prospection.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Jean', 'Dupont', 'commercial', '+33612345680', 1);

-- Note: Le mot de passe pour tous est "Admin123!" (hashé avec bcrypt)

-- Prospects de test
INSERT INTO `prospects` (`name`, `type`, `address`, `postal_code`, `city`, `country`, `phone`, `email`, `website`, `manager_name`, `status`, `latitude`, `longitude`, `created_by`) VALUES
('Hôtel Le Grand Paris', 'hotel', '15 Boulevard des Capucines', '75009', 'Paris', 'France', '+33142617050', 'contact@grandparis.fr', 'https://grandparis.fr', 'Marie Dubois', 'to_visit', 48.870102, 2.333284, 1),
('Restaurant La Tour Eiffel', 'restaurant', '5 Avenue Anatole France', '75007', 'Paris', 'France', '+33145555961', 'contact@toureiffel-resto.fr', NULL, 'Pierre Martin', 'in_progress', 48.858370, 2.294481, 1),
('Traiteur Gourmet Plus', 'traiteur', '28 Rue de la Paix', '75002', 'Paris', 'France', '+33142617070', 'contact@gourmetplus.fr', 'https://gourmetplus.fr', 'Sophie Laurent', 'converted', 48.869200, 2.331600, 1),
('École Internationale Paris', 'ecole', '82 Rue des Saints-Pères', '75007', 'Paris', 'France', '+33145489800', 'admin@ecole-paris.fr', 'https://ecole-paris.fr', 'Jacques Leroy', 'to_visit', 48.854280, 2.330540, 1),
('Hôpital Pitié-Salpêtrière', 'hopital', '47-83 Boulevard de l\'Hôpital', '75013', 'Paris', 'France', '+33142160000', 'contact@pitie-salpetriere.fr', NULL, 'Dr. Bernard', 'in_progress', 48.840370, 2.362640, 1),
('Hôtel de Crillon', 'hotel', '10 Place de la Concorde', '75008', 'Paris', 'France', '+33144711500', 'reservations@crillon.com', 'https://crillon.com', 'Antoine Rousseau', 'to_visit', 48.867890, 2.321230, 1),
('Restaurant Le Jules Verne', 'restaurant', 'Tour Eiffel - 2ème étage', '75007', 'Paris', 'France', '+33145555961', 'contact@lejulesverne-paris.com', 'https://lejulesverne-paris.com', 'Alain Ducasse', 'converted', 48.858093, 2.294694, 1),
('Lycée Henri IV', 'ecole', '23 Rue Clovis', '75005', 'Paris', 'France', '+33144414444', 'contact@henri4.fr', NULL, 'Proviseur Durand', 'to_visit', 48.846670, 2.348060, 1),
('Hôtel Plaza Athénée', 'hotel', '25 Avenue Montaigne', '75008', 'Paris', 'France', '+33153676566', 'reservations@plaza-athenee.com', 'https://plaza-athenee.com', 'François Delahaye', 'in_progress', 48.866190, 2.304500, 1),
('Restaurant L\'Ambroisie', 'restaurant', '9 Place des Vosges', '75004', 'Paris', 'France', '+33142788451', 'contact@ambroisie-paris.com', NULL, 'Bernard Pacaud', 'to_visit', 48.855560, 2.365830, 1),
('Traiteur Lenôtre', 'traiteur', '44 Rue d\'Auteuil', '75016', 'Paris', 'France', '+33142883800', 'paris@lenotre.com', 'https://lenotre.com', 'Gaston Lenôtre', 'converted', 48.847770, 2.268610, 1),
('Hôpital Necker', 'hopital', '149 Rue de Sèvres', '75015', 'Paris', 'France', '+33144494000', 'accueil@necker.aphp.fr', NULL, 'Dr. Lambert', 'to_visit', 48.845830, 2.313890, 1),
('Hôtel Ritz Paris', 'hotel', '15 Place Vendôme', '75001', 'Paris', 'France', '+33143163030', 'resa@ritzparis.com', 'https://ritzparis.com', 'César Ritz', 'converted', 48.867500, 2.328890, 1),
('Restaurant Alain Ducasse', 'restaurant', 'Hôtel Plaza Athénée', '75008', 'Paris', 'France', '+33153676554', 'ducasse@plaza-athenee.com', 'https://alain-ducasse.com', 'Alain Ducasse', 'in_progress', 48.866190, 2.304500, 1),
('Université Sorbonne', 'ecole', '1 Rue Victor Cousin', '75005', 'Paris', 'France', '+33140462222', 'contact@sorbonne.fr', 'https://sorbonne.fr', 'Président Sorbonne', 'to_visit', 48.848610, 2.342780, 1);

COMMIT;

