# frozen_string_literal: true

class FundraiserSerializer < Blueprinter::Base
  identifier :id

  fields :title, :description, :image, :currency, :raised, :total, :created_at, :updated_at

  field :image_url do |fundraiser, _opts|
    next unless fundraiser.image_file.attached?

    "/rails/active_storage/blobs/#{fundraiser.image_file.key}/#{fundraiser.image_file.filename}"
  end

  field :progress_percent do |fundraiser, _opts|
    next 0 if fundraiser.total.zero?

    ((fundraiser.raised / fundraiser.total) * 100).round(2)
  end

  association :author, blueprint: UserSerializer

  view :list do
    fields :title, :currency, :raised, :total, :created_at
    field :progress_percent do |fundraiser, _opts|
      next 0 if fundraiser.total.zero?

      ((fundraiser.raised / fundraiser.total) * 100).round(2)
    end
    association :author, blueprint: UserSerializer
  end
end
