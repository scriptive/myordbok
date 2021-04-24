# [usu. *.] [usu. *] [usu *]

“direction”
”)

```sql


UPDATE `list_sense` AS a set a.sense = TRIM(REPLACE(a.sense, '  ', ' ')) WHERE a.sense LIKE ' %';
UPDATE `list_sense` AS a set a.sense = REPLACE(a.sense, '  ', ' ') WHERE a.sense LIKE '%  %';
UPDATE `list_sense` AS a set a.exam = REPLACE(a.exam, '  ', ' ') WHERE a.exam LIKE '%  %';
UPDATE `list_sense` AS a set a.exam = NULL WHERE a.exam LIKE '';

SELECT * FROM list_sense WHERE sense LIKE '% ​%';
UPDATE `list_sense` AS a set a.sense = REPLACE(a.sense, ' ​', ' ') WHERE a.sense LIKE '% ​%';
UPDATE `list_sense` AS a set a.exam = REPLACE(a.exam, ' ​', ' ') WHERE a.exam LIKE '% ​%';

SELECT * FROM list_sense WHERE exam LIKE '%​%';
UPDATE `list_sense` AS a set a.sense = REPLACE(a.sense, '​', '') WHERE a.sense LIKE '%​%';

SELECT * FROM list_sense WHERE exam LIKE '%(2)%';
UPDATE `list_sense` AS a set a.exam = TRIM(REPLACE(a.exam, '(2)', ' ')) WHERE a.exam LIKE '%(2)%';
UPDATE `list_sense` AS a set a.exam = TRIM(REPLACE(a.exam, ' .', '')) WHERE a.exam LIKE '% .%';

SELECT * FROM list_sense WHERE exam LIKE '% ​%';

UPDATE `list_sense` AS a
  INNER JOIN (select id, word from `list_word` GROUP BY word) AS b ON a.word = b.word
  SET a.wrid = b.id;

-- CREATE TABLE "list_sense" (
--   "id"	INTEGER,
--   "word"	TEXT,
--   "wrte"	INTEGER,
--   "sense"	TEXT,
--   "exam"	TEXT,
--   "wseq"	INTEGER,
-- 	PRIMARY KEY("id" AUTOINCREMENT)
-- )

-- INSERT INTO `list_sense` (`id`, `word`, `wrte`, `sense`, `exam`, `wseq`) VALUES
-- 	(1, 'fat chance', 11, '(infml ironic) (often as an interj) အားကြီးရပါလိမ့်မယ်။', 'Maybe they'll let us in without tickets.\r\nFat chance (of that)!', 1),
-- 	(2, 'all by herself', 11, 'တစ်ကိုယ်တည်း။ အထီးတည်း။ ကိုယ်တိုင်။ ကိုယ့်ဘာသာကိုယ်။', 'She lives by herself.', 1),
-- 	(3, 'all by himself', 11, 'တစ်ကိုယ်တည်း။ အထီးတည်း။ ကိုယ်တိုင်။ သူ့ဘာသာသူ။', 'He lives all by himself in that large house.', 1),
-- 	(4, 'all by myself', 11, 'တစ်ကိုယ်တည်း။ ကိုယ့် ဘာသာကိုယ်။', 'I sat by myself in the waiting- room.', 1),
-- 	(5, 'all by oneself', 11, 'တစ်ဦးတည်း။ တစ်ကိုယ်တည်း။ ကိုယ်ထူး။ ကိုယ့်အားကိုယ်ကိုး။', NULL, 1);

(
  SELECT 'id', 'word', 'wrte', 'sense', 'exam', 'wseq'
)
UNION ALL
(
  SELECT
    a.id, a.word, a.wrte, REPLACE(a.sense, '\r\n', '\n'), REPLACE(COALESCE(a.exam,''), '\r\n', '\n'), a.wseq
  FROM `list_sense` AS a
    WHERE a.word IS NOT NULL AND a.sense IS NOT NULL
      ORDER BY a.word, a.wseq ASC LIMIT 10
)
INTO OUTFILE '/tmp/myordbok/list-sense-v5.csv'
FIELDS ENCLOSED BY '"'
TERMINATED BY '\t'
ESCAPED BY '"'
OPTIONALLY ENCLOSED BY '"'
LINES TERMINATED BY '\r\n';


UPDATE `senses` SET `sense` = REPLACE(`sense`, '“', '"') WHERE `sense` LIKE '“';
UPDATE `senses` SET `sense` = REPLACE(REPLACE(`sense`, '”', '"'), '“', '"') WHERE `sense` LIKE '%“%';
UPDATE `senses` SET `exam` = REPLACE(REPLACE(`exam`, '”', '"'), '“', '"') WHERE `exam` LIKE '%“%';

SELECT * FROM `senses` WHERE `sense` NOT LIKE '% %' AND `sense` NOT LIKE '%[%' AND `sense` LIKE '%a%';
SELECT * FROM `senses` WHERE LENGTH(REPLACE(`sense`, ')', '')) <> LENGTH(REPLACE(`sense`, '(', ''))
```

