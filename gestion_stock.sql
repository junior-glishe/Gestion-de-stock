-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost
-- Généré le : mer. 14 oct. 2026 à 10:22
-- Version du serveur : 10.4.28-MariaDB
-- Version de PHP : 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `gestion_stock`
--

-- --------------------------------------------------------

--
-- Structure de la table `alerte`
--

CREATE TABLE `alerte` (
  `id_alerte` int(10) UNSIGNED NOT NULL,
  `date_alerte` datetime NOT NULL DEFAULT current_timestamp(),
  `message` varchar(255) NOT NULL,
  `traitee` tinyint(1) NOT NULL DEFAULT 0,
  `id_produit` int(10) UNSIGNED NOT NULL
) ;

--
-- Déchargement des données de la table `alerte`
--

INSERT INTO `alerte` (`id_alerte`, `date_alerte`, `message`, `traitee`, `id_produit`) VALUES
(1, '2026-10-07 11:47:20', 'Stock faible pour le produit Eau minerale 1,5 L : 5 unite(s) restante(s)', 1, 1),
(2, '2026-10-07 13:18:15', 'Stock faible pour le produit Cahier 200 pages : 3 unite(s) restante(s)', 1, 2),
(3, '2026-10-08 12:44:01', 'Stock faible pour le produit Cahier 200 pages : 4 unite(s) restante(s)', 0, 2);

-- --------------------------------------------------------

--
-- Structure de la table `categorie`
--

