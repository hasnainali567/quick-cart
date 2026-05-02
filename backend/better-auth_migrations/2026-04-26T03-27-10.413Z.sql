alter table "user" add column "phone" text;

alter table "user" add column "role" text not null;

alter table "user" add column "isActive" boolean not null;

alter table "user" add column "isSuspended" boolean not null;

alter table "user" add column "phoneVerified" boolean not null;

alter table "user" add column "fcmToken" text;