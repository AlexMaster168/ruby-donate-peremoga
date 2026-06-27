# frozen_string_literal: true

module TicketConstants
  extend ActiveSupport::Concern

  MAX_TITLE_LENGTH = 64
  MAX_DESCRIPTION_LENGTH = 500
  MAX_IMAGE_LENGTH = 256
  VALID_TICKET_TITLE = /\A[\p{L}\p{N}\s\.,!?:;'"\(\)\-]+\z/u
  VALID_LOCATION = /\A[\p{L}\p{N}\s\.,:\(\)\-]+\z/u
end
