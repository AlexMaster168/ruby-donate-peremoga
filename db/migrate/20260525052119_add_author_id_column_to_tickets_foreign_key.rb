class AddAuthorIdColumnToTicketsForeignKey < ActiveRecord::Migration[8.1]
  def change
    add_foreign_key :tickets, :users,
      column: :author_id,
      validate: false
  end
end
