-- 選定履歴を保存するテーブルを作成
CREATE TABLE SelectionHistory (
    HistoryID INT IDENTITY(1,1) PRIMARY KEY,
    ExecutedBy NVARCHAR(256) NOT NULL, -- 認証済みユーザーのEmailなど
    ExecutionTime DATETIME2 DEFAULT GETDATE(),
    SkuSelected NVARCHAR(100),
    Details NVARCHAR(MAX)
);
GO

-- （オプション）動作確認用のテストデータを挿入
INSERT INTO SelectionHistory (ExecutedBy, SkuSelected, Details)
VALUES ('test@example.com', 'RH00001', 'Initial test entry');
GO

-- 作成されたか確認
SELECT * FROM SelectionHistory;
GO
