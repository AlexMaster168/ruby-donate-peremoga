class Fundraiser < ApplicationRecord
  include FundraiserConstants

  belongs_to :author, class_name: "User", foreign_key: :author_id

  has_one_attached :image_file

  CURRENCIES = %w[UAH USD].freeze

  scope :uah, -> { where(currency: "UAH") }
  scope :usd, -> { where(currency: "USD") }

  def uah? = self[:currency] == "UAH"
  def usd? = self[:currency] == "USD"

  validates :currency, inclusion: { in: CURRENCIES }, presence: true

  # Validations
  validates :title,
    length: {
      maximum: FundraiserConstants::MAX_TITLE_LENGTH
    },
    format: {
      with: FundraiserConstants::VALID_FUNDRAISER_TITLE,
      message: :invalid_name_format
    },
    presence: true

  validates :raised,
    numericality: {
      greater_than_or_equal_to: FundraiserConstants::MIN_SUM
    }

  validates :total,
    numericality: {
      greater_than: FundraiserConstants::MIN_SUM
    }

  validates :image,
    length: {
      maximum: FundraiserConstants::MAX_IMAGE_LENGTH
    },
    allow_blank: true

  def self.ransackable_attributes(_auth_object = nil)
    %w[author_id created_at description id image title currency raised total updated_at]
  end

  def self.ransackable_associations(_auth_object = nil)
    %w[author]
  end
end
