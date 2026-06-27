# frozen_string_literal: true

module Api
  module V1
    class NewsItemsController < ApiController
      include Paginatable

      before_action :authenticate_user!, except: [ :index, :show ]

      before_action :set_news_item, only: [ :show, :update, :destroy ]

      # GET /api/v1/news_items
      # Supports filtering: kind (news|event)
      def index
        news_items = (authenticated? ? policy_scope(NewsItem) : NewsItem.all)
                       .includes(:author)
                       .then { |search| filter(search) }
                       .order(created_at: :desc)

        @news_items = paginate(news_items)

        render_success(
          NewsItemSerializer.render(@news_items, view: :list),
          meta: pagination_meta(@news_items)
        )
      end

      # GET /api/v1/news_items/:id
      def show
        authorize @news_item
        render_success(NewsItemSerializer.render(@news_item))
      end

      # POST /api/v1/news_items
      def create
        @news_item = NewsItem.new(news_item_params.except(:image_file).merge(author: current_user))
        authorize @news_item
        @news_item.save!
        if params[:news_item] && params[:news_item][:image_file]
          @news_item.image_file.attach(params[:news_item][:image_file])
        end
        @news_item.reload
        render_success(NewsItemSerializer.render(@news_item), :created)
      end

      # PATCH/PUT /api/v1/news_items/:id
      def update
        authorize @news_item
        @news_item.update!(news_item_params.except(:image_file))
        if params[:news_item] && params[:news_item][:image_file]
          @news_item.image_file.attach(params[:news_item][:image_file])
        end
        @news_item.reload
        render_success(NewsItemSerializer.render(@news_item))
      end

      # DELETE /api/v1/news_items/:id
      def destroy
        authorize @news_item
        @news_item.destroy!
        head :no_content
      end

      private

      def set_news_item
        @news_item = NewsItem.find(params[:id])
      end

      def news_item_params
        params.require(:news_item).permit(
          :title,
          :description,
          :image,
          :kind,
          :image_file
        )
      end

      def filter(scope)
        scope = scope.where(kind: params[:kind]) if params[:kind].present?
        scope
      end
    end
  end
end