၄၅လက်မကျည်သုံး စက်သေနတ်ငယ်။


```sql
SELECT * FROM `db_en` WHERE `exam` LIKE '%[%' ORDER BY `word_id`, `state`, `seq` ASC
#SELECT * FROM `db_en` WHERE `exam` LIKE '%[%' AND (`exam` NOT LIKE '%[pos:%' AND `exam` NOT LIKE '%[with:%' AND `exam` NOT LIKE '%[list:%' AND `exam` NOT LIKE '%[also:%' AND `exam` NOT LIKE '%[abbr:%') ORDER BY `word_id`, `state`, `seq` ASC
#SELECT * FROM `db_en` WHERE `exam` LIKE '%[sentence]%' ORDER BY `word_id`, `state`, `seq` ASC
#SELECT * FROM `db_en` WHERE BINARY `exam` LIKE '%[%' ORDER BY `word_id`, `state`, `seq` ASC
#SELECT * FROM `db_en` WHERE `exam` LIKE '%[with %' ORDER BY `word_id`, `state`, `seq` ASC
#SELECT * FROM `db_en` WHERE `exam` LIKE '%adj%' ORDER BY `word_id`, `state`, `seq` ASC

#UPDATE `db_en` SET `exam` = REPLACE(`exam`, "[with]", "[with:]") WHERE `exam` IS NOT NULL;
#SELECT * FROM `db_en` WHERE `exam` LIKE '%[pos:A]%' ORDER BY `word_id`, `state`, `seq` ASC

#UPDATE `db_en` SET `exam` = REPLACE(`exam`, "/", "/") WHERE `exam` IS NOT NULL;
#UPDATE `db_en` SET `exam` = REPLACE(LTRIM(RTRIM(`exam`)), '  ', ' ') WHERE `exam` IS NOT NULL;
```

