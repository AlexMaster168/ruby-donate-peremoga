# frozen_string_literal: true

module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :current_user

    def connect
      self.current_user = find_verified_user
    end

    private

    def find_verified_user
      verified_user = User.find_by(id: verified_jwt_user_id)
      verified_user || reject_unauthorized_connection
    end

    def verified_jwt_user_id
      token = request.params[:token]
      return nil unless token

      decoded = JWT.decode(token, nil, true, algorithm: "HS256") do |payload|
        payload
      end
      decoded.first["sub"]
    rescue JWT::DecodeError, JWT::ExpiredSignature
      nil
    end
  end
end
