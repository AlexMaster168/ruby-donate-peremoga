class CreateCategories < ActiveRecord::Migration[8.1]
  def change
    create_table :categories, id: :uuid do |t|
      t.string :title

      # Indexes
      t.index :title, unique: true
    end
  end
end
