# frozen_string_literal: true

class CreateComments < ActiveRecord::Migration[8.1]
  def change
    create_table :comments, id: :uuid do |t|
      t.references :user, null: false, foreign_key: true, type: :uuid
      t.references :ticket, null: false, foreign_key: true, type: :uuid
      t.text :body, null: false

      t.timestamps
    end

    add_index :comments, [:ticket_id, :created_at]
  end
end
