
/* translate */
{
  "info":{
    "msg": "???",
    "type": "translate"
  },
  "data":{
    "translate":{
      "word":{
        "_row":{
          "Noun":[
            {
              "sense":"??",
              "exam":[]
            }
          ],
          "Pronoun":[
            {
              "sense":"??",
              "exam":[]
            }
          ]
        }
      }
    }
  }
}
/* meaning */
{
  "info":{
    "msg": "???",
    "type": "meaning"
  },
  "data":{
    "word":{
      "_row":{
        "Noun":[
          {
            "sense":"??",
            "exam":[]
          }
        ],
        "Pronoun":[
          {
            "sense":"??",
            "exam":[]
          }
        ]
      }
    }
  }
}
```

```sql
SELECT * FROM en_word WHERE word LIKE 'test'

SELECT d.*,s.`exam`
  FROM `en_sense` d
  LEFT JOIN `en_exam` s
  ON s.`id` = d.`id`
  WHERE d.`wid` = ?
  ORDER BY d.`tid`, d.`sid` ASC

SELECT w.`word`,d.*,s.`exam`
  FROM `en_word` w
  JOIN `en_sense` d
   JOIN `en_exam` s
  ON s.`id` = d.`id` AND d.`wid` = w.`id`
  WHERE w.`word` LIKE 'a'
  ORDER BY d.`tid`, d.`sid` ASC

SELECT w.`word`,d.*,s.`exam`,g.`name` AS type
  FROM `en_word` w
	JOIN `en_sense` d
	JOIN `en_exam` s
	JOIN `en_type` g
  ON s.`id` = d.`id` AND d.`wid` = w.`id` AND g.`id` = d.`tid`
    WHERE w.`word` LIKE 'a'
      ORDER BY d.`tid`, d.`sid` ASC

<!-- Part of speech -->
SELECT
  w.`word_id` AS id, w.`word` AS word, d.`word` AS derive, d.`derived_type` AS d_type, d.`word_type` AS w_type, wt.`name` AS wame, dt.`derivation` AS dame
  FROM `ww_derive` AS d
    INNER JOIN `ww_word` w ON w.`word_id`=d.`root_id`
    INNER JOIN `ww_derive_type` dt ON dt.`derived_type`=d.`derived_type`
    INNER JOIN `ww_word_type` wt ON wt.`word_type`=d.`word_type`
  WHERE (d.`word`='love' OR w.`word`='love') and (d.`derived_type` <> 0 OR d.`word_type` = 0);

<!-- Synonyms -->
SELECT
  distinct w.word,w.word_type
  FROM ww_sense AS o, ww_sense AS w
    WHERE o.equiv_word='LOVE' AND o.ID=w.ID AND o.word_sense<>w.word_sense
      ORDER BY w.word_type,w.word;

<!-- Derived forms -->
SELECT derivation,word
  FROM `ww_derive` AS d, `ww_derive_type` AS t
    WHERE `root` = 'love' AND d.`derived_type`=t.`derived_type`;

<!-- result -->
SELECT word,name,sense_no,definition,example
  FROM ww_sense as w left join examples using (word_sense),definitions,word_types
    WHERE equiv_word='LOVE' and definitions.ID=w.ID and ww_word_type.word_type=w.word_type
      ORDER BY binary word,w.word_type,sense_no");

```