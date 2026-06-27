# frozen_string_literal: true

module NewsItemConstants
  extend ActiveSupport::Concern

  MAX_TITLE_LENGTH = 256
  MAX_DESCRIPTION_LENGTH = 500
  MAX_IMAGE_LENGTH = 256
  VALID_NEWS_TITLE = /\A[\p{L}\p{N}\s\.,!?:;'"\(\)\-]+\z/u
end
