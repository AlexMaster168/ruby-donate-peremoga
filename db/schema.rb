# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_06_27_000002) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"
  enable_extension "pgcrypto"

  # Custom types defined in this database.
  # Note that some types may not work with other database engines. Be careful if changing database.
  create_enum "currency_type", ["UAH", "USD"]
  create_enum "news_type", ["news", "event"]
  create_enum "tickets_type", ["offer", "request"]
  create_enum "user_role", ["individual", "organization", "moderator", "admin"]

  create_table "active_admin_comments", force: :cascade do |t|
    t.bigint "author_id"
    t.string "author_type"
    t.text "body"
    t.datetime "created_at", null: false
    t.string "namespace"
    t.bigint "resource_id"
    t.string "resource_type"
    t.datetime "updated_at", null: false
    t.index ["author_type", "author_id"], name: "index_active_admin_comments_on_author"
    t.index ["namespace"], name: "index_active_admin_comments_on_namespace"
    t.index ["resource_type", "resource_id"], name: "index_active_admin_comments_on_resource"
  end

  create_table "active_storage_attachments", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.string "name", null: false
    t.bigint "record_id", null: false
    t.string "record_type", null: false
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.bigint "byte_size", null: false
    t.string "checksum"
    t.string "content_type"
    t.datetime "created_at", null: false
    t.string "filename", null: false
    t.string "key", null: false
    t.text "metadata"
    t.string "service_name", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

  create_table "admin_users", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "current_sign_in_at"
    t.string "current_sign_in_ip"
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.integer "failed_attempts", default: 0, null: false
    t.datetime "last_sign_in_at"
    t.string "last_sign_in_ip"
    t.datetime "locked_at"
    t.datetime "remember_created_at"
    t.datetime "reset_password_sent_at"
    t.string "reset_password_token"
    t.integer "sign_in_count", default: 0, null: false
    t.string "unlock_token"
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_admin_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_admin_users_on_reset_password_token", unique: true
  end

  create_table "categories", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "title"
    t.index ["title"], name: "index_categories_on_title", unique: true
  end

  create_table "comments", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.text "body", null: false
    t.datetime "created_at", null: false
    t.uuid "ticket_id", null: false
    t.datetime "updated_at", null: false
    t.uuid "user_id", null: false
    t.index ["ticket_id", "created_at"], name: "index_comments_on_ticket_id_and_created_at"
    t.index ["ticket_id"], name: "index_comments_on_ticket_id"
    t.index ["user_id"], name: "index_comments_on_user_id"
  end

  create_table "fundraisers", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "author_id", null: false
    t.datetime "created_at", null: false
    t.enum "currency", null: false, enum_type: "currency_type"
    t.text "description"
    t.string "image"
    t.decimal "raised", precision: 15, scale: 2, default: "0.0"
    t.string "title"
    t.decimal "total", precision: 15, scale: 2, null: false
    t.datetime "updated_at", null: false
    t.index ["author_id"], name: "index_fundraisers_on_author_id"
    t.index ["created_at"], name: "index_fundraisers_on_created_at"
    t.index ["currency", "total"], name: "index_fundraisers_on_currency_and_total"
    t.index ["currency"], name: "index_fundraisers_on_currency"
    t.index ["raised"], name: "index_fundraisers_on_raised"
    t.index ["title"], name: "index_fundraisers_on_title", unique: true
    t.index ["total"], name: "index_fundraisers_on_total"
    t.check_constraint "raised >= 0::numeric", name: "raised_value_check"
    t.check_constraint "total > 0::numeric", name: "total_value_check"
  end

  create_table "jwt_denylists", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "exp"
    t.string "jti"
    t.datetime "updated_at", null: false
    t.index ["jti"], name: "index_jwt_denylists_on_jti"
  end

  create_table "news_items", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "author_id", null: false
    t.datetime "created_at", null: false
    t.text "description"
    t.string "image"
    t.enum "kind", default: "news", null: false, enum_type: "news_type"
    t.string "title", null: false
    t.datetime "updated_at", null: false
    t.index ["author_id"], name: "index_news_items_on_author_id"
    t.index ["title"], name: "index_news_items_on_title", unique: true
    t.check_constraint "char_length(description) <= 500", name: "description_length_check"
  end

  create_table "tickets", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "author_id", null: false
    t.uuid "category_id", null: false
    t.datetime "created_at", null: false
    t.text "description"
    t.string "image"
    t.string "location"
    t.enum "ticket_type", null: false, enum_type: "tickets_type"
    t.string "title"
    t.datetime "updated_at", null: false
    t.index ["author_id"], name: "index_tickets_on_author_id"
    t.index ["category_id", "ticket_type"], name: "index_tickets_on_category_id_and_ticket_type"
    t.index ["category_id"], name: "index_tickets_on_category_id"
    t.index ["location"], name: "index_tickets_on_location"
    t.index ["ticket_type"], name: "index_tickets_on_ticket_type"
    t.index ["title"], name: "index_tickets_on_title"
    t.check_constraint "char_length(description) <= 500", name: "description_length_check"
  end

  create_table "users", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.text "biography"
    t.datetime "created_at", null: false
    t.datetime "current_sign_in_at"
    t.string "current_sign_in_ip"
    t.datetime "discarded_at", precision: nil
    t.string "email", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "first_name"
    t.string "last_name"
    t.datetime "last_sign_in_at"
    t.string "last_sign_in_ip"
    t.string "location"
    t.string "organization_name"
    t.datetime "remember_created_at"
    t.datetime "reset_password_sent_at"
    t.string "reset_password_token"
    t.enum "role", default: "individual", null: false, enum_type: "user_role"
    t.integer "sign_in_count", default: 0, null: false
    t.datetime "updated_at", null: false
    t.index ["discarded_at"], name: "index_users_on_discarded_at"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["last_name", "first_name"], name: "index_users_on_last_name_and_first_name"
    t.index ["organization_name"], name: "index_users_on_organization_name", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
    t.index ["role"], name: "index_users_on_role"
    t.check_constraint "char_length(biography) <= 500", name: "biography_length_check"
    t.check_constraint "role = 'individual'::user_role AND first_name IS NOT NULL AND last_name IS NOT NULL OR role = 'organization'::user_role AND organization_name IS NOT NULL OR (role = ANY (ARRAY['admin'::user_role, 'moderator'::user_role]))", name: "user_name_presence_by_role"
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
  add_foreign_key "comments", "tickets"
  add_foreign_key "comments", "users"
  add_foreign_key "fundraisers", "users", column: "author_id", on_delete: :cascade
  add_foreign_key "news_items", "users", column: "author_id", on_delete: :cascade
  add_foreign_key "tickets", "categories", on_delete: :cascade
  add_foreign_key "tickets", "users", column: "author_id"
end
