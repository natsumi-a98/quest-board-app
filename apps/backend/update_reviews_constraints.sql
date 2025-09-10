-- 1. 既存データのquest_idを適切な値に更新
UPDATE reviews SET quest_id = 16 WHERE id IN (9, 10, 11); -- React開発スキル向上チャレンジ
UPDATE reviews SET quest_id = 17 WHERE id IN (13, 14); -- データベース設計の基礎を学ぶ
UPDATE reviews SET quest_id = 18 WHERE id = 15; -- チーム開発ワークフロー習得

-- 2. 外部キー制約を追加
ALTER TABLE reviews ADD CONSTRAINT reviews_quest_id_fkey
FOREIGN KEY (quest_id) REFERENCES quests(id);

-- 3. 一意性制約を追加（reviewer_id, quest_idの組み合わせ）
ALTER TABLE reviews ADD CONSTRAINT reviews_reviewer_quest_unique
UNIQUE (reviewer_id, quest_id);

-- 4. インデックスを追加
CREATE INDEX reviews_quest_id_fkey ON reviews(quest_id);
