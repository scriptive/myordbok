# table

## Lookup

```sql
select word,name,sense_no,definition,example
  from word_senses as w
  left join examples using (word_sense),definitions,word_types
    where equiv_word='UNGRATIFIED' and definitions.ID=w.ID and word_types.word_type=w.word_type order by binary word,w.word_type,sense_no;

```

## Derived forms

```sql
select derivation,word
  from derives,word_derive_type
    where root = 'love' and derived.derived_type=derived_types.derived_type;

-- get Derived
SELECT *
  FROM derives AS d, derivetype AS t
    WHERE d.derive = 'loves' and d.derive_type=t.derived_type;

-- get Base word
SELECT *
  FROM derives AS d
  INNER JOIN words w ON w.id = d.word_id
    WHERE d.derive = 'loves' AND d.word_type < 10;
-- contrastiveness
-- loves

SELECT *
  FROM derives AS d, words AS w
    WHERE d.derive = 'loves' and w.id=d.word_id;

SELECT *
  FROM derives AS d
  INNER JOIN words w ON w.id = d.word_id
    WHERE d.derive = 'loves';

SELECT w.id,w.word
  FROM derives AS d
  INNER JOIN words w ON w.id = d.word_id
    WHERE d.derive = 'loves' AND d.derive_type > 0 GROUP BY w.id;

-- get pos
SELECT *
  FROM words AS w, derives AS d
    WHERE w.word = 'define' AND d.word_id = w.id;
SELECT *
  FROM words AS w
  JOIN derives AS d ON d.word_id = w.id
    WHERE w.word LIKE 'define';
-- ??
SELECT *
  FROM derives AS d
    WHERE d.word = 'loved' AND d.derived_type > 0

SELECT *
  FROM derives AS d, words AS w
  JOIN words w ON w.id=d.word_id
    WHERE d.word = 'love'
```

## Synonyms

```sql
select distinct w2.word,w2.word_type
  from word_senses as w1,word_senses as w2
    where w1.equiv_word='LUCID' and w1.ID=w2.ID and w1.word_sense<>w2.word_sense order by w2.word_type,w2.word;
```

## antonym

```sql
SELECT *
  FROM wordantonym AS a, words AS w
    WHERE a.word_sense1 = w.word
```

## ?

```sql


SELECT * FROM words WHERE id ='151505';
SELECT * FROM words WHERE word ='loving';
SELECT * FROM senses WHERE word ='abandon';
SELECT * FROM words WHERE word ='ungratified';
SELECT * FROM wordantonym WHERE word_sense2 ='151505';
SELECT * FROM derives WHERE word ='loves';


SELECT * FROM words AS w
  JOIN senses s ON s.word <> w.word
  WHERE w.derived = 0;

-- No definition list
SELECT w.* FROM words AS w
  LEFT JOIN senses s ON s.word = w.word
  WHERE w.derived = 0 AND concat('',w.word * 1) != w.word AND s.word IS NULL;

SELECT w.* FROM words AS w
  LEFT JOIN senses s ON s.word = w.word
  WHERE w.derived = 0 AND w.word NOT REGEXP '^[0-9|.]+' AND s.word IS NULL;

SELECT w.* FROM words AS w
  LEFT JOIN senses s ON s.word = w.word
  WHERE w.derived = 0 AND w.word NOT REGEXP '[0-9|.|-| ]+' AND s.word IS NULL;

-- to be removed
SELECT w.* FROM words AS w
  LEFT JOIN senses s ON s.word = w.word
  WHERE w.derived = 0 AND w.word NOT REGEXP '[0-9|.|-| ]+' AND s.word IS NULL;