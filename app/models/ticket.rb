class Ticket < ApplicationRecord
  include TicketConstants

  belongs_to :author, class_name: "User"
  belongs_to :category

  has_many :comments, dependent: :destroy
  has_one_attached :image_file

  TICKET_TYPES = %w[offer request].freeze

  scope :offer,   -> { where(ticket_type: "offer") }
  scope :request, -> { where(ticket_type: "request") }

  def offer?   = ticket_type == "offer"
  def request? = ticket_type == "request"

  validates :ticket_type, inclusion: { in: TICKET_TYPES }, presence: true

  # Validations
  validates :title,
    length: {
      maximum: TicketConstants::MAX_TITLE_LENGTH
    },
    format: {
      with: TicketConstants::VALID_TICKET_TITLE,
      message: :invalid_name_format
    },
    presence: true

  validates :image,
    length: {
      maximum: TicketConstants::MAX_IMAGE_LENGTH
    },
    allow_blank: true

  validates :location,
    format: {
      with: TicketConstants::VALID_LOCATION,
      message: :invalid_name_format
    },
    presence: true

  validates :description,
    length: { maximum: TicketConstants::MAX_DESCRIPTION_LENGTH },
    presence: true

  def self.ransackable_attributes(_auth_object = nil)
    %w[author_id category_id created_at description id image location ticket_type title updated_at]
  end

  def self.ransackable_associations(_auth_object = nil)
    %w[author category]
  end
end
