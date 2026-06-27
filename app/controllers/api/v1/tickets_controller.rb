# frozen_string_literal: true

module Api
  module V1
    class TicketsController < ApiController
      include Paginatable

      before_action :authenticate_user!, except: [ :index ]

      before_action :set_ticket, only: [ :show, :update, :destroy ]

      # GET /api/v1/tickets
      # Supports filtering via params: type, category_id, location
      def index
        tickets = (authenticated? ? policy_scope(Ticket) : Ticket.all)
                    .includes(:category, :author)
                    .then { |search| filter(search) }
                    .order(created_at: :desc)
        @tickets = paginate(tickets)
        render_success(
          TicketSerializer.render(@tickets, view: :list),
          meta: pagination_meta(@tickets)
        )
      end

      # GET /api/v1/tickets/:id
      def show
        authorize @ticket
        render_success(TicketSerializer.render(@ticket))
      end

      # POST /api/v1/tickets
      def create
        @ticket = Ticket.new(ticket_params.except(:image_file).merge(author: current_user))
        authorize @ticket
        @ticket.transaction do
          @ticket.save!
          attach_image(@ticket)
        end
        @ticket.reload
        render_success(TicketSerializer.render(@ticket), :created)
      end

      # PATCH/PUT /api/v1/tickets/:id
      def update
        authorize @ticket
        @ticket.transaction do
          @ticket.update!(ticket_params.except(:image_file))
          attach_image(@ticket)
        end
        @ticket.reload
        render_success(TicketSerializer.render(@ticket))
      end

      # DELETE /api/v1/tickets/:id
      def destroy
        authorize @ticket
        @ticket.destroy!
        head :no_content
      end

      private

      def set_ticket
        @ticket = Ticket.find(params[:id])
      end

      def ticket_params
        params.require(:ticket).permit(
          :title,
          :description,
          :location,
          :image,
          :ticket_type,
          :category_id,
          :image_file
        )
      end

      def attach_image(record)
        return unless params[:ticket] && params[:ticket][:image_file]

        record.image_file.attach(params[:ticket][:image_file])
      end

      def filter(scope)
        scope = scope.where(ticket_type: params[:ticket_type])              if params[:ticket_type].present?
        scope = scope.where(category_id: params[:category_id]) if params[:category_id].present?
        scope = scope.where("location ILIKE ?", "%#{params[:location]}%") if params[:location].present?
        scope = scope.where(author_id: params[:author_id]) if params[:author_id].present?
        scope
      end
    end
  end
end
