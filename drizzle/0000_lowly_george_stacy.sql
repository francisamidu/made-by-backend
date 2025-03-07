CREATE SCHEMA "madeby";
--> statement-breakpoint
CREATE TABLE "madeby"."comments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"creator_id" uuid NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "madeby"."creators" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"avatar" text NOT NULL,
	"bio" text,
	"username" varchar(50),
	"location" varchar(100),
	"email" varchar(100),
	"banner_image" text,
	"is_available_for_hire" boolean DEFAULT false,
	"stats" jsonb DEFAULT '{"projectViews":0,"appreciations":0,"followers":0,"following":0}'::jsonb NOT NULL,
	"social_links" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"professional_info" jsonb DEFAULT '{"title":"","skills":[],"tools":[],"collaborators":[],"portfolioLink":""}'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "creators_username_unique" UNIQUE("username"),
	CONSTRAINT "creators_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "madeby"."follows" (
	"follower_id" uuid NOT NULL,
	"following_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "madeby"."projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"creator_id" uuid NOT NULL,
	"images" jsonb NOT NULL,
	"likes" integer DEFAULT 0 NOT NULL,
	"views" integer DEFAULT 0 NOT NULL,
	"tags" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "madeby"."comments" ADD CONSTRAINT "comments_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "madeby"."projects"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "madeby"."comments" ADD CONSTRAINT "comments_creator_id_creators_id_fk" FOREIGN KEY ("creator_id") REFERENCES "madeby"."creators"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "madeby"."follows" ADD CONSTRAINT "follows_follower_id_creators_id_fk" FOREIGN KEY ("follower_id") REFERENCES "madeby"."creators"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "madeby"."follows" ADD CONSTRAINT "follows_following_id_creators_id_fk" FOREIGN KEY ("following_id") REFERENCES "madeby"."creators"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "madeby"."projects" ADD CONSTRAINT "projects_creator_id_creators_id_fk" FOREIGN KEY ("creator_id") REFERENCES "madeby"."creators"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX "project_idx" ON "madeby"."comments" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "creator_idx" ON "madeby"."comments" USING btree ("creator_id");--> statement-breakpoint
CREATE INDEX "created_idx" ON "madeby"."comments" USING btree ("created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "username_idx" ON "madeby"."creators" USING btree ("username");--> statement-breakpoint
CREATE UNIQUE INDEX "email_idx" ON "madeby"."creators" USING btree ("email");--> statement-breakpoint
CREATE INDEX "location_idx" ON "madeby"."creators" USING btree ("location");--> statement-breakpoint
CREATE INDEX "available_idx" ON "madeby"."creators" USING btree ("is_available_for_hire");--> statement-breakpoint
CREATE UNIQUE INDEX "follower_following_idx" ON "madeby"."follows" USING btree ("follower_id","following_id");--> statement-breakpoint
CREATE INDEX "follower_idx" ON "madeby"."follows" USING btree ("follower_id");--> statement-breakpoint
CREATE INDEX "following_idx" ON "madeby"."follows" USING btree ("following_id");--> statement-breakpoint
CREATE INDEX "created_by_idx" ON "madeby"."projects" USING btree ("creator_id");--> statement-breakpoint
CREATE INDEX "likes_idx" ON "madeby"."projects" USING btree ("likes");--> statement-breakpoint
CREATE INDEX "views_idx" ON "madeby"."projects" USING btree ("views");--> statement-breakpoint
CREATE INDEX "created_on_idx" ON "madeby"."projects" USING btree ("created_at");