# frozen_string_literal: true

class NewsItemSerializer < Blueprinter::Base
  identifier :id

  fields :title, :description, :image, :kind, :created_at, :updated_at

  field :image_url do |news_item, _opts|
    next unless news_item.image_file.attached?

    "/rails/active_storage/blobs/#{news_item.image_file.key}/#{news_item.image_file.filename}"
  end

  association :author, blueprint: UserSerializer

  view :list do
    fields :title, :kind, :created_at
    association :author, blueprint: UserSerializer
  end
end
