class CreateUsers < ActiveRecord::Migration[8.1]
  def change
    create_enum :user_role, [ "individual", "organization" ]

    create_table :users, id: :uuid do |t|
      t.string :first_name
      t.string :last_name
      t.string :organization_name
      t.string :email, null: false
      t.enum :role, enum_type: :user_role, default: "individual", null: false
      t.string :location
      t.text :biography

      t.timestamps

      # Indexes
      t.index :email, unique: true
      t.index :role
      t.index [ :last_name, :first_name ]
      t.index [ :organization_name ], unique: true

      # Checks
      t.check_constraint "(role = 'individual' AND first_name IS NOT NULL AND last_name IS NOT NULL) OR
     (role = 'organization' AND organization_name IS NOT NULL)",
    name: "user_name_presence_by_role"
      t.check_constraint "char_length(biography) <= 500", name: "biography_length_check"
    end
  end
end
