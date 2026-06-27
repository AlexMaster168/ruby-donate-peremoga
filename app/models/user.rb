# frozen_string_literal: true

class User < ApplicationRecord
  include Discard::Model
  include UserConstants

  has_many :news_items, class_name: 'NewsItem', foreign_key: :author_id, dependent: :destroy
  has_many :tickets
  has_many :fundraisers
  has_many :comments, dependent: :destroy

  has_one_attached :avatar

  devise :database_authenticatable, :recoverable, :rememberable, :validatable, :jwt_authenticatable, jwt_revocation_strategy: JwtDenylist

  ROLES = %w[individual organization moderator admin].freeze

  scope :individual,   -> { where(role: "individual") }
  scope :organization, -> { where(role: "organization") }
  scope :moderator,    -> { where(role: "moderator") }
  scope :admin,        -> { where(role: "admin") }

  def individual?   = role == "individual"
  def organization? = role == "organization"
  def moderator?    = role == "moderator"
  def admin?        = role == "admin"

  validates :role, inclusion: { in: ROLES }, presence: true

  # Validations
  validates :first_name,
    length: {
      maximum: UserConstants::MAX_FIRST_NAME_LENGTH
    },
    format: {
      with: UserConstants::VALID_FORMAT_NAME,
      message: :invalid_name_format
    },
    allow_blank: true

  validates :last_name,
    length: {
      maximum: UserConstants::MAX_LAST_NAME_LENGTH
    },
    format: {
      with: UserConstants::VALID_FORMAT_NAME,
      message: :invalid_name_format
    },
    allow_blank: true

  validates :organization_name,
    length: {
      maximum: UserConstants::MAX_ORGANIZATION_NAME_LENGTH
    },
    format: {
      with: UserConstants::VALID_FORMAT_ORGANIZATION_NAME,
      message: :invalid_name_format
    },
    allow_blank: true

  validates :email,
    length: {
      minimum: UserConstants::MIN_EMAIL_LENGTH,
      maximum: UserConstants::MAX_EMAIL_LENGTH
    },
    format: {
      with: UserConstants::VALID_EMAIL_FORMAT,
      message: :invalid_email_format
    },
    presence: true

  validates :biography,
    length: { maximum: UserConstants::MAX_BIOGRAPHY_LENGTH },
    allow_blank: true

  # Roles block:
  validates :first_name, :last_name,
    presence: true,
    if: :individual?

  validates :organization_name,
    presence: true,
    if: :organization?

  validates :organization_name,
    absence: true,
    if: :individual?

  validates :first_name, :last_name,
    absence: true,
    if: :organization?

  def self.ransackable_associations(_auth_object = nil)
    [ "news_items" ]
  end

  def self.ransackable_attributes(_auth_object = nil)
    [
      "id", "email", "role", "first_name", "last_name",
      "organization_name", "location", "created_at", "discarded_at"
    ]
  end
end
