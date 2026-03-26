ALTER TABLE "User"
ADD COLUMN "phoneNumber" TEXT,
ADD COLUMN "phoneVerifiedAt" TIMESTAMP(3);

CREATE UNIQUE INDEX "User_phoneNumber_key" ON "User"("phoneNumber");
