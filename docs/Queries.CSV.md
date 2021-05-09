# CSV

## list and map, no filter

... all words

| RootId |   Word   | is_derived |
|--------|:--------:|-----------:|
|   id   |   word   | is_derived |

```sql
SELECT
  a.id, a.word, a.is_derived
FROM
  `list_word` AS a
INTO OUTFILE '/tmp/myordbok/list-word.csv'
FIELDS ENCLOSED BY '"'
TERMINATED BY '|'
ESCAPED BY '"'
LINES TERMINATED BY '\r\n';

-- with header
(
  SELECT 'id', 'word', 'derived'
)
UNION ALL
(
  SELECT
    a.id, a.word, a.is_derived
  FROM
    `list_word` AS a
)
INTO OUTFILE '/tmp/myordbok/list-word.csv'
FIELDS ENCLOSED BY '"'
TERMINATED BY '\t'
ESCAPED BY '"'
LINES TERMINATED BY '\r\n';
```

... all sense

| RootId |  Word  | WordType |  Sense  |  Exam  | Sequence |
|--------|:------:|---------:|--------:|-------:|---------:|
|   id   |  word  |   wrte   |  sense  |  exam  |   wseq   |

```sql
SELECT
  a.id, a.word, a.wrte, REPLACE(a.sense, '\r\n', '\n'), REPLACE(COALESCE(a.exam,''), '\r\n', '\n'), a.wseq
FROM `list_sense` AS a
  WHERE a.word IS NOT NULL AND a.sense IS NOT NULL
    ORDER BY a.word, a.wseq ASC
INTO OUTFILE '/tmp/myordbok/list-sense.csv'
FIELDS ENCLOSED BY '"'
TERMINATED BY '|'
ESCAPED BY '"'
LINES TERMINATED BY '\r\n';

-- with header
(
  SELECT 'id', 'word', 'wrte', 'sense', 'exam', 'wseq'
)
UNION ALL
(
  SELECT
    a.id, a.word, a.wrte, REPLACE(a.sense, '\r\n', '\n'), REPLACE(COALESCE(a.exam,''), '\r\n', '\n'), a.wseq
  FROM `list_sense` AS a
    WHERE a.word IS NOT NULL AND a.sense IS NOT NULL AND DATE(dated) = '1981-07-08'
      ORDER BY a.word, a.wseq ASC LIMIT 10
)
INTO OUTFILE '/tmp/myordbok/list-sense.csv'
FIELDS ENCLOSED BY '"'
TERMINATED BY '\t'
ESCAPED BY '"'
OPTIONALLY ENCLOSED BY '"'
LINES TERMINATED BY '\r\n';
```

... map derive

| RootId |  WordId  | WordType | DeriveType | Irregular |
|--------|:--------:|---------:|-----------:|----------:|
|   id   |   wrid   |   wrte   |    dete    |   wirg    |

```sql
SELECT
  a.id, a.wrid, a.wrte, a.dete, a.wirg
FROM `map_derive` AS a
  ORDER BY a.wrid, a.wrte ASC
INTO OUTFILE '/tmp/myordbok/map-derive.csv'
FIELDS ENCLOSED BY '"'
TERMINATED BY '|'
ESCAPED BY '"'
LINES TERMINATED BY '\r\n';

-- with header
(
  SELECT 'id', 'wrid', 'wrte', 'dete', 'wirg'
)
UNION ALL
(
  SELECT
    a.id, a.wrid, a.wrte, a.dete, a.wirg
  FROM `map_derive` AS a
    ORDER BY a.wrid, a.wrte ASC
)
INTO OUTFILE '/tmp/myordbok/map-derive.csv'
FIELDS ENCLOSED BY '"'
TERMINATED BY '\t'
ESCAPED BY '"'
LINES TERMINATED BY '\r\n';
```

... map thesaurus

| WordId | WordId List |
|--------|:-----------:|
|  wrid  |    wlid     |

```sql
SELECT
  a.wrid, a.wlid
FROM `map_thesaurus` AS a
INTO OUTFILE '/tmp/myordbok/map-thesaurus.csv'
FIELDS ENCLOSED BY '"'
TERMINATED BY '|'
ESCAPED BY '"'
LINES TERMINATED BY '\r\n';

-- with header
(
  SELECT 'wrid', 'wlid'
)
UNION ALL
(
  SELECT
    a.wrid, a.wlid
  FROM `map_thesaurus` AS a
)
INTO OUTFILE '/tmp/myordbok/map-thesaurus.csv'
FIELDS ENCLOSED BY '"'
TERMINATED BY '\t'
ESCAPED BY '"'
LINES TERMINATED BY '\r\n';
```

## individual

... words, sense, usage

```sql

-- words

SELECT
  a.wrid, a.word
FROM `list_sense` AS a
  WHERE a.word IS NOT NULL
    GROUP BY a.wrid ORDER BY a.word ASC
INTO OUTFILE '/tmp/myordbok/sense-words.csv'
FIELDS ENCLOSED BY '"'
TERMINATED BY '|'
ESCAPED BY '"'
LINES TERMINATED BY '\r\n';

-- sense

SELECT
  a.id, a.wrid, a.wrte, a.sense
FROM `list_sense` AS a
  WHERE a.word IS NOT NULL AND a.sense IS NOT NULL
    ORDER BY a.wrte, a.wseq ASC
INTO OUTFILE '/tmp/myordbok/sense-sense.csv'
FIELDS ENCLOSED BY '"'
TERMINATED BY '|'
ESCAPED BY '"'
LINES TERMINATED BY '\r\n';

-- usage

SELECT
  a.id, a.exam
FROM `list_sense` AS a
  WHERE a.exam IS NOT NULL AND a.exam <> ''
    ORDER BY a.wrte, a.wseq ASC
INTO OUTFILE '/tmp/myordbok/sense-usage.csv'
FIELDS ENCLOSED BY '"'
TERMINATED BY ','
ESCAPED BY '"'
LINES TERMINATED BY '\r\n';
