# frozen_string_literal: true

module FundraiserConstants
  extend ActiveSupport::Concern

  MAX_TITLE_LENGTH = 128
  MIN_SUM = 0
  MAX_IMAGE_LENGTH = 256
  VALID_FUNDRAISER_TITLE = /\A[\p{L}\p{N}\s\.,!?:;'"\(\)\-]+\z/u
end
