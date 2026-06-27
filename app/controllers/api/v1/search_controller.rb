# frozen_string_literal: true

module Api
  module V1
    class SearchController < ApiController
      skip_before_action :authenticate_user!

      def index
        results = SearchService.new(search_params).call
        render json: { data: results }, status: :ok
      end

      private

      def search_params
        params.permit(:q, :type, :scope, :page, :per_page, :category_id, :location, :currency)
      end
    end
  end
end
