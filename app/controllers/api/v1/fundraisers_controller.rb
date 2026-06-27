# frozen_string_literal: true

module Api
  module V1
    class FundraisersController < ApiController
      include Paginatable

      before_action :authenticate_user!, except: [ :index, :show ]

      before_action :set_fundraiser, only: [ :show, :update, :destroy ]

      # GET /api/v1/fundraisers
      def index
        fundraisers = (authenticated? ? policy_scope(Fundraiser) : Fundraiser.all)
                        .includes(:author)
                        .then { |search| filter(search) }
                        .order(created_at: :desc)

        @fundraisers = paginate(fundraisers)

        render_success(
          FundraiserSerializer.render(@fundraisers, view: :list),
          meta: pagination_meta(@fundraisers)
        )
      end

      # GET /api/v1/fundraisers/:id
      def show
        authorize @fundraiser
        render_success(FundraiserSerializer.render(@fundraiser))
      end

      # POST /api/v1/fundraisers
      def create
        @fundraiser = Fundraiser.new(fundraiser_create_params.except(:image_file).merge(author: current_user))
        authorize @fundraiser
        @fundraiser.save!
        if params[:fundraiser] && params[:fundraiser][:image_file]
          @fundraiser.image_file.attach(params[:fundraiser][:image_file])
        end
        @fundraiser.reload
        render_success(FundraiserSerializer.render(@fundraiser), :created)
      end

      # PATCH/PUT /api/v1/fundraisers/:id
      def update
        authorize @fundraiser
        @fundraiser.update!(fundraiser_update_params.except(:image_file))
        if params[:fundraiser] && params[:fundraiser][:image_file]
          @fundraiser.image_file.attach(params[:fundraiser][:image_file])
        end
        @fundraiser.reload
        render_success(FundraiserSerializer.render(@fundraiser))
      end

      # DELETE /api/v1/fundraisers/:id
      def destroy
        authorize @fundraiser
        @fundraiser.destroy!
        head :no_content
      end

      private

      def set_fundraiser
        @fundraiser = Fundraiser.find(params[:id])
      end

      def fundraiser_create_params
        params.require(:fundraiser).permit(
          :title,
          :description,
          :image,
          :currency,
          :total,
          :image_file
        )
      end

      def fundraiser_update_params
        params.require(:fundraiser).permit(
          :title,
          :description,
          :image,
          :raised,
          :image_file
        )
      end

      def filter(scope)
        scope = scope.where(currency: params[:currency]) if params[:currency].present?
        scope
      end
    end
  end
end
