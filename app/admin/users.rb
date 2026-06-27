# frozen_string_literal: true

ActiveAdmin.register User do
  permit_params :email, :password, :password_confirmation, :role,
                :first_name, :last_name, :organization_name,
                :location, :biography

  filter :email
  filter :role, as: :select, collection: -> { User::ROLES }
  filter :first_name
  filter :last_name
  filter :organization_name
  filter :location
  filter :created_at

  scope :all, default: true
  scope :kept, title: "Active Users"
  scope :discarded, title: "Archived Users"

  index do
    selectable_column
    id_column
    column :email
    column :role do |user|
      status_tag user.role, class: user.individual? ? 'important' : 'ok'
    end
    column "Name" do |user|
      user.individual? ? "#{user.first_name} #{user.last_name}" : user.organization_name
    end
    column :location
    column "Status" do |user|
      user.discarded? ? status_tag("Archived", class: "unset") : status_tag("Active", class: "yes")
    end
    column :created_at
    actions defaults: true do |user|
      if user.discarded?
        item "Restore", restore_admin_user_path(user), method: :put, class: "member_link"
      end
    end
  end

  show do
    attributes_table do
      row :id
      row :email
      row :role
      row :first_name if resource.individual?
      row :last_name if resource.individual?
      row :organization_name if resource.organization?
      row :location
      row :biography
      row :discarded_at if resource.discarded?
      row :sign_in_count
      row :current_sign_in_at
      row :last_sign_in_at
    end
    active_admin_comments
  end

  form do |f|
    f.inputs "Account Details" do
      f.input :email
      if f.object.new_record?
        f.input :password
        f.input :password_confirmation
      else
        f.input :password, placeholder: "Leave blank to keep current password", required: false
        f.input :password_confirmation, required: false
      end
    end

    f.inputs "Profile Information" do
      f.input :role, as: :select, collection: User::ROLES, include_blank: false
      f.input :first_name, hint: "Required if role is individual"
      f.input :last_name, hint: "Required if role is individual"
      f.input :organization_name, hint: "Required if role is organization"
      f.input :location
      f.input :biography, as: :text, input_html: { rows: 4 }
    end
    f.actions
  end

  controller do
    def update
      if params[:user][:password].blank? && params[:user][:password_confirmation].blank?
        params[:user].delete(:password)
        params[:user].delete(:password_confirmation)
      end
      super
    end

    def destroy
      resource.discard
      redirect_to admin_users_path, notice: "User successfully archived."
    end
  end

  member_action :restore, method: :put do
    resource.undiscard
    redirect_to admin_users_path, notice: "User record successfully reactivated."
  end
end
