class CreateTickets < ActiveRecord::Migration[8.1]
  def change
    create_enum :tickets_type, [ "offer", "request" ]

    create_table :tickets, id: :uuid do |t|
      t.string :title
      t.text :description
      t.string :location
      t.string :image
      t.enum :ticket_type, enum_type: :tickets_type, null: false
      t.references :category, type: :uuid, null: false, foreign_key: { on_delete: :cascade }, index: true

      t.timestamps

      # Indexes
      t.index :title
      t.index :ticket_type
      t.index :location
      t.index [ :category_id, :ticket_type ]

      # Checks
      t.check_constraint "char_length(description) <= 500", name: "description_length_check"
    end
  end
end
