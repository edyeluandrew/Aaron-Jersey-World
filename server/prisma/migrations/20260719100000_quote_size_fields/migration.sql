-- AlterTable
ALTER TABLE "quote_requests" ADD COLUMN IF NOT EXISTS "selectedSize" TEXT;
ALTER TABLE "quote_requests" ADD COLUMN IF NOT EXISTS "selectedColour" TEXT;
ALTER TABLE "quote_requests" ADD COLUMN IF NOT EXISTS "sizeQuantities" TEXT;
