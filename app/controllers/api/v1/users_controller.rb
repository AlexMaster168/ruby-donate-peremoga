# frozen_string_literal: true

module Api
  module V1
    class UsersController < Api::ApiController
      skip_before_action :authenticate_user!, only: [ :create ]
      before_action :set_user, only: [ :show, :update, :destroy, :update_role ]

      def index
        @users = policy_scope(User.kept)
        render_success(UserSerializer.render(@users))
      end

      def show
        authorize @user
        render_success(UserSerializer.render(@user))
      end

      def create
        @user = User.create!(create_user_params)
        sign_in(@user)
        token = Warden::JWTAuth::UserEncoder.new.call(@user, :user, nil).first
        render json: {
          data: UserSerializer.render_as_hash(@user),
          token: token
        }, status: :created
      end

      def update
        authorize @user
        @user.update!(update_user_params)
        render_success(UserSerializer.render(@user))
      end

      def destroy
        authorize @user
        @user.discard
        head :no_content
      end

      def update_role
        authorize @user, :update_role?
        @user.update!(role: params.require(:user).permit(:role)[:role])
        render_success(UserSerializer.render(@user))
      end

      private

      def set_user
        @user = User.kept.find(params[:id])
      end

      def create_user_params
        params.require(:user).permit(
          :email,
          :password,
          :password_confirmation,
          :first_name,
          :last_name,
          :organization_name,
          :biography,
          :location,
          :role
        )
      end

      def update_user_params
        params.require(:user).permit(
          :first_name,
          :last_name,
          :organization_name,
          :biography,
          :location
        )
      end
    end
  end
end
