-- CreateTable
CREATE TABLE "Tracker" (
    "id" TEXT NOT NULL,
    "before" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "current" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "duration" BIGINT NOT NULL DEFAULT 0,
    "memberId" TEXT NOT NULL,

    CONSTRAINT "Tracker_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Tracker" ADD CONSTRAINT "Tracker_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
