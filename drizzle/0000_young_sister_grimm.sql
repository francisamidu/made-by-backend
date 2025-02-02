CREATE SCHEMA "medisync";
--> statement-breakpoint
CREATE TYPE "medisync"."terminology_status" AS ENUM('Draft', 'Reviewed', 'Approved');--> statement-breakpoint
CREATE TYPE "medisync"."user_roles" AS ENUM('Admin', 'Editor', 'Viewer');--> statement-breakpoint
CREATE TABLE "medisync"."categories" (
	"category_id" serial PRIMARY KEY NOT NULL,
	"category_name" varchar(100) NOT NULL,
	"description" text,
	"icon_url" varchar(255),
	"parent_category_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "medisync"."educational_insights" (
	"insight_id" serial PRIMARY KEY NOT NULL,
	"term_id" integer NOT NULL,
	"content" text NOT NULL,
	"content_type" varchar(50) DEFAULT 'text' NOT NULL,
	"media_url" varchar(255),
	"source" varchar(255),
	"is_approved" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "medisync"."search_logs" (
	"log_id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"search_query" varchar(255) NOT NULL,
	"search_time" timestamp DEFAULT now() NOT NULL,
	"ip_address" "inet",
	"device_info" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "medisync"."terminologies" (
	"term_id" serial PRIMARY KEY NOT NULL,
	"term" varchar(255) NOT NULL,
	"definition" text NOT NULL,
	"reference_url" varchar(255),
	"category_id" integer NOT NULL,
	"status" "medisync"."terminology_status" DEFAULT 'Draft' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "medisync"."users" (
	"user_id" serial PRIMARY KEY NOT NULL,
	"username" varchar(50) NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"email" varchar(100) NOT NULL,
	"role" "medisync"."user_roles" NOT NULL,
	"is_email_verified" boolean DEFAULT false NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "medisync"."categories" ADD CONSTRAINT "categories_parent_category_id_categories_category_id_fk" FOREIGN KEY ("parent_category_id") REFERENCES "medisync"."categories"("category_id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "medisync"."educational_insights" ADD CONSTRAINT "educational_insights_term_id_terminologies_term_id_fk" FOREIGN KEY ("term_id") REFERENCES "medisync"."terminologies"("term_id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "medisync"."search_logs" ADD CONSTRAINT "search_logs_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "medisync"."users"("user_id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "medisync"."terminologies" ADD CONSTRAINT "terminologies_category_id_categories_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "medisync"."categories"("category_id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE UNIQUE INDEX "category_name_idx" ON "medisync"."categories" USING btree ("category_name");--> statement-breakpoint
CREATE INDEX "parent_category_idx" ON "medisync"."categories" USING btree ("parent_category_id");--> statement-breakpoint
CREATE UNIQUE INDEX "insight_unique" ON "medisync"."educational_insights" USING btree ("insight_id");--> statement-breakpoint
CREATE INDEX "term_id_idx" ON "medisync"."educational_insights" USING btree ("term_id");--> statement-breakpoint
CREATE INDEX "is_approved_idx" ON "medisync"."educational_insights" USING btree ("is_approved");--> statement-breakpoint
CREATE UNIQUE INDEX "log_unique" ON "medisync"."search_logs" USING btree ("log_id");--> statement-breakpoint
CREATE INDEX "search_query_idx" ON "medisync"."search_logs" USING btree ("search_query");--> statement-breakpoint
CREATE INDEX "search_time_idx" ON "medisync"."search_logs" USING btree ("search_time");--> statement-breakpoint
CREATE UNIQUE INDEX "term_idx" ON "medisync"."terminologies" USING btree ("term");--> statement-breakpoint
CREATE INDEX "category_id_idx" ON "medisync"."terminologies" USING btree ("category_id");--> statement-breakpoint
CREATE UNIQUE INDEX "username_idx" ON "medisync"."users" USING btree ("username");--> statement-breakpoint
CREATE UNIQUE INDEX "email_idx" ON "medisync"."users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "is_active_idx" ON "medisync"."users" USING btree ("is_active");