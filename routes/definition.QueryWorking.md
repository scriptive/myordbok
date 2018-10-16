# [usu. *.] [usu. *] [usu *]

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

အချို့သောအဘိဓါန်များတွင်
အချို့သောအများဆုံးအဘိဓါန်
