
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
```