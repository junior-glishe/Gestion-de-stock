-- ============================================================================
-- StockPro - Application de gestion de stock
-- Script SQL complet : creation de la base, des tables, contraintes,
-- index, vue, triggers et jeu de donnees de test.
-- SGBD cible : MySQL 8.0+ (compatible MariaDB 10.5+)
-- Moteur : InnoDB - Encodage : utf8mb4
-- ============================================================================

DROP DATABASE IF EXISTS gestion_stock;
CREATE DATABASE gestion_stock
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;
USE gestion_stock;

-- ----------------------------------------------------------------------------
-- 1. TABLE UTILISATEUR
--    Heritage Utilisateur -> Administrateur / Gestionnaire / Superviseur
--    traduit par une table unique + colonne discriminante role_utilisateur
-- ----------------------------------------------------------------------------
CREATE TABLE utilisateur (
    id_utilisateur    INT UNSIGNED NOT NULL AUTO_INCREMENT,
    nom               VARCHAR(100) NOT NULL,
    prenom            VARCHAR(100) NOT NULL,
    email             VARCHAR(150) NOT NULL,
    mot_de_passe      VARCHAR(255) NOT NULL,
    statut            TINYINT(1)   NOT NULL DEFAULT 1,
    role_utilisateur  ENUM('ADMINISTRATEUR','GESTIONNAIRE','SUPERVISEUR')
                      NOT NULL DEFAULT 'GESTIONNAIRE',
    CONSTRAINT pk_utilisateur        PRIMARY KEY (id_utilisateur),
    CONSTRAINT uq_utilisateur_email  UNIQUE (email),
    CONSTRAINT ck_utilisateur_statut CHECK (statut IN (0, 1))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 2. TABLE FOURNISSEUR
--    Association : Gestionnaire (1) --- gere --- (0..*) Fournisseur
-- ----------------------------------------------------------------------------
CREATE TABLE fournisseur (
    id_fournisseur    INT UNSIGNED NOT NULL AUTO_INCREMENT,
    raison_sociale    VARCHAR(150) NOT NULL,
    code_fournisseur  VARCHAR(30)  NOT NULL,
    personne_contact  VARCHAR(100) NULL,
    telephone         VARCHAR(30)  NULL,
    email             VARCHAR(150) NULL,
    ville             VARCHAR(100) NULL,
    id_gestionnaire   INT UNSIGNED NOT NULL,
    CONSTRAINT pk_fournisseur        PRIMARY KEY (id_fournisseur),
    CONSTRAINT uq_fournisseur_code   UNIQUE (code_fournisseur),
    CONSTRAINT fk_fournisseur_gestionnaire
        FOREIGN KEY (id_gestionnaire) REFERENCES utilisateur (id_utilisateur)
        ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 3. TABLE CATEGORIE
--    Association : Gestionnaire (1) --- creer --- (0..*) Categorie
-- ----------------------------------------------------------------------------
CREATE TABLE categorie (
    id_categorie      INT UNSIGNED NOT NULL AUTO_INCREMENT,
    nom               VARCHAR(100) NOT NULL,
    id_gestionnaire   INT UNSIGNED NOT NULL,
    CONSTRAINT pk_categorie       PRIMARY KEY (id_categorie),
    CONSTRAINT uq_categorie_nom   UNIQUE (nom),
    CONSTRAINT fk_categorie_gestionnaire
        FOREIGN KEY (id_gestionnaire) REFERENCES utilisateur (id_utilisateur)
        ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 4. TABLE PRODUIT
--    Associations : Categorie (1) --- appartient --- (0..*) Produit
--                   Gestionnaire (1) --- enregistre --- (0..*) Produit
-- ----------------------------------------------------------------------------
CREATE TABLE produit (
    id_produit          INT UNSIGNED  NOT NULL AUTO_INCREMENT,
    reference           VARCHAR(50)   NOT NULL,
    nom                 VARCHAR(150)  NOT NULL,
    description         TEXT          NULL,
    quantite_disponible INT           NOT NULL DEFAULT 0,
    seuil_alerte        INT           NOT NULL DEFAULT 0,
    prix                DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    id_categorie        INT UNSIGNED  NOT NULL,
    id_gestionnaire     INT UNSIGNED  NOT NULL,
    CONSTRAINT pk_produit            PRIMARY KEY (id_produit),
    CONSTRAINT uq_produit_reference  UNIQUE (reference),
    CONSTRAINT ck_produit_quantite   CHECK (quantite_disponible >= 0),
    CONSTRAINT ck_produit_seuil      CHECK (seuil_alerte >= 0),
    CONSTRAINT ck_produit_prix       CHECK (prix >= 0),
    CONSTRAINT fk_produit_categorie
        FOREIGN KEY (id_categorie) REFERENCES categorie (id_categorie)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_produit_gestionnaire
        FOREIGN KEY (id_gestionnaire) REFERENCES utilisateur (id_utilisateur)
        ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 5. TABLE MOUVEMENT_STOCK
--    Heritage MouvementStock -> EntreStock / SortieStock
--    traduit par une table unique + colonne discriminante type_mouvement
--    Associations : Gestionnaire (1) --- effectuer --- (0..*) MouvementStock
--                   MouvementStock (0..*) --- concerne --- (1) Produit
-- ----------------------------------------------------------------------------
CREATE TABLE mouvement_stock (
    id_mouvement      INT UNSIGNED NOT NULL AUTO_INCREMENT,
    date_mouvement    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    quantite          INT          NOT NULL,
    type_mouvement    ENUM('ENTREE','SORTIE') NOT NULL,
    id_produit        INT UNSIGNED NOT NULL,
    id_gestionnaire   INT UNSIGNED NOT NULL,
    CONSTRAINT pk_mouvement_stock      PRIMARY KEY (id_mouvement),
    CONSTRAINT ck_mouvement_quantite   CHECK (quantite > 0),
    CONSTRAINT fk_mouvement_produit
        FOREIGN KEY (id_produit) REFERENCES produit (id_produit)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_mouvement_gestionnaire
        FOREIGN KEY (id_gestionnaire) REFERENCES utilisateur (id_utilisateur)
        ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 6. TABLE INVENTAIRE
--    Association : Superviseur (1) --- realise --- (0..*) Inventaire
-- ----------------------------------------------------------------------------
CREATE TABLE inventaire (
    id_inventaire     INT UNSIGNED NOT NULL AUTO_INCREMENT,
    date_inventaire   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    id_superviseur   INT UNSIGNED NOT NULL,
    CONSTRAINT pk_inventaire PRIMARY KEY (id_inventaire),
    CONSTRAINT fk_inventaire_superviseur
        FOREIGN KEY (id_superviseur) REFERENCES utilisateur (id_utilisateur)
        ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 7. TABLE LIGNE_INVENTAIRE
--    Agregation : Inventaire (1) <>--- comprend ---(1..*) LigneInventaire
--    Association : Produit (1) --- recense --- (0..*) LigneInventaire
--    ecart = quantite_reelle - quantite_theorique (colonne calculee)
-- ----------------------------------------------------------------------------
CREATE TABLE ligne_inventaire (
    id_ligne_inventaire INT UNSIGNED NOT NULL AUTO_INCREMENT,
    quantite_theorique  INT          NOT NULL,
    quantite_reelle     INT          NOT NULL,
    ecart               INT GENERATED ALWAYS AS (quantite_reelle - quantite_theorique) STORED,
    id_inventaire       INT UNSIGNED NOT NULL,
    id_produit          INT UNSIGNED NOT NULL,
    CONSTRAINT pk_ligne_inventaire      PRIMARY KEY (id_ligne_inventaire),
    CONSTRAINT uq_ligne_inv_produit     UNIQUE (id_inventaire, id_produit),
    CONSTRAINT ck_ligne_inv_theorique   CHECK (quantite_theorique >= 0),
    CONSTRAINT ck_ligne_inv_reelle      CHECK (quantite_reelle >= 0),
    CONSTRAINT fk_ligne_inv_inventaire
        FOREIGN KEY (id_inventaire) REFERENCES inventaire (id_inventaire)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_ligne_inv_produit
        FOREIGN KEY (id_produit) REFERENCES produit (id_produit)
        ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 8. TABLE ALERTE
--    Association : Produit (1) --- genere --- (0..*) Alerte
-- ----------------------------------------------------------------------------
CREATE TABLE alerte (
    id_alerte         INT UNSIGNED NOT NULL AUTO_INCREMENT,
    date_alerte       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    message           VARCHAR(255) NOT NULL,
    traitee           TINYINT(1)   NOT NULL DEFAULT 0,
    id_produit        INT UNSIGNED NOT NULL,
    CONSTRAINT pk_alerte         PRIMARY KEY (id_alerte),
    CONSTRAINT ck_alerte_traitee CHECK (traitee IN (0, 1)),
    CONSTRAINT fk_alerte_produit
        FOREIGN KEY (id_produit) REFERENCES produit (id_produit)
        ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 9. INDEX COMPLEMENTAIRES (recherche rapide)
--    Les cles primaires, les colonnes UNIQUE (email, reference, code_fournisseur,
--    nom de categorie) et les cles etrangeres sont deja indexees par InnoDB.
-- ----------------------------------------------------------------------------
-- Produits : recherche par nom (debut de mot), par mot-cle, et stock faible
CREATE INDEX idx_produit_nom      ON produit (nom);
CREATE INDEX idx_produit_stock    ON produit (quantite_disponible, seuil_alerte);
CREATE FULLTEXT INDEX ft_produit_recherche ON produit (nom, description);

-- Mouvements : historique d'un produit, filtre par periode
CREATE INDEX idx_mouvement_produit_date ON mouvement_stock (id_produit, date_mouvement);
CREATE INDEX idx_mouvement_date         ON mouvement_stock (date_mouvement);

-- Alertes : alertes non traitees d'un produit (trigger) et liste des alertes a traiter
CREATE INDEX idx_alerte_produit_traitee ON alerte (id_produit, traitee);
CREATE INDEX idx_alerte_traitee_date    ON alerte (traitee, date_alerte);

-- Fournisseurs et inventaires : recherche et tri
CREATE INDEX idx_fournisseur_nom   ON fournisseur (raison_sociale);
CREATE INDEX idx_fournisseur_ville ON fournisseur (ville);
CREATE INDEX idx_inventaire_date   ON inventaire (date_inventaire);

-- ----------------------------------------------------------------------------
-- 10. VUE : produits en stock faible (methode EstEnStockFaible())
-- ----------------------------------------------------------------------------
CREATE OR REPLACE VIEW v_produits_stock_faible AS
SELECT p.id_produit,
       p.reference,
       p.nom,
       p.quantite_disponible,
       p.seuil_alerte,
       c.nom AS categorie
FROM produit p
INNER JOIN categorie c ON c.id_categorie = p.id_categorie
WHERE p.quantite_disponible <= p.seuil_alerte;

-- ----------------------------------------------------------------------------
-- 11. TRIGGERS
--     (si votre outil ne gere pas DELIMITER, executez-les un par un)
-- ----------------------------------------------------------------------------
DELIMITER $$

-- 11.1 Refuse une sortie superieure au stock disponible
CREATE TRIGGER trg_mouvement_stock_bi
BEFORE INSERT ON mouvement_stock
FOR EACH ROW
BEGIN
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
END$$

-- 11.2 Applique le mouvement au stock (methode appliquer()) et genere
--      une alerte si le seuil est atteint (methode EstEnStockFaible())
CREATE TRIGGER trg_mouvement_stock_ai
AFTER INSERT ON mouvement_stock
FOR EACH ROW
BEGIN
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
END$$

-- 11.3 Seul un utilisateur de role SUPERVISEUR peut realiser un inventaire
CREATE TRIGGER trg_inventaire_bi
BEFORE INSERT ON inventaire
FOR EACH ROW
BEGIN
    DECLARE v_role VARCHAR(20);
    SELECT role_utilisateur INTO v_role
      FROM utilisateur
     WHERE id_utilisateur = NEW.id_superviseur;
    IF v_role IS NULL OR v_role <> 'SUPERVISEUR' THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Seul un superviseur peut realiser un inventaire';
    END IF;
END$$

DELIMITER ;

-- ----------------------------------------------------------------------------
-- 12. JEU DE DONNEES DE TEST
--     (les mots de passe sont des valeurs factices : a remplacer par des
--      hash generes par votre application, ex. bcrypt)
-- ----------------------------------------------------------------------------
INSERT INTO utilisateur (nom, prenom, email, mot_de_passe, statut, role_utilisateur) VALUES
('ADMIN',   'Systeme', 'admin@stockpro.local',         '$2y$10$REMPLACER.PAR.UN.HASH.BCRYPT.ADMIN',  1, 'ADMINISTRATEUR'),
('DOSSOU',  'Marc',    'gestionnaire@stockpro.local',  '$2y$10$REMPLACER.PAR.UN.HASH.BCRYPT.GEST',   1, 'GESTIONNAIRE'),
('HOUNSOU', 'Awa',     'superviseur@stockpro.local',  '$2y$10$REMPLACER.PAR.UN.HASH.BCRYPT.PROP',   1, 'SUPERVISEUR');

INSERT INTO fournisseur (raison_sociale, code_fournisseur, personne_contact, telephone, email, ville, id_gestionnaire) VALUES
('Societe Beninoise de Distribution', 'FOUR-001', 'Paul Agbo',   '+22901000001', 'contact@sbd.example',   'Cotonou',   2),
('Papeterie Centrale',                'FOUR-002', 'Rose Akpovi', '+22901000002', 'ventes@papcentral.example', 'Porto-Novo', 2);

INSERT INTO categorie (nom, id_gestionnaire) VALUES
('Boissons',              2),
('Fournitures de bureau', 2);

INSERT INTO produit (reference, nom, description, quantite_disponible, seuil_alerte, prix, id_categorie, id_gestionnaire) VALUES
('PRD-0001', 'Eau minerale 1,5 L', 'Bouteille d eau minerale de 1,5 litre', 0, 10, 500.00,  1, 2),
('PRD-0002', 'Cahier 200 pages',   'Cahier grand format 200 pages',          0, 20, 1000.00, 2, 2),
('PRD-0003', 'Stylo bleu',         'Stylo a bille bleu',                     0, 15, 250.00,  2, 2);

-- Les triggers mettent a jour quantite_disponible automatiquement
INSERT INTO mouvement_stock (quantite, type_mouvement, id_produit, id_gestionnaire) VALUES
(50,  'ENTREE', 1, 2),
(100, 'ENTREE', 2, 2),
(30,  'ENTREE', 3, 2),
(45,  'SORTIE', 1, 2);   -- stock = 5 <= seuil 10 : une alerte est generee

INSERT INTO inventaire (id_superviseur) VALUES (3);

INSERT INTO ligne_inventaire (id_inventaire, id_produit, quantite_theorique, quantite_reelle) VALUES
(1, 1, 5,   5),
(1, 2, 100, 98),
(1, 3, 30,  30);

-- ----------------------------------------------------------------------------
-- 13. REQUETES DE VERIFICATION
-- ----------------------------------------------------------------------------
SELECT id_produit, reference, nom, quantite_disponible, seuil_alerte FROM produit;
SELECT * FROM alerte;
SELECT * FROM v_produits_stock_faible;
SELECT * FROM ligne_inventaire;



-- Table de journalisation (audit) des opérations — classe JournalAudit
-- À exécuter sur la base gestion_stock :
--   mysql -h127.0.0.1 -uroot gestion_stock < Docs/files/journal_audit.sql

CREATE TABLE IF NOT EXISTS journal_audit (
  id_audit      INT          NOT NULL AUTO_INCREMENT,
  date_heure    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  action        VARCHAR(50)  NOT NULL,
  module        VARCHAR(50)  NOT NULL,
  type_objet    VARCHAR(50)  NOT NULL,
  id_objet      INT          DEFAULT NULL,
  description   VARCHAR(255) NOT NULL,
  PRIMARY KEY (id_audit),
  KEY idx_journal_audit_module (module),
  KEY idx_journal_audit_action (action),
  KEY idx_journal_audit_date (date_heure)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
