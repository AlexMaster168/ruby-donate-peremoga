# frozen_string_literal: true

ActiveAdmin.register Ticket do
  permit_params :title,
                :description,
                :location,
                :image,
                :ticket_type,
                :category_id,
                :author_id

  menu priority: 2, label: "Tickets"

  scope :all, default: true
  scope("Offers")    { |t| t.offer }
  scope("Requests")  { |t| t.request }

  filter :title
  filter :ticket_type, as: :select, collection: Ticket::TICKET_TYPES
  filter :category, as: :select, collection: -> { Category.all.map { |c| [ c.title, c.id ] } }
  filter :location
  filter :author, as: :select,
         collection: -> { User.kept.map { |u| [ u.email, u.id ] } }
  filter :created_at

  index do
    selectable_column
    id_column
    column :title
    column :ticket_type
    column :category
    column :location
    column(:author) { |t| t.author.email }
    column :created_at
    actions
  end

  show do
    attributes_table do
      row :id
      row :title
      row :ticket_type
      row :category
      row(:author) { |t| link_to t.author.email, admin_user_path(t.author) }
      row :location
      row :description
      row :image
      row :created_at
      row :updated_at
    end
  end

  form do |f|
    f.inputs "Ticket Details" do
      f.input :title
      f.input :ticket_type, as: :select, collection: Ticket::TICKET_TYPES
      f.input :category, as: :select,
              collection: Category.all.map { |c| [ c.title, c.id ] }
      f.input :author, as: :select,
              collection: User.kept.map { |u| [ u.email, u.id ] }
      f.input :location
      f.input :description
      f.input :image
    end

    f.actions
  end
end
