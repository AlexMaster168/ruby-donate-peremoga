# frozen_string_literal: true

class TicketSerializer < Blueprinter::Base
  identifier :id
  fields :title, :description, :location, :image, :ticket_type, :created_at, :updated_at

  field :image_url do |ticket, _opts|
    next unless ticket.image_file.attached?

    "/rails/active_storage/blobs/#{ticket.image_file.blob.signed_id}/#{ticket.image_file.filename}"
  end

  association :category, blueprint: CategorySerializer
  association :author, blueprint: UserSerializer do |ticket, _opts|
    ticket.author
  end

  view :list do
    fields :title, :ticket_type, :location, :created_at, :author_id
    association :category, blueprint: CategorySerializer
  end
end
