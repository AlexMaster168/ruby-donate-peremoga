# frozen_string_literal: true

module Api
  class ApiController < ActionController::API
    include Pundit::Authorization

    rescue_from Pundit::NotAuthorizedError,   with: :render_forbidden
    rescue_from ActiveRecord::RecordNotFound,  with: :render_not_found
    rescue_from ActiveRecord::RecordInvalid,   with: :render_unprocessable_entity

    before_action :authenticate_user!

    def authenticate_user!
      render json: { error: 'Unauthorized' }, status: :unauthorized unless current_user
    end

    def authenticate_user
      current_user
    end

    protected

    def authenticated?
      current_user.present?
    end

    private

    def current_user
      @current_user ||= warden.authenticate(scope: :user)
    end

    def warden
      request.env['warden']
    end

    def render_forbidden
      render json: {
        error: 'Forbidden',
        message: 'You do not have permission to perform this action',
        code: :access_denied
      }, status: :forbidden
    end

    def render_not_found(exception)
      render json: {
        error: 'Resource not found',
        message: exception.message,
        code: :not_found
      }, status: :not_found
    end

    def render_unprocessable_entity(exception)
      record = exception.record
      render json: {
        errors: record.errors.map { |error|
          {
            attribute: error.attribute,
            message: error.message,
            code: error.type
          }
        }
      }, status: :unprocessable_entity
    end

    def render_success(data, status = :ok, meta: nil)
      payload = { data: JSON.parse(data) }
      payload[:meta] = meta if meta
      render json: payload, status:
    end
  end
end