```sql
UPDATE `senses_copy` SET `sense` = REPLACE(`sense`, "[with]", "[with:]") WHERE `sense` IS NOT NULL;

UPDATE `senses_copy` SET `sense` = REPLACE(`sense`, "</b>,", "</b>/") WHERE `sense` LIKE '%</b>,%';
UPDATE `senses_copy` SET `sense` = REPLACE(`sense`, "</b>,", "</b>/") WHERE `sense` LIKE '%</b> ,%';
UPDATE `senses` SET `sense` = REPLACE(`sense`, "( <b>", "(<b>") WHERE `sense` LIKE '%( <b>%';
UPDATE `senses` SET `sense` = REPLACE(`sense`, "</b> )", "</b>)") WHERE `sense` LIKE '%</b> )%';

UPDATE `senses` SET `sense` = REPLACE(`sense`, "<b> ", "<b>") WHERE `sense` LIKE '%<b> %';
UPDATE `senses` SET `sense` = REPLACE(`sense`, " </b>", "</b>") WHERE `sense` LIKE '% </b>%';
UPDATE `senses` SET `sense` = REPLACE(`sense`, "</b>/ <b>", "</b>/<b>") WHERE `sense` LIKE '%</b>/ <b>%';
UPDATE `senses` SET `sense` = REPLACE(`sense`, "<b>- ", "<b>-") WHERE `sense` LIKE '%<b>- %';

UPDATE `senses` SET `sense` = REPLACE(`sense`, "</b> or <b>", "</b>/<b>") WHERE `sense` LIKE '%</b> or <b>%';
UPDATE `senses` SET `sense` = REPLACE(`sense`, "( ", "(") WHERE `sense` LIKE '%( %';
-- remove double spaces
UPDATE `senses` SET `sense` = REPLACE(`sense`, '  ', ' ') WHERE `sense` LIKE '%  %';

UPDATE `senses` SET `sense` = REPLACE(`sense`, "(fml)", "[fml]") WHERE `sense` LIKE '%(fml)%';
UPDATE `senses` SET `sense` = REPLACE(`sense`, "(infml)", "[infml]") WHERE `sense` LIKE '%(infml)%';
UPDATE `senses` SET `sense` = REPLACE(`sense`, "(Formal)", "[fml]") WHERE `sense` LIKE '%(Formal)%';
UPDATE `senses` SET `sense` = REPLACE(`sense`, "(Informal)", "[infml]") WHERE `sense` LIKE '%(Informal)%';

UPDATE `senses` SET `sense` = REPLACE(`sense`, "U.S.", "US") WHERE `sense` LIKE '%. <%';


SELECT * FROM `senses` WHERE `sense` LIKE '%\u200%';
SELECT * FROM `senses` WHERE `sense` LIKE '%.,%';

UPDATE `senses` SET `sense` = REPLACE(
  `sense`, "); (~", ";"
)
UPDATE `senses` SET `sense` = REPLACE(
  `sense`, "); ~", "; "
) WHERE `sense` LIKE '%); ~%';

REPLACE(`sense`, "</i> <b>", ":")
REPLACE(`sense`, "</b>)", "]")
REPLACE(`sense`, "(<i>", "[")

(~ to sth) (with sb) နှင့်လာသည်။ လိုက်သည်။
UPDATE `senses_test` SET `sense` = REPLACE(
  REPLACE(
    REPLACE(`sense`,"</b>", "]"),
    "<b>", ""
  ),
  "See ", "[see:"
) WHERE `sense` LIKE 'See %' AND `sense` LIKE '%</b>';

UPDATE `senses_test` SET `sense` = REPLACE(
  REPLACE(
    REPLACE(`sense`,"); ~", "; "),
    "; ~", ";"
  ),
  ";~ ", "; "
) WHERE `sense` LIKE '%; ~%';

REPLACE(
  `sense`,
  "<b>", ""
)
REPLACE(
  `sense`,
  "</b>", "]"
)
(~ on 1) |iˈlabəˌrāt|
|iˈlabəˌrāt| (~ on 2)
(~ on 3) |iˈlabəˌrāt| (~ on 4)
regexp_replace('Randy Orton','(.*) (.*)','\2, \1')
regexp_replace('Randy Orton','/(.*)/','-done-')


UPDATE `senses` SET `word` = NULL WHERE `sense` LIKE 'past%';
SELECT * FROM `senses` WHERE `word` IS NULL;
UPDATE `senses` SET `tid` = 0, `sense` = NULL, `exam` = NULL, `seq` = 0, `kid` = 0, `wid` = 0 WHERE `word` IS NULL;

-- SELECT * from senses WHERE sense LIKE '%<b>%';
-- SELECT * FROM `senses` WHERE `sense` LIKE '%<i>%' AND `sense` LIKE '%<b>%';
-- SELECT * FROM `senses` WHERE `sense` LIKE '%<b>%' AND tid = 8;
-- SELECT * FROM `senses` WHERE tid = 8;
-- SELECT * FROM `senses` WHERE `word` IS NULL;
-- SELECT * FROM `senses` WHERE `sense` LIKE '%past & past part%';

UPDATE `ord_ar` SET `sense` = REPLACE(`sense`, ",", ";") WHERE `sense` LIKE '%,%';

UPDATE `senses_test` SET `sense` = REGEXP_REPLACE(`sense`,'(.*)|.*|(.*)','\2, - \1') WHERE `sense` LIKE '%|%|%';

UPDATE `senses` SET `sense` = REPLACE(`sense`, "~ sth (", "(~ sth ") WHERE `sense` LIKE '%~ sth (%';
UPDATE `senses` SET `sense` = REPLACE(`sense`, "~ sth(", "(~ sth ") WHERE `sense` LIKE '%~ sth(%';
UPDATE `senses` SET `sense` = REPLACE(`sense`, "~ sb (", "(~ sb ") WHERE `sense` LIKE '%~ sb (%';


UPDATE `ord_ar` SET `sense` = REPLACE(`sense`, ",", ";") WHERE `sense` LIKE '%,%';
```

