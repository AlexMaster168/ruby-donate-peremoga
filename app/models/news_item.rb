# frozen_string_literal: true

class NewsItem < ApplicationRecord
  include NewsItemConstants

  # Fix the relation to match your migration's author_id reference
  belongs_to :author, class_name: 'User', foreign_key: :author_id

  has_one_attached :image_file

  enum :kind, {
    news: 'news',
    event: 'event'
  }, prefix: :news

  # Validations
  validates :title,
    length: {
      maximum: NewsItemConstants::MAX_TITLE_LENGTH
    },
    format: {
      with: NewsItemConstants::VALID_NEWS_TITLE,
      message: :invalid_name_format
    },
    presence: true

  validates :image,
    length: {
      maximum: NewsItemConstants::MAX_IMAGE_LENGTH
    },
    allow_blank: true

  validates :description,
    length: { maximum: NewsItemConstants::MAX_DESCRIPTION_LENGTH },
    presence: true

  def self.ransackable_attributes(_auth_object = nil)
    [ "id", "title", "description", "kind", "created_at" ]
  end

  def self.ransackable_associations(_auth_object = nil)
    [ "author" ]
  end
end
