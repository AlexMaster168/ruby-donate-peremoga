# frozen_string_literal: true

module Api
  module V1
    class CategoriesController < ApiController
      skip_before_action :authenticate_user!

      def index
        categories = Category.all.order(:title)
        render_success(CategorySerializer.render(categories))
      end
    end
  end
end
