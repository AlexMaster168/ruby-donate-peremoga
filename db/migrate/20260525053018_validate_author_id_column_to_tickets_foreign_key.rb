class ValidateAuthorIdColumnToTicketsForeignKey < ActiveRecord::Migration[8.1]
  def change
    validate_foreign_key :tickets, :users, column: :author_id
  end
end
