BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Item] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [dateAdded] DATETIME2 NOT NULL CONSTRAINT [Item_dateAdded_df] DEFAULT CURRENT_TIMESTAMP,
    [dateModified] DATETIME2 NOT NULL CONSTRAINT [Item_dateModified_df] DEFAULT CURRENT_TIMESTAMP,
    [path] NVARCHAR(1000) NOT NULL,
    [isFolder] BIT NOT NULL CONSTRAINT [Item_isFolder_df] DEFAULT 0,
    [size] INT,
    CONSTRAINT [Item_pkey] PRIMARY KEY CLUSTERED ([id])
);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH