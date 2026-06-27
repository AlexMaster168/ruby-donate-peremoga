# frozen_string_literal: true

module CategoryConstants
  extend ActiveSupport::Concern

  MAX_TITLE_LENGTH = 64
  VALID_CATEGORY_TITLE = /\A[a-z\s-]+\z/i
end
