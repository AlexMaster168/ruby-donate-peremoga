# frozen_string_literal: true

module Api
  module V1
    class CommentsController < ApiController
      include Paginatable

      before_action :set_ticket
      before_action :set_comment, only: [:update, :destroy]

      def index
        comments = policy_scope(@ticket.comments).includes(:user).recent
        @comments = paginate(comments)
        render_success(
          CommentSerializer.render(@comments),
          meta: pagination_meta(@comments)
        )
      end

      def create
        @comment = @ticket.comments.build(comment_params.merge(user: current_user))
        authorize @comment
        @comment.save!
        broadcast_comment(@comment)
        render_success(CommentSerializer.render(@comment), :created)
      end

      def update
        authorize @comment
        @comment.update!(comment_params)
        render_success(CommentSerializer.render(@comment))
      end

      def destroy
        authorize @comment
        @comment.destroy!
        head :no_content
      end

      private

      def set_ticket
        @ticket = Ticket.find(params[:ticket_id])
      end

      def set_comment
        @comment = @ticket.comments.find(params[:id])
      end

      def comment_params
        params.require(:comment).permit(:body)
      end

      def broadcast_comment(comment)
        TicketChannel.broadcast_to(
          @ticket,
          {
            type: "new_comment",
            data: CommentSerializer.render(comment)
          }
        )
      rescue StandardError
        nil
      end
    end
  end
end
