class Category < ApplicationRecord
  include CategoryConstants

  # Validations
  validates :title,
    length: {
      maximum: CategoryConstants::MAX_TITLE_LENGTH
    },
    format: {
      with: CategoryConstants::VALID_CATEGORY_TITLE,
      message: :invalid_name_format
    },
    presence: true
end
