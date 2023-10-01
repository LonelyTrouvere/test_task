ALTER TABLE "message" ALTER COLUMN "message" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "message" ADD COLUMN "file_path" text;