46893
inguinal

[fml]
[infml]

[latin:exempli gratia] သာဓကအနေဖြင့်။
(usu. <b>Chase</b>) = STEEPLECHASE ၁

(Brit infml) 	VACATION

~ sth ( -> (~ sth
(Brit., also <b>baulk</b>)
formal fml
informal infml
~ (for/in sth); ~ (to do sth) (fml) -> (~ for/in sth; ~ to do sth) (fml)

); (~

forming names of [list:organic compounds/pharmaceutical products/proteins] etc. : <i>insulin | penicillin | dioxin.</i>
[list:insulin/penicillin/dioxin]
[~:insulin]
ဝှေးစေ့။ လစေ့။ (also <b>ballocks</b> or <b>bollix</b>) [ in pl. ] (Brit., vulgar slang )

(also <b>doggie-paddle</b>) ခွေးကူး။
( <b>dog-eared</b>) ထောင့်လိပ်နေသော၊ ပေလိပ်နေသော (စာရွက်များ)။
(also <b>-spherical</b> (forming adjs) : <i>atmospheric.</i>
(US <b>- meter</b>) 	(တစ်မီတာ၏ အစိတ် အပိုင်း/ပမာဏကို ဖော်ပြသော နောက်ဆက်)။
See <b>analytic</b>


<b>the House</b> [sing] (Brit) = THE HOUSE OF COMMONS or THE HOUSE OF LORDS: <i>enter the House (ie become an MP).</i>

[list:INCORPORATED]
(also <b>inc</b>) INCORPORATED: <i>Manhattan Drugstores Inc. </i>
[list:MILE] [US:mi]

cms?

distance to village 3mls
[list:metre/meter]
[list:INDEPENDENT] (candidate)
[list:CAPE]
[latin:circa]
[list:Her ROYAL HIGHNESS/His ROYAL HIGHNESS]
[latin:nota bene]

[italian:gran turismo]
(italian) အားကောင်း၍ အလွန်ဆွဲသောကား

[list:PAIR] (giving position or direction)
giving position or direction (L to R: Gordon, Anthony, Jerry, and Mark.)
[list:kilometres per hour]
[list:Personal Equity Plan]
[UK:police constable]

[UK:postal order]

[list:pint] ပိုင့် (ချင့်ဝန်)
[list:vanadium] (ကဗျာ) အပိုဒ်
(US <b>Pvt</b>) private (soldier). တပ်သား (ရာထူးအဆင့်)
(also <b>Sergt</b>) sergeant
(pl <b>vv</b>) (ကဗျာ) အပိုဒ်။
[list:versus] (ယှဉ်ပြိုင်ဘက်၊ ဆန့်ကျင်ဘက်အဖြစ်ပြသည့်စကား)။ …နှင့်…(ပွဲ) (သို့) (တရားလို)နှင့် (တရားခံ၊ တရားပြိုင်)။

the chemical element (vanadium).

Søkeresultater
Nettresultater

[list:also known as] (as a courtesy title of priests)
[latin:et alii/alia]

နံနက်ပိုင်း
(Latin ante meridiam) It starts at 10 am.
[latin:Ante meridiem] နံနက်ပိုင်း
[esp Brit:annual general meeting] နှစ်ပတ်လည်အထွေထွေအစည်းအဝေး
နှစ်ပတ်လည်အစည်းအဝေး
annual meeting

[radio:amplitude modulation]
[radio:Amplitude Modulation]
(radio) Amplitude Modulation.
ရေဒီယိုလှိုင်း၏ အစောက်ပမာဏကို ပြုပြင်ပေးခြင်းဖြင့် လွှင့်ထုတ်သည့် အသံလွှင့်နည်း
1. လွှဲခွင် Modulation
[list:physical training]
ဘယ်ရွန်ဘွဲ့

British Broadcasting Corporation
[list:United Nations Organization]

United Nations High Commissioner for Refugees

ကုလသမဂ္ဂ ဒုက္ခသည်များဆိုင်ရာမဟာမင်းကြီးရုံး

physical training ကိုယ်လက်ကြံ့ခိုင်ရေး လေ့ကျင့်ခန်း

SELECT * FROM `senses` WHERE `sense` LIKE 'comparative%';