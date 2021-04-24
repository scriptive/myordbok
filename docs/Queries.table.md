# table

## Column definition

```bash
word Id -> wrid
word Type -> wrte
word Kind(?:sense) -> wrkd

wordId List -> wlid
word sequence -> wseq
word irregular -> wirg

derive Id -> deid
derive Type -> dete
```

## list - table

```sql

-- list_word

CREATE TABLE `list_word` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `word` VARCHAR(250) NULL DEFAULT NULL COLLATE 'utf8_bin',
  `is_derived` INT(1) NULL DEFAULT '0',
  `fr_thesaurus` INT(1) NULL DEFAULT '0',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `Key` (`id`, `word`) USING BTREE,
  FULLTEXT INDEX `Text` (`word`)
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB
ROW_FORMAT=COMPACT
AUTO_INCREMENT=295908;

-- list_sense

CREATE TABLE `list_sense` (
  `id` INT(10) NOT NULL AUTO_INCREMENT,
  `word` VARCHAR(250) NULL DEFAULT NULL COLLATE 'utf8_bin',
  `wrte` INT(2) NULL DEFAULT '0',
  `sense` TEXT NULL DEFAULT NULL COLLATE 'utf8_general_ci',
  `exam` TEXT NULL DEFAULT NULL COLLATE 'utf8_general_ci',
  `wseq` INT(2) NOT NULL DEFAULT '0',
  `wrkd` INT(2) NOT NULL DEFAULT '0',
  `wrid` INT(10) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `Index 3` (`word`) USING BTREE,
  FULLTEXT INDEX `Fulltext` (`word`)
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB
ROW_FORMAT=DYNAMIC
AUTO_INCREMENT=103582;

-- Sort by id
ALTER TABLE `list_sense` ORDER BY `word` ASC;

-- Reset id
ALTER TABLE `list_sense` DROP COLUMN `id`;
ALTER TABLE `list_sense`
  ADD COLUMN `id` INT(10) NOT NULL AUTO_INCREMENT FIRST,
  ADD PRIMARY KEY (`id`);

```

## map - table

```sql
-- map_derive

CREATE TABLE `map_derive` (
  `id` INT(11) NULL DEFAULT NULL,
  `wrid` INT(11) NOT NULL DEFAULT '0',
  `wrte` INT(2) NULL DEFAULT NULL,
  `dete` INT(2) NULL DEFAULT NULL,
  `wirg` INT(1) NULL DEFAULT NULL,
  INDEX `Index 2` (`wrid`) USING BTREE,
  INDEX `Key` (`id`) USING BTREE
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB
ROW_FORMAT=COMPACT;

-- map_thesaurus

CREATE TABLE `map_thesaurus` (
  `wrid` INT(11) NULL DEFAULT NULL,
  `wlid` INT(11) NULL DEFAULT NULL
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB;
```

## type - table

```sql

-- type_word

CREATE TABLE `type_word` (
  `word_type` INT(2) NOT NULL,
  `name` VARCHAR(50) NOT NULL DEFAULT '' COLLATE 'utf8_bin',
  `shortname` VARCHAR(5) NULL DEFAULT NULL COLLATE 'utf8_bin'
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB
ROW_FORMAT=COMPACT;

-- type_derive

CREATE TABLE `type_derive` (
  `derived_type` INT(2) NOT NULL AUTO_INCREMENT,
  `word_type` INT(2) NOT NULL,
  `derivation` VARCHAR(20) NULL DEFAULT NULL COLLATE 'utf8_bin',
  PRIMARY KEY (`derived_type`) USING BTREE
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB
ROW_FORMAT=COMPACT
AUTO_INCREMENT=11;

-- type_sense

CREATE TABLE `type_sense` (
  `id` INT(2) NOT NULL DEFAULT '0',
  `name` VARCHAR(250) NULL DEFAULT NULL COLLATE 'utf8_bin'
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB
ROW_FORMAT=DYNAMIC;
```

## ord - table

```sql

CREATE TABLE `ord_ar` (
  `id` INT(30) NOT NULL AUTO_INCREMENT,
  `word` VARCHAR(250) NULL DEFAULT NULL COLLATE 'utf8_general_ci',
  `sense` TEXT NULL DEFAULT NULL COLLATE 'utf8_general_ci',
  `usage` TEXT NULL DEFAULT NULL COLLATE 'utf8_general_ci',
  `status` INT(5) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `index` (`word`) USING BTREE
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB
ROW_FORMAT=COMPACT
AUTO_INCREMENT=2954;
