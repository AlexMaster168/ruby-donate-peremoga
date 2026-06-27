# frozen_string_literal: true

class AddModeratorAndAdminRolesToUsers < ActiveRecord::Migration[8.1]
  def up
    safety_assured do
      execute "ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'moderator'"
      execute "ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'admin'"
    end
  end

  def down
  end
end
