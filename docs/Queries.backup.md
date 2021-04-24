# Backup

```sql
CREATE TABLE en_sense AS SELECT * FROM en_define;
CREATE TABLE en_exam AS SELECT * FROM en_describe;
RENAME TABLE en_usage TO  en_exam;
ALTER TABLE en_src CHANGE `usage` `exam` TEXT NULL;
RENAME TABLE db_en TO  en_src;
RENAME TABLE db_en_org TO  en_src_org;


ALTER TABLE en_suggest CHANGE `mean` `sense` TEXT NULL;


ALTER TABLE da_word CHANGE `define` `sense` TEXT NULL, CHANGE `describe` `exam` TEXT NULL;
ALTER TABLE de_word CHANGE `define` `sense` TEXT NULL, CHANGE `describe` `exam` TEXT NULL;
ALTER TABLE el_word CHANGE `define` `sense` TEXT NULL, CHANGE `describe` `exam` TEXT NULL;
ALTER TABLE es_word CHANGE `define` `sense` TEXT NULL, CHANGE `describe` `exam` TEXT NULL;
ALTER TABLE fi_word CHANGE `define` `sense` TEXT NULL, CHANGE `describe` `exam` TEXT NULL;
ALTER TABLE fr_word CHANGE `define` `sense` TEXT NULL, CHANGE `describe` `exam` TEXT NULL;
ALTER TABLE hi_word CHANGE `define` `sense` TEXT NULL, CHANGE `describe` `exam` TEXT NULL;
ALTER TABLE iw_word CHANGE `define` `sense` TEXT NULL, CHANGE `describe` `exam` TEXT NULL;
ALTER TABLE ja_word CHANGE `define` `sense` TEXT NULL, CHANGE `describe` `exam` TEXT NULL;
ALTER TABLE ko_word CHANGE `define` `sense` TEXT NULL, CHANGE `describe` `exam` TEXT NULL;
ALTER TABLE ms_word CHANGE `define` `sense` TEXT NULL, CHANGE `describe` `exam` TEXT NULL;
ALTER TABLE nl_word CHANGE `define` `sense` TEXT NULL, CHANGE `describe` `exam` TEXT NULL;
ALTER TABLE no_word CHANGE `define` `sense` TEXT NULL, CHANGE `describe` `exam` TEXT NULL;
ALTER TABLE pl_word CHANGE `define` `sense` TEXT NULL, CHANGE `describe` `exam` TEXT NULL;
ALTER TABLE pt_word CHANGE `define` `sense` TEXT NULL, CHANGE `describe` `exam` TEXT NULL;
ALTER TABLE ro_word CHANGE `define` `sense` TEXT NULL, CHANGE `describe` `exam` TEXT NULL;
ALTER TABLE ru_word CHANGE `define` `sense` TEXT NULL, CHANGE `describe` `exam` TEXT NULL;
ALTER TABLE sv_word CHANGE `define` `sense` TEXT NULL, CHANGE `describe` `exam` TEXT NULL;
ALTER TABLE th_word CHANGE `define` `sense` TEXT NULL, CHANGE `describe` `exam` TEXT NULL;
ALTER TABLE tl_word CHANGE `define` `sense` TEXT NULL, CHANGE `describe` `exam` TEXT NULL;
ALTER TABLE vi_word CHANGE `define` `sense` TEXT NULL, CHANGE `describe` `exam` TEXT NULL;
ALTER TABLE zh_word CHANGE `define` `sense` TEXT NULL, CHANGE `describe` `exam` TEXT NULL;
```

First create a blank database:

```sql
CREATE DATABASE `myordbok_beta` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
```

Then use the command show tables;

```sql
show source.tables;
 ```

and then run the command for each DB table (Optimized Create table and inserting rows) as:

```sql
create table destination.table select * from source.table;
```

and other way is using like command:

```sql
  create table destination.table like source.table
```

and then inserting rows;

```sql
insert into destination.table select * from source.table
```