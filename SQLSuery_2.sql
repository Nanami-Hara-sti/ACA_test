-- マネージドID（rg-test-hara-ca-back）のためのDBユーザーを作成
CREATE USER [rg-test-hara-ca-back] FROM EXTERNAL PROVIDER;

-- 作成したユーザーに、DBの読み取り/書き込み権限を付与
EXEC sp_addrolemember 'db_datareader', 'rg-test-hara-ca-back';
EXEC sp_addrolemember 'db_datawriter', 'rg-test-hara-ca-back';
GO
