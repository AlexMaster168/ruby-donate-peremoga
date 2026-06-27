class CreateNewsItems < ActiveRecord::Migration[8.1]
  def change
    create_enum :news_type, [ "news", "event" ]

    create_table :news_items, id: :uuid do |t|
      t.string :title, null: false
      t.text :description
      t.string :image
      t.enum :kind, enum_type: :news_type, default: "news", null: false
      t.references :author, type: :uuid, null: false, foreign_key: { to_table: :users, on_delete: :cascade }, index: true

      t.timestamps

      # Indexes
      t.index :title, unique: true

      # Checks
      t.check_constraint "char_length(description) <= 500", name: "description_length_check"
    end
  end
end
