-- =====================================================================
-- QurbanChain — MySQL Schema
-- Jalankan: mysql -u root -p < schema.sql
-- =====================================================================
CREATE DATABASE IF NOT EXISTS qurbanchain
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE qurbanchain;

-- ---------- USERS ----------
CREATE TABLE IF NOT EXISTS users (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  name            VARCHAR(120) NOT NULL,
  email           VARCHAR(160) NOT NULL UNIQUE,
  phone           VARCHAR(30),
  password_hash   VARCHAR(255) NOT NULL,
  wallet_address  VARCHAR(64),
  role            ENUM('peserta','panitia','admin') DEFAULT 'peserta',
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_users_wallet (wallet_address)
) ENGINE=InnoDB;

-- ---------- ANIMALS ----------
CREATE TABLE IF NOT EXISTS animals (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  code            VARCHAR(20) NOT NULL UNIQUE,        -- ex: QC-001
  name            VARCHAR(120) NOT NULL,
  type            ENUM('sapi','kambing','domba') NOT NULL,
  weight_kg       DECIMAL(6,2) NOT NULL,
  price           DECIMAL(14,2) NOT NULL,
  peternak        VARCHAR(160),
  health_status   VARCHAR(40) DEFAULT 'Sehat',
  max_slots       TINYINT NOT NULL DEFAULT 1,          -- sapi=7, kambing/domba=1
  taken_slots     TINYINT NOT NULL DEFAULT 0,
  image_url       VARCHAR(255),
  status          ENUM('tersedia','penuh','disembelih','terdistribusi') DEFAULT 'tersedia',
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ---------- QURBAN PARTICIPANTS ----------
CREATE TABLE IF NOT EXISTS qurban_participants (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  user_id         INT NOT NULL,
  animal_id       INT NOT NULL,
  service_type    ENUM('patungan-sapi','kambing','domba','titip') NOT NULL,
  slot_number     TINYINT,                            -- 1..7 untuk patungan sapi
  total_amount    DECIMAL(14,2) NOT NULL,
  payment_method  ENUM('lunas','cicilan') DEFAULT 'lunas',
  status          ENUM('pending','aktif','lunas','batal') DEFAULT 'pending',
  onchain_id      VARCHAR(80),                        -- id participant on contract
  registered_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_part_user   FOREIGN KEY (user_id)   REFERENCES users(id)   ON DELETE CASCADE,
  CONSTRAINT fk_part_animal FOREIGN KEY (animal_id) REFERENCES animals(id) ON DELETE RESTRICT,
  UNIQUE KEY uniq_slot (animal_id, slot_number)
) ENGINE=InnoDB;

-- ---------- TRANSACTIONS (on-chain ledger) ----------
CREATE TABLE IF NOT EXISTS transactions (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  participant_id  INT NOT NULL,
  amount          DECIMAL(14,2) NOT NULL,
  tx_hash         VARCHAR(80) NOT NULL UNIQUE,
  block_number    BIGINT,
  from_address    VARCHAR(64),
  to_address      VARCHAR(64),
  status          ENUM('pending','confirmed','failed') DEFAULT 'pending',
  network         VARCHAR(40) DEFAULT 'ganache-local',
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_tx_participant FOREIGN KEY (participant_id) REFERENCES qurban_participants(id) ON DELETE CASCADE,
  INDEX idx_tx_hash (tx_hash)
) ENGINE=InnoDB;

-- ---------- PAYMENT INSTALLMENTS (cicilan) ----------
CREATE TABLE IF NOT EXISTS payment_installments (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  participant_id  INT NOT NULL,
  installment_no  TINYINT NOT NULL,
  amount          DECIMAL(14,2) NOT NULL,
  due_date        DATE NOT NULL,
  paid_at         TIMESTAMP NULL,
  transaction_id  INT NULL,
  status          ENUM('belum','lunas','terlambat') DEFAULT 'belum',
  CONSTRAINT fk_inst_participant FOREIGN KEY (participant_id) REFERENCES qurban_participants(id) ON DELETE CASCADE,
  CONSTRAINT fk_inst_transaction FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ---------- DISTRIBUTIONS ----------
CREATE TABLE IF NOT EXISTS distributions (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  animal_id       INT NOT NULL,
  area            VARCHAR(160) NOT NULL,
  recipients      INT NOT NULL DEFAULT 0,
  packages        INT NOT NULL DEFAULT 0,
  status          ENUM('terjadwal','berlangsung','selesai') DEFAULT 'terjadwal',
  scheduled_at    DATETIME,
  completed_at    DATETIME,
  tx_hash         VARCHAR(80),
  notes           TEXT,
  CONSTRAINT fk_dist_animal FOREIGN KEY (animal_id) REFERENCES animals(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------- SEED DATA ----------
INSERT IGNORE INTO animals (code,name,type,weight_kg,price,peternak,max_slots,taken_slots,status) VALUES
('QC-001','Sapi Limosin Premium','sapi',480,38000000,'H. Yusuf — Boyolali',7,5,'tersedia'),
('QC-002','Sapi Brahman','sapi',520,42000000,'PT Ternak Berkah',7,7,'penuh'),
('QC-003','Kambing Etawa','kambing',38,3500000,'Pak Salim — Garut',1,0,'tersedia'),
('QC-004','Domba Garut Jantan','domba',42,4200000,'Koperasi Tani Sejahtera',1,1,'penuh'),
('QC-005','Sapi Simmental','sapi',550,45000000,'H. Mahmud — Magetan',7,3,'tersedia'),
('QC-006','Kambing Jawarandu','kambing',35,3200000,'Pak Idris — Cianjur',1,0,'tersedia');
