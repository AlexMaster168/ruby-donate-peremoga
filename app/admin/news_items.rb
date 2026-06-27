# frozen_string_literal: true

ActiveAdmin.register NewsItem do
  permit_params :title,
                :description,
                :image,
                :kind,
                :author_id

  menu priority: 3, label: "News & Events"

  scope :all, default: true
  scope("News")      { |n| n.news_news }
  scope("Events")    { |n| n.news_event }

  filter :title
  filter :kind, as: :select, collection: NewsItem.kinds
  filter :author, as: :select,
         collection: -> { User.kept.organization.map { |u| [ u.organization_name, u.id ] } }
  filter :created_at

  index do
    selectable_column
    id_column
    column :title
    column :kind
    column(:author) { |n| n.author.organization_name }
    column :created_at
    actions
  end

  show do
    attributes_table do
      row :id
      row :title
      row :kind
      row(:author) { |n| link_to n.author.organization_name, admin_user_path(n.author) }
      row :description
      row(:image) { |n| image_tag(n.image) if n.image.present? }
      row :created_at
      row :updated_at
    end
  end

  form do |f|
    f.inputs "News Item Details" do
      f.input :title
      f.input :kind, as: :select, collection: NewsItem.kinds.keys
      f.input :author, as: :select,
              collection: User.kept.organization.map { |u| [ u.organization_name, u.id ] }
      f.input :description
      f.input :image
    end

    f.actions
  end

  member_action :discard, method: :patch do
    resource.discard
    redirect_to admin_news_items_path, notice: "News item soft-deleted."
  end

  member_action :undiscard, method: :patch do
    resource.undiscard
    redirect_to admin_news_items_path, notice: "News item restored."
  end
end
