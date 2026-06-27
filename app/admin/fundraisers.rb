# frozen_string_literal: true

ActiveAdmin.register Fundraiser do
  permit_params :title,
                :image,
                :currency,
                :raised,
                :total,
                :author_id

  menu priority: 4, label: "Fundraisers"

  scope :all, default: true
  scope("UAH")       { |f| f.uah }
  scope("USD")       { |f| f.usd }
  scope("Completed") { |f| f.where("raised >= total") }

  filter :title
  filter :currency, as: :select, collection: Fundraiser::CURRENCIES
  filter :raised
  filter :total
  filter :author, as: :select,
         collection: -> { User.kept.organization.map { |u| [ u.organization_name, u.id ] } }
  filter :created_at

  index do
    selectable_column
    id_column
    column :title
    column :currency
    column :raised
    column :total
    column("Progress") { |f| "#{((f.raised / f.total) * 100).round(1)}%" }
    column(:author) { |f| f.author.organization_name }
    column :created_at
    actions
  end

  show do
    attributes_table do
      row :id
      row :title
      row(:author) { |f| link_to f.author.organization_name, admin_user_path(f.author) }
      row :currency
      row :raised
      row :total
      row("Progress") { |f| "#{((f.raised / f.total) * 100).round(1)}%" }
      row(:image) { |f| image_tag(f.image) if f.image.present? }
      row :created_at
      row :updated_at
    end
  end

  form do |f|
    f.inputs "Fundraiser Details" do
      f.input :title
      f.input :author, as: :select,
              collection: User.kept.organization.map { |u| [ u.organization_name, u.id ] }
      f.input :currency, as: :select, collection: Fundraiser::CURRENCIES
      f.input :total
      f.input :raised
      f.input :image
    end

    f.actions
  end

  member_action :discard, method: :patch do
    resource.discard
    redirect_to admin_fundraisers_path, notice: "Fundraiser soft-deleted."
  end

  member_action :undiscard, method: :patch do
    resource.undiscard
    redirect_to admin_fundraisers_path, notice: "Fundraiser restored."
  end
end
