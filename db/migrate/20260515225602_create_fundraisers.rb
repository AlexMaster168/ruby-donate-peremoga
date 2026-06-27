class CreateFundraisers < ActiveRecord::Migration[8.1]
  def change
    create_enum :currency_type, [ "UAH", "USD" ]

    create_table :fundraisers, id: :uuid do |t|
      t.string :title
      t.decimal :raised, precision: 15, scale: 2, default: 0.0
      t.decimal :total, precision: 15, scale: 2, null: false
      t.string :image
      t.enum :currency, enum_type: :currency_type, null: false
      t.references :author, type: :uuid, null: false, foreign_key: { to_table: :users, on_delete: :cascade }, index: true

      t.timestamps

      # Indexes
      t.index :title, unique: true
      t.index :currency
      t.index :raised
      t.index :total
      t.index :created_at
      t.index [ :currency, :total ]

      # Checks
      t.check_constraint "total > 0", name: "total_value_check"
      t.check_constraint "raised >= 0", name: "raised_value_check"
    end
  end
end
