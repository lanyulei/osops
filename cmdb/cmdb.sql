/* ----------------------------------- 创建host的数据结构(表) ----------------------------------- */
INSERT INTO `schema`(`name`) VALUE(`host`);

/* ----------------------------------- 创建类字段 ----------------------------------- */
INSERT INTO `field`(`name`, `meta`, `schema_id`) VALUE('hostname', '', 1);
INSERT INTO `field`(`name`, `meta`, `schema_id`) VALUE('ipaddress', '', 1);
INSERT INTO `field`(`name`, `meta`, `schema_id`) VALUE('ipaddress', '', 1);


/* ----------------------------------- 查询数据结构 ----------------------------------- */
SELECT `schema`.`name` AS `schema`, `field`.* FROM `schema`, `field` WHERE `schema`.id = `field`.`schema_id` AND `schema`.`name` = 'host';

/* ----------------------------------- 插入数据 ----------------------------------- */
INSERT INTO `entry`(`key`, `schema_id`) VALUE('57e533310373422897114c37d21f0f37', 1); -- 表示一条数据 --

INSERT INTO `value`(`entry_id`, `field_id`, `value`) VALUE(3,1,'cmdb.lanyulei.com'); -- 表示每个字段的值 --
INSERT INTO `value`(`entry_id`, `field_id`, `value`) VALUE(3,2,'10.1.1.1'); -- 表示每个字段的值 --

/* ----------------------------------- 数据的查询 ----------------------------------- */
SELECT `field`.`id` FROM `schema`, `field` WHERE `schema`.id = `field`.`schema_id` AND `schema`.`name` = 'host' AND `field`.`name` = 'ip';
SELECT `entry_id` FROM `value` WHERE `field_id` = 2 AND `value` = '10.1.1.1';
SELECT `field`.`name` AS `name`, `value`.`value` AS `value` FROM `value`, `field` WHERE `entry_id` = 1 AND `value`.`field_id` = `field`.`id`; 
SELECT `field`.`name` AS `name`, `value`.`value` AS `value`, `value`.`entry_id` AS `entry` FROM `value`, `field` WHERE `value`.`field_id` = `field`.`id`; 

/* ----------------------------------- unique ----------------------------------- */
SELECT `id` FROM `schema` WHERE `name` = 'host';
SELECT `id` FROM `field` WHERE `schema_id` = 1 AND `name` = 'hostname';
SELECT COUNT(id) AS `count` FROM `value` WHERE `field_id` = 1 AND `value` = 'cmdb.lanyulei.com';

SELECT 
  COUNT(`value`.`id`) AS `count` 
FROM
  `schema`,
  `field`,
  `value` 
WHERE `schema`.`id` = `field`.`schema_id` 
  AND `field`.`id` = `value`.`field_id` 
  AND `schema`.`name` = 'host' 
  AND `field`.`name` = 'hostname' 
  AND `value`.`value` = 'cmdb.lanyulei.com' ;

/* ----------------------------------- multi 多值字段，字段是否可存多值 ----------------------------------- */

-- * multi: false 数据存在的时候则对entry更新，不存在则直接插入entry表 --
SELECT id FROM `entry` WHERE `key` = '57e533310373422897114c37d21f0f35' AND `schema_id` = 1;
SELECT id FROM `field` WHERE `schema_id` = 1 AND `name` = 'hostname';
SELECT COUNT(id) AS `count` FROM `value` WHERE `entry_id` = 6 AND `field_id` = 1;

-- 存在 --
UPDATE ... (entry)

-- 不存在 --
INSERT ...  (entry)

-- * multi: True 数据存在则不做任何操作，不存在则插入数据 --
SELECT COUNT(id) AS `count` FROM `value` WHERE `entry_id` = 6 AND `field_id` = 1 AND `value` = 'cmdb.lanyulei.com';

-- 存在 不做任何操作 --

-- 不存在 --
INSERT ...

/* ----------------------------------- reference ----------------------------------- */
-- 定义schema时候需要做的校验 meta: 字段的描述信息 --
SELECT `field`.`meta` FROM `field`, `schema` WHERE `schema`.id = `field`.`schema_id` AND `schema`.`name` = 'host' AND `field`.`name` = 'hostname';

-- 插入数据的时候校验 先进行单表校验，例如：nullable，unique等等， 当nullable是True的时候on_delete是不能为set_null的 --
SELECT `field`.`id` FROM `field`, `schema` WHERE `schema`.id = `field`.`schema_id` AND `schema`.`name` = 'host' AND `field`.`name` = 'hostname';
SELECT COUNT(`id`) AS `count` FROM `value` WHERE `field_id` = 1 AND `value` = ?; -- 如果小于等于0则校验不通过，大于0则校验通过 --

-- 删除target数据 --
-- 1. 对field表做一次遍历，找出这个字段被那些表引用
-- 2. 根据被删除的值，查找source，删除对应的数据

-- 更新target数据 --
-- 1. `if cascade` 拿新值在source表上做验证，如果验证通过，更新，如果验证不通过，target更新失败。
-- 2. `if disable` 如果source表有值，target表更新失败。

SELECT * FROM `field` WHERE `reference` = ?;

/* ----------------------------------- 结构的变更 ----------------------------------- */
-- 结构变更中，数据类型禁止修改

-- nullable is true || (default is not null && unique is false)
-- reference 是否满足
-- 遍历entry给添加的字段set这个default值

-- * 删除字段 --
-- 唯一需要校验reference， 看是否被引用， 如果被引用则校验失败，否则校验成功设置为删除
-- 逻辑删除 当校验通过的时候，deleted设置为true则是删除数据，其他的不需要操作

-- * 修改字段 -- 
-- 主要是meta字段的修改
--   nullable的修改: false -> true 可以直接修改，true -> false，需要校验，校验现存的entry是否都满足
     -- select count(id) as `count` from `value` where `field_id` = ? and `entry_id` = ?;  -- 等于0则校验失败   慢

--   unique的修改: true -> false 直接修改即可， false -> true 需要校验，
     -- select count(id) as `count` from `value` where `field_id` = ?;
     -- select count(distinct `value`) as `count` from `value` where `field_id` = ?;  -- 如果这连个count是相等的则校验通过，反之则校验失败  慢
     
--   multi的修改: false -> true 直接修改即可， true -> false 需要校验数据
     -- select count(id) as `count` from `value` where `field_id` = ? and `entry_id` = ?;   -- 任何一个的count大于1的时候校验失败
      
--   删除reference: 直接删除即可，无需校验

--   增加reference: 需要校验，确定是否满足reference
     -- select count(s.id) as `count` from `value` as s, `value` as t where s.`value` != t.`value` and s.`field_id` = ? and t.`field_id` = ?;  -- 如果count大于0则说明校验么有通过，如果count等于0的话，则校验成功












