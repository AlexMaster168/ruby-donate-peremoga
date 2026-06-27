# frozen_string_literal: true

class FixUserCheckConstraint < ActiveRecord::Migration[8.1]
  def up
    safety_assured do
      execute "ALTER TABLE users DROP CONSTRAINT IF EXISTS user_name_presence_by_role"
      execute <<~SQL
        ALTER TABLE users ADD CONSTRAINT user_name_presence_by_role
          CHECK (
            (role = 'individual'::user_role AND first_name IS NOT NULL AND last_name IS NOT NULL)
            OR (role = 'organization'::user_role AND organization_name IS NOT NULL)
            OR (role IN ('admin', 'moderator'))
          )
      SQL
    end
  end

  def down
    safety_assured do
      execute "ALTER TABLE users DROP CONSTRAINT IF EXISTS user_name_presence_by_role"
      execute <<~SQL
        ALTER TABLE users ADD CONSTRAINT user_name_presence_by_role
          CHECK (
            (role = 'individual'::user_role AND first_name IS NOT NULL AND last_name IS NOT NULL)
            OR (role = 'organization'::user_role AND organization_name IS NOT NULL)
          )
      SQL
    end
  end
end
