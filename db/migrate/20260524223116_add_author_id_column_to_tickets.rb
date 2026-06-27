class AddAuthorIdColumnToTickets < ActiveRecord::Migration[8.1]
  disable_ddl_transaction!

  def change
    add_column :tickets, :author_id, :uuid, null: false

    add_index :tickets, :author_id, algorithm: :concurrently unless index_exists?(:tickets, :author_id)
  end
end
