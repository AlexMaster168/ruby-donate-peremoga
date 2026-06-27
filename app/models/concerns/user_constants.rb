# frozen_string_literal: true

module UserConstants
  extend ActiveSupport::Concern

  MAX_BIOGRAPHY_LENGTH = 500
  MIN_EMAIL_LENGTH = 5
  MAX_EMAIL_LENGTH = 258
  MAX_FIRST_NAME_LENGTH = 64
  MAX_LAST_NAME_LENGTH = 64
  MAX_ORGANIZATION_NAME_LENGTH = 255
  VALID_FORMAT_NAME = /\A[a-z\s-]+\z/i
  VALID_FORMAT_ORGANIZATION_NAME = /\A[\p{L}0-9\s\-\.\&']+\z/u
  VALID_EMAIL_FORMAT = /\A[a-zA-Z0-9_.\+\-]+@[a-zA-Z0-9\-]+\.[a-zA-Z0-9\-.]+\z/u
end
