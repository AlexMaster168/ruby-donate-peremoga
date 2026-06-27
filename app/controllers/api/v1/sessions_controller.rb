module Api
  module V1
    class SessionsController < Devise::SessionsController
      respond_to :json
      skip_before_action :verify_authenticity_token

      def create
        user = User.find_by(email: params.dig(:user, :email)&.downcase&.strip)

        if user&.valid_password?(params.dig(:user, :password))
          sign_in(user)
          token = Warden::JWTAuth::UserEncoder.new.call(user, :user, nil).first
          render json: {
            data: UserSerializer.render_as_hash(user),
            token: token
          }, status: :ok
        else
          render json: { error: "Invalid email or password." }, status: :unauthorized
        end
      end

      def destroy
        token = request.headers["Authorization"]&.split(" ")&.last

        if token
          begin
            payload = JWT.decode(
              token,
              Rails.application.secret_key_base,
              true,
              algorithms: [ "HS256" ]
            ).first

            JwtDenylist.create!(jti: payload["jti"], exp: Time.at(payload["exp"]))
            render json: { message: "Logged out successfully." }, status: :ok
          rescue JWT::DecodeError, JWT::ExpiredSignature
            render json: { error: "Invalid or expired token." }, status: :unauthorized
          end
        else
          render json: { error: "No token provided." }, status: :unauthorized
        end
      end

      private

      def respond_with(_resource, _opts = {}); end
      def respond_to_on_destroy(*_args); end
    end
  end
end