CREATE TABLE `categorie` (
  `id_categorie` int(10) UNSIGNED NOT NULL,
  `nom` varchar(100) NOT NULL,
  `id_gestionnaire` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `categorie`
--

INSERT INTO `categorie` (`id_categorie`, `nom`, `id_gestionnaire`) VALUES
(1, 'Boissons', 2),
(2, 'Fournitures de bureau', 2);

-- --------------------------------------------------------

--
-- Structure de la table `fournisseur`
--

CREATE TABLE `fournisseur` (
  `id_fournisseur` int(10) UNSIGNED NOT NULL,
  `raison_sociale` varchar(150) NOT NULL,
  `code_fournisseur` varchar(30) NOT NULL,
  `personne_contact` varchar(100) DEFAULT NULL,
  `telephone` varchar(30) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `ville` varchar(100) DEFAULT NULL,
  `id_gestionnaire` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `fournisseur`
--

INSERT INTO `fournisseur` (`id_fournisseur`, `raison_sociale`, `code_fournisseur`, `personne_contact`, `telephone`, `email`, `ville`, `id_gestionnaire`) VALUES
(1, 'Societe Beninoise de Distribution', 'FOUR-001', 'Paul Agbo', '+22901000001', 'contact@sbd.example', 'Cotonou', 2),
(2, 'Papeterie Centrale', 'FOUR-002', 'Rose Akpovi', '+22901000002', 'ventes@papcentral.example', 'Porto-Novo', 2);

-- --------------------------------------------------------

--
-- Structure de la table `inventaire`
--

CREATE TABLE `inventaire` (
  `id_inventaire` int(10) UNSIGNED NOT NULL,
  `date_inventaire` datetime NOT NULL DEFAULT current_timestamp(),
  `id_superviseur` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `inventaire`
--

INSERT INTO `inventaire` (`id_inventaire`, `date_inventaire`, `id_superviseur`) VALUES
(1, '2026-10-07 11:47:20', 3),
(2, '2026-10-07 12:14:08', 3),
(3, '2026-10-07 12:14:10', 3);

--
-- Déclencheurs `inventaire`
--
DELIMITER $$
CREATE TRIGGER `trg_inventaire_bi` BEFORE INSERT ON `inventaire` FOR EACH ROW BEGIN
    DECLARE v_role VARCHAR(20);
    SELECT role_utilisateur INTO v_role
      FROM utilisateur
     WHERE id_utilisateur = NEW.id_superviseur;
    IF v_role IS NULL OR v_role <> 'SUPERVISEUR' THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Seul un superviseur peut realiser un inventaire';
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Structure de la table `journal_audit`
--

CREATE TABLE `journal_audit` (
  `id_audit` int(11) NOT NULL,
  `date_heure` datetime NOT NULL DEFAULT current_timestamp(),
  `action` varchar(50) NOT NULL,
  `module` varchar(50) NOT NULL,
  `type_objet` varchar(50) NOT NULL,
  `id_objet` int(11) DEFAULT NULL,
  `description` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `journal_audit`
--

INSERT INTO `journal_audit` (`id_audit`, `date_heure`, `action`, `module`, `type_objet`, `id_objet`, `description`) VALUES
(1, '2026-10-07 11:28:01', 'CONNEXION', 'Authentification', 'Utilisateur', 3, 'Connexion de superviseur@stockpro.local'),
(2, '2026-10-07 11:28:01', 'CONNEXION', 'Authentification', 'Utilisateur', 2, 'Connexion de gestionnaire@stockpro.local'),
(3, '2026-10-07 11:28:01', 'DECONNEXION', 'Authentification', 'Utilisateur', 3, 'Déconnexion de superviseur@stockpro.local'),
(4, '2026-10-07 11:28:36', 'CONNEXION', 'Authentification', 'Utilisateur', 2, 'Connexion de gestionnaire@stockpro.local'),
(5, '2026-10-07 11:28:36', 'CONNEXION', 'Authentification', 'Utilisateur', 3, 'Connexion de superviseur@stockpro.local'),
(6, '2026-10-07 11:28:36', 'CREATION', 'Catalogue', 'Categorie', 3, 'Catégorie « TEST-AUDIT » créée'),
(7, '2026-10-07 11:28:36', 'SUPPRESSION', 'Catalogue', 'Categorie', 3, 'Catégorie « TEST-AUDIT » supprimée'),
(8, '2026-10-07 11:28:37', 'DECONNEXION', 'Authentification', 'Utilisateur', 2, 'Déconnexion de gestionnaire@stockpro.local'),
(9, '2026-10-07 11:42:35', 'CONNEXION', 'Authentification', 'Utilisateur', 3, 'Connexion de superviseur@stockpro.local'),
(10, '2026-10-07 12:06:55', 'MODIFICATION', 'Catalogue', 'Produit', 1, 'Produit PRD-0001 (Eau minerale 1,5 L) modifié'),
(11, '2026-10-07 12:08:49', 'DECONNEXION', 'Authentification', 'Utilisateur', 3, 'Déconnexion de superviseur@stockpro.local'),
(12, '2026-10-07 12:08:50', 'CONNEXION', 'Authentification', 'Utilisateur', 3, 'Connexion de superviseur@stockpro.local'),
(13, '2026-10-07 12:09:13', 'CONNEXION', 'Authentification', 'Utilisateur', 2, 'Connexion de gestionnaire@stockpro.local'),
(14, '2026-10-07 12:09:14', 'CONNEXION', 'Authentification', 'Utilisateur', 2, 'Connexion de gestionnaire@stockpro.local'),
(15, '2026-10-07 12:12:05', 'DECONNEXION', 'Authentification', 'Utilisateur', 2, 'Déconnexion de gestionnaire@stockpro.local'),
(16, '2026-10-07 12:12:05', 'CONNEXION', 'Authentification', 'Utilisateur', 2, 'Connexion de gestionnaire@stockpro.local'),
(17, '2026-10-07 12:13:26', 'CONNEXION', 'Authentification', 'Utilisateur', 3, 'Connexion de superviseur@stockpro.local'),
(18, '2026-10-07 12:14:10', 'CREATION', 'Inventaire', 'Inventaire', 2, 'Inventaire de 1 produit(s), 1 écart(s)'),
(19, '2026-10-07 12:14:12', 'CREATION', 'Inventaire', 'Inventaire', 3, 'Inventaire de 1 produit(s), 0 écart(s)'),
(20, '2026-10-07 12:18:15', 'MODIFICATION', 'Catalogue', 'Produit', 2, 'Produit PRD-0002 (Cahier 200 pages) modifié'),
(21, '2026-10-07 12:18:40', 'MODIFICATION', 'Catalogue', 'Produit', 2, 'Produit PRD-0002 (Cahier 200 pages) modifié'),
(22, '2026-10-07 12:32:00', 'DECONNEXION', 'Authentification', 'Utilisateur', 3, 'Déconnexion de superviseur@stockpro.local'),
(23, '2026-10-07 12:32:02', 'CONNEXION', 'Authentification', 'Utilisateur', 3, 'Connexion de superviseur@stockpro.local'),
(24, '2026-10-07 13:09:26', 'CONNEXION', 'Authentification', 'Utilisateur', 2, 'Connexion de gestionnaire@stockpro.local'),
(25, '2026-10-07 13:16:15', 'DECONNEXION', 'Authentification', 'Utilisateur', 2, 'Déconnexion de gestionnaire@stockpro.local'),
(26, '2026-10-07 13:16:16', 'CONNEXION', 'Authentification', 'Utilisateur', 2, 'Connexion de gestionnaire@stockpro.local'),
(27, '2026-10-07 13:17:58', 'CONNEXION', 'Authentification', 'Utilisateur', 2, 'Connexion de gestionnaire@stockpro.local'),
(28, '2026-10-07 13:19:39', 'DECONNEXION', 'Authentification', 'Utilisateur', 2, 'Déconnexion de gestionnaire@stockpro.local'),
(29, '2026-10-07 13:19:39', 'CONNEXION', 'Authentification', 'Utilisateur', 2, 'Connexion de gestionnaire@stockpro.local'),
(30, '2026-10-07 13:20:29', 'CONNEXION', 'Authentification', 'Utilisateur', 1, 'Connexion de admin@stockpro.local'),
(31, '2026-10-07 13:21:56', 'DECONNEXION', 'Authentification', 'Utilisateur', 1, 'Déconnexion de admin@stockpro.local'),
(32, '2026-10-07 13:21:56', 'CONNEXION', 'Authentification', 'Utilisateur', 1, 'Connexion de admin@stockpro.local'),
(33, '2026-10-07 13:22:24', 'CONNEXION', 'Authentification', 'Utilisateur', 3, 'Connexion de superviseur@stockpro.local'),
(34, '2026-10-07 13:23:18', 'DECONNEXION', 'Authentification', 'Utilisateur', 3, 'Déconnexion de superviseur@stockpro.local'),
(35, '2026-10-07 13:23:18', 'CONNEXION', 'Authentification', 'Utilisateur', 3, 'Connexion de superviseur@stockpro.local'),
(36, '2026-10-07 14:20:17', 'CONNEXION', 'Authentification', 'Utilisateur', 2, 'Connexion de gestionnaire@stockpro.local'),
(37, '2026-10-07 14:21:03', 'CREATION', 'Catalogue', 'Produit', 4, 'Produit PRD-0004 (NTECH DIGIT) créé'),
(38, '2026-10-07 14:21:37', 'DECONNEXION', 'Authentification', 'Utilisateur', 2, 'Déconnexion de gestionnaire@stockpro.local'),
(39, '2026-10-07 14:21:37', 'CONNEXION', 'Authentification', 'Utilisateur', 2, 'Connexion de gestionnaire@stockpro.local'),
(40, '2026-10-08 11:27:09', 'CONNEXION', 'Authentification', 'Utilisateur', 2, 'Connexion de gestionnaire@stockpro.local'),
(41, '2026-10-08 11:44:01', 'MODIFICATION', 'Catalogue', 'Produit', 2, 'Produit PRD-0002 (Cahier 200 pages) modifié'),
(42, '2026-10-08 11:45:10', 'DECONNEXION', 'Authentification', 'Utilisateur', 2, 'Déconnexion de gestionnaire@stockpro.local'),
(43, '2026-10-08 11:45:10', 'CONNEXION', 'Authentification', 'Utilisateur', 2, 'Connexion de gestionnaire@stockpro.local'),
(44, '2026-10-08 11:45:35', 'CONNEXION', 'Authentification', 'Utilisateur', 3, 'Connexion de superviseur@stockpro.local'),
(45, '2026-10-08 11:49:26', 'DECONNEXION', 'Authentification', 'Utilisateur', 3, 'Déconnexion de superviseur@stockpro.local'),
(46, '2026-10-08 11:49:27', 'CONNEXION', 'Authentification', 'Utilisateur', 3, 'Connexion de superviseur@stockpro.local'),
(47, '2026-10-08 11:49:36', 'CONNEXION', 'Authentification', 'Utilisateur', 1, 'Connexion de admin@stockpro.local'),
(48, '2026-10-08 11:55:52', 'DECONNEXION', 'Authentification', 'Utilisateur', 1, 'Déconnexion de admin@stockpro.local'),
(49, '2026-10-08 11:55:53', 'CONNEXION', 'Authentification', 'Utilisateur', 1, 'Connexion de admin@stockpro.local'),
(50, '2026-10-13 21:46:21', 'CONNEXION', 'Authentification', 'Utilisateur', 2, 'Connexion de gestionnaire@stockpro.local'),
(51, '2026-10-14 07:20:11', 'CONNEXION', 'Authentification', 'Utilisateur', 2, 'Connexion de gestionnaire@stockpro.local'),
(52, '2026-10-14 07:37:30', 'DECONNEXION', 'Authentification', 'Utilisateur', 2, 'Déconnexion de gestionnaire@stockpro.local'),
(53, '2026-10-14 07:37:31', 'CONNEXION', 'Authentification', 'Utilisateur', 2, 'Connexion de gestionnaire@stockpro.local'),
(54, '2026-10-14 07:39:58', 'CONNEXION', 'Authentification', 'Utilisateur', 2, 'Connexion de gestionnaire@stockpro.local'),
(55, '2026-10-14 07:43:01', 'DECONNEXION', 'Authentification', 'Utilisateur', 2, 'Déconnexion de gestionnaire@stockpro.local'),
(56, '2026-10-14 07:43:01', 'CONNEXION', 'Authentification', 'Utilisateur', 2, 'Connexion de gestionnaire@stockpro.local'),
(57, '2026-10-14 07:43:08', 'CONNEXION', 'Authentification', 'Utilisateur', 3, 'Connexion de superviseur@stockpro.local'),
(58, '2026-10-14 07:47:58', 'DECONNEXION', 'Authentification', 'Utilisateur', 3, 'Déconnexion de superviseur@stockpro.local'),
(59, '2026-10-14 07:47:58', 'CONNEXION', 'Authentification', 'Utilisateur', 3, 'Connexion de superviseur@stockpro.local'),
(60, '2026-10-14 07:48:12', 'CONNEXION', 'Authentification', 'Utilisateur', 1, 'Connexion de admin@stockpro.local');

-- --------------------------------------------------------

--
-- Structure de la table `ligne_inventaire`
--

CREATE TABLE `ligne_inventaire` (
  `id_ligne_inventaire` int(10) UNSIGNED NOT NULL,
  `quantite_theorique` int(11) NOT NULL,
  `quantite_reelle` int(11) NOT NULL,
  `ecart` int(11) GENERATED ALWAYS AS (`quantite_reelle` - `quantite_theorique`) STORED,
  `id_inventaire` int(10) UNSIGNED NOT NULL,
  `id_produit` int(10) UNSIGNED NOT NULL
) ;

--
-- Déchargement des données de la table `ligne_inventaire`
--

INSERT INTO `ligne_inventaire` (`id_ligne_inventaire`, `quantite_theorique`, `quantite_reelle`, `id_inventaire`, `id_produit`) VALUES
(1, 5, 5, 1, 1),
(2, 100, 98, 1, 2),
(3, 30, 30, 1, 3),
(4, 100, 130, 2, 2),
(5, 130, 130, 3, 2);

-- --------------------------------------------------------

--
-- Structure de la table `mouvement_stock`
--

CREATE TABLE `mouvement_stock` (
  `id_mouvement` int(10) UNSIGNED NOT NULL,
  `date_mouvement` datetime NOT NULL DEFAULT current_timestamp(),
  `quantite` int(11) NOT NULL,
  `type_mouvement` enum('ENTREE','SORTIE') NOT NULL,
  `id_produit` int(10) UNSIGNED NOT NULL,
  `id_gestionnaire` int(10) UNSIGNED NOT NULL
) ;

--
-- Déchargement des données de la table `mouvement_stock`
--

INSERT INTO `mouvement_stock` (`id_mouvement`, `date_mouvement`, `quantite`, `type_mouvement`, `id_produit`, `id_gestionnaire`) VALUES
(1, '2026-10-07 11:47:20', 50, 'ENTREE', 1, 2),
(2, '2026-10-07 11:47:20', 100, 'ENTREE', 2, 2),
(3, '2026-10-07 11:47:20', 30, 'ENTREE', 3, 2),
(4, '2026-10-07 11:47:20', 45, 'SORTIE', 1, 2),
(5, '2026-10-07 12:06:54', 11, 'ENTREE', 1, 3),
(6, '2026-10-07 12:18:15', 127, 'SORTIE', 2, 3),
(7, '2026-10-07 12:18:39', 20, 'ENTREE', 2, 3),
(8, '2026-10-07 14:21:03', 33, 'ENTREE', 4, 2),
(9, '2026-10-08 11:44:01', 19, 'SORTIE', 2, 2);

--
-- Déclencheurs `mouvement_stock`
--
DELIMITER $$
CREATE TRIGGER `trg_mouvement_stock_ai` AFTER INSERT ON `mouvement_stock` FOR EACH ROW BEGIN
    DECLARE v_stock INT;
    DECLARE v_seuil INT;
    DECLARE v_nom   VARCHAR(150);

    IF NEW.type_mouvement = 'ENTREE' THEN
        UPDATE produit
           SET quantite_disponible = quantite_disponible + NEW.quantite
         WHERE id_produit = NEW.id_produit;
    ELSE
        UPDATE produit
           SET quantite_disponible = quantite_disponible - NEW.quantite
         WHERE id_produit = NEW.id_produit;
    END IF;

    SELECT quantite_disponible, seuil_alerte, nom
      INTO v_stock, v_seuil, v_nom
      FROM produit
     WHERE id_produit = NEW.id_produit;

    IF v_stock <= v_seuil THEN
        IF NOT EXISTS (SELECT 1 FROM alerte
                        WHERE id_produit = NEW.id_produit
                          AND traitee = 0) THEN
            INSERT INTO alerte (message, id_produit)
            VALUES (CONCAT('Stock faible pour le produit ', v_nom,
                           ' : ', v_stock, ' unite(s) restante(s)'),
                    NEW.id_produit);
        END IF;
    END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_mouvement_stock_bi` BEFORE INSERT ON `mouvement_stock` FOR EACH ROW BEGIN
    DECLARE v_stock INT;
    IF NEW.type_mouvement = 'SORTIE' THEN
        SELECT quantite_disponible INTO v_stock
        FROM produit
        WHERE id_produit = NEW.id_produit;
        IF v_stock < NEW.quantite THEN
            SIGNAL SQLSTATE '45000'
                SET MESSAGE_TEXT = 'Stock insuffisant pour effectuer cette sortie';
        END IF;
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Structure de la table `produit`
--

CREATE TABLE `produit` (
  `id_produit` int(10) UNSIGNED NOT NULL,
  `reference` varchar(50) NOT NULL,
  `nom` varchar(150) NOT NULL,
  `description` text DEFAULT NULL,
  `quantite_disponible` int(11) NOT NULL DEFAULT 0,
  `seuil_alerte` int(11) NOT NULL DEFAULT 0,
  `prix` decimal(12,2) NOT NULL DEFAULT 0.00,
  `id_categorie` int(10) UNSIGNED NOT NULL,
  `id_gestionnaire` int(10) UNSIGNED NOT NULL
) ;

--
-- Déchargement des données de la table `produit`
--

INSERT INTO `produit` (`id_produit`, `reference`, `nom`, `description`, `quantite_disponible`, `seuil_alerte`, `prix`, `id_categorie`, `id_gestionnaire`) VALUES
(1, 'PRD-0001', 'Eau minerale 1,5 L', 'Bouteille d eau minerale de 1,5 litre', 16, 10, 500.00, 1, 2),
(2, 'PRD-0002', 'Cahier 200 pages', 'Cahier grand format 200 pages', 4, 20, 1000.00, 2, 2),
(3, 'PRD-0003', 'Stylo bleu', 'Stylo a bille bleu', 30, 15, 250.00, 2, 2),
(4, 'PRD-0004', 'NTECH DIGIT', NULL, 33, 5, 200000.00, 1, 2);

-- --------------------------------------------------------

--
-- Structure de la table `utilisateur`
--

CREATE TABLE `utilisateur` (
  `id_utilisateur` int(10) UNSIGNED NOT NULL,
  `nom` varchar(100) NOT NULL,
  `prenom` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `mot_de_passe` varchar(255) NOT NULL,
  `statut` tinyint(1) NOT NULL DEFAULT 1,
  `role_utilisateur` enum('ADMINISTRATEUR','GESTIONNAIRE','SUPERVISEUR') NOT NULL DEFAULT 'GESTIONNAIRE'
) ;

--
-- Déchargement des données de la table `utilisateur`
--

INSERT INTO `utilisateur` (`id_utilisateur`, `nom`, `prenom`, `email`, `mot_de_passe`, `statut`, `role_utilisateur`) VALUES
(1, 'ADMIN', 'Systeme', 'admin@stockpro.local', '0bd2f5f7e08e5faea38d6b3b5ee0f617:b295ea7e42d24bc511b8c12783e2f389b5021eb01cc2d3f483831087204bf24c0f9f5eec9c0ddabd3f0ba2ff421ac5c4b4cf5eac1d25c90ba0222cd2213aed19', 1, 'ADMINISTRATEUR'),
(2, 'DOSSOU', 'Marc', 'gestionnaire@stockpro.local', '2609b30ef37028fc971b0af0a29f38d5:629df3a3a024bcd769e8a8826fae6a5d70f904c5fae830d9005dad0a699d16facbc7ef6003874304696a0a994dfdc2f40a2f9a3f3039a71697031c2ca9af3495', 1, 'GESTIONNAIRE'),
(3, 'HOUNSOU', 'Awa', 'superviseur@stockpro.local', '39242d7316607195a078d249656859fc:639b1aef9b19078388f63294c042c6f348b940022de3256111405fe65da057a42f7e4fb7d53f9175b43aef7734df28ff4400112e1dfbcc226fc50908940c0fb8', 1, 'SUPERVISEUR');

-- --------------------------------------------------------

--
-- Doublure de structure pour la vue `v_produits_stock_faible`
-- (Voir ci-dessous la vue réelle)
--
CREATE TABLE `v_produits_stock_faible` (
`id_produit` int(10) unsigned
,`reference` varchar(50)
,`nom` varchar(150)
,`quantite_disponible` int(11)
,`seuil_alerte` int(11)
,`categorie` varchar(100)
);

-- --------------------------------------------------------

--
-- Structure de la vue `v_produits_stock_faible`
--
DROP TABLE IF EXISTS `v_produits_stock_faible`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_produits_stock_faible`  AS SELECT `p`.`id_produit` AS `id_produit`, `p`.`reference` AS `reference`, `p`.`nom` AS `nom`, `p`.`quantite_disponible` AS `quantite_disponible`, `p`.`seuil_alerte` AS `seuil_alerte`, `c`.`nom` AS `categorie` FROM (`produit` `p` join `categorie` `c` on(`c`.`id_categorie` = `p`.`id_categorie`)) WHERE `p`.`quantite_disponible` <= `p`.`seuil_alerte` ;

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `alerte`
--
ALTER TABLE `alerte`
  ADD PRIMARY KEY (`id_alerte`),
  ADD KEY `idx_alerte_produit_traitee` (`id_produit`,`traitee`),
  ADD KEY `idx_alerte_traitee_date` (`traitee`,`date_alerte`);

--
-- Index pour la table `categorie`
--
ALTER TABLE `categorie`
  ADD PRIMARY KEY (`id_categorie`),
  ADD UNIQUE KEY `uq_categorie_nom` (`nom`),
  ADD KEY `fk_categorie_gestionnaire` (`id_gestionnaire`);

--
-- Index pour la table `fournisseur`
--
ALTER TABLE `fournisseur`
  ADD PRIMARY KEY (`id_fournisseur`),
  ADD UNIQUE KEY `uq_fournisseur_code` (`code_fournisseur`),
  ADD KEY `fk_fournisseur_gestionnaire` (`id_gestionnaire`),
  ADD KEY `idx_fournisseur_nom` (`raison_sociale`),
  ADD KEY `idx_fournisseur_ville` (`ville`);

--
-- Index pour la table `inventaire`
--
ALTER TABLE `inventaire`
  ADD PRIMARY KEY (`id_inventaire`),
  ADD KEY `fk_inventaire_superviseur` (`id_superviseur`),
  ADD KEY `idx_inventaire_date` (`date_inventaire`);

--
-- Index pour la table `journal_audit`
--
ALTER TABLE `journal_audit`
  ADD PRIMARY KEY (`id_audit`),
  ADD KEY `idx_journal_audit_module` (`module`),
  ADD KEY `idx_journal_audit_action` (`action`),
  ADD KEY `idx_journal_audit_date` (`date_heure`);

--
-- Index pour la table `ligne_inventaire`
--
ALTER TABLE `ligne_inventaire`
  ADD PRIMARY KEY (`id_ligne_inventaire`),
  ADD UNIQUE KEY `uq_ligne_inv_produit` (`id_inventaire`,`id_produit`),
  ADD KEY `fk_ligne_inv_produit` (`id_produit`);

--
-- Index pour la table `mouvement_stock`
--
ALTER TABLE `mouvement_stock`
  ADD PRIMARY KEY (`id_mouvement`),
  ADD KEY `fk_mouvement_gestionnaire` (`id_gestionnaire`),
  ADD KEY `idx_mouvement_produit_date` (`id_produit`,`date_mouvement`),
  ADD KEY `idx_mouvement_date` (`date_mouvement`);

--
-- Index pour la table `produit`
--
ALTER TABLE `produit`
  ADD PRIMARY KEY (`id_produit`),
  ADD UNIQUE KEY `uq_produit_reference` (`reference`),
  ADD KEY `fk_produit_categorie` (`id_categorie`),
  ADD KEY `fk_produit_gestionnaire` (`id_gestionnaire`),
  ADD KEY `idx_produit_nom` (`nom`),
  ADD KEY `idx_produit_stock` (`quantite_disponible`,`seuil_alerte`);
ALTER TABLE `produit` ADD FULLTEXT KEY `ft_produit_recherche` (`nom`,`description`);

--
-- Index pour la table `utilisateur`
--
ALTER TABLE `utilisateur`
  ADD PRIMARY KEY (`id_utilisateur`),
  ADD UNIQUE KEY `uq_utilisateur_email` (`email`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `alerte`
--
ALTER TABLE `alerte`
  MODIFY `id_alerte` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `categorie`
--
ALTER TABLE `categorie`
  MODIFY `id_categorie` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `fournisseur`
--
ALTER TABLE `fournisseur`
  MODIFY `id_fournisseur` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `inventaire`
--
ALTER TABLE `inventaire`
  MODIFY `id_inventaire` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `journal_audit`
--
ALTER TABLE `journal_audit`
  MODIFY `id_audit` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=61;

--
-- AUTO_INCREMENT pour la table `ligne_inventaire`
--
ALTER TABLE `ligne_inventaire`
  MODIFY `id_ligne_inventaire` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `mouvement_stock`
--
ALTER TABLE `mouvement_stock`
  MODIFY `id_mouvement` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `produit`
--
ALTER TABLE `produit`
  MODIFY `id_produit` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `utilisateur`
--
ALTER TABLE `utilisateur`
  MODIFY `id_utilisateur` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `alerte`
--
ALTER TABLE `alerte`
  ADD CONSTRAINT `fk_alerte_produit` FOREIGN KEY (`id_produit`) REFERENCES `produit` (`id_produit`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `categorie`
--
ALTER TABLE `categorie`
  ADD CONSTRAINT `fk_categorie_gestionnaire` FOREIGN KEY (`id_gestionnaire`) REFERENCES `utilisateur` (`id_utilisateur`) ON UPDATE CASCADE;

--
-- Contraintes pour la table `fournisseur`
--
ALTER TABLE `fournisseur`
  ADD CONSTRAINT `fk_fournisseur_gestionnaire` FOREIGN KEY (`id_gestionnaire`) REFERENCES `utilisateur` (`id_utilisateur`) ON UPDATE CASCADE;

--
-- Contraintes pour la table `inventaire`
--
ALTER TABLE `inventaire`
  ADD CONSTRAINT `fk_inventaire_superviseur` FOREIGN KEY (`id_superviseur`) REFERENCES `utilisateur` (`id_utilisateur`) ON UPDATE CASCADE;

--
-- Contraintes pour la table `ligne_inventaire`
--
ALTER TABLE `ligne_inventaire`
  ADD CONSTRAINT `fk_ligne_inv_inventaire` FOREIGN KEY (`id_inventaire`) REFERENCES `inventaire` (`id_inventaire`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_ligne_inv_produit` FOREIGN KEY (`id_produit`) REFERENCES `produit` (`id_produit`) ON UPDATE CASCADE;

--
-- Contraintes pour la table `mouvement_stock`
--
ALTER TABLE `mouvement_stock`
  ADD CONSTRAINT `fk_mouvement_gestionnaire` FOREIGN KEY (`id_gestionnaire`) REFERENCES `utilisateur` (`id_utilisateur`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_mouvement_produit` FOREIGN KEY (`id_produit`) REFERENCES `produit` (`id_produit`) ON UPDATE CASCADE;

--
-- Contraintes pour la table `produit`
--
ALTER TABLE `produit`
  ADD CONSTRAINT `fk_produit_categorie` FOREIGN KEY (`id_categorie`) REFERENCES `categorie` (`id_categorie`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_produit_gestionnaire` FOREIGN KEY (`id_gestionnaire`) REFERENCES `utilisateur` (`id_utilisateur`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
