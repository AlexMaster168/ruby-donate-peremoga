# frozen_string_literal: true

module Api
  module V1
    class StatsController < ApiController
      before_action :require_admin!

      def overview
        render json: {
          data: {
            users: {
              total: User.kept.count,
              individuals: User.kept.individual.count,
              organizations: User.kept.organization.count,
              moderators: User.kept.moderator.count,
              admins: User.kept.admin.count
            },
            tickets: {
              total: Ticket.count,
              offers: Ticket.offer.count,
              requests: Ticket.request.count,
              by_category: tickets_by_category
            },
            fundraisers: {
              total: Fundraiser.count,
              total_raised_uah: Fundraiser.uah.sum(:raised),
              total_goal_uah: Fundraiser.uah.sum(:total),
              total_raised_usd: Fundraiser.usd.sum(:raised),
              total_goal_usd: Fundraiser.usd.sum(:total)
            },
            news: {
              total: NewsItem.count,
              news: NewsItem.news_news.count,
              events: NewsItem.news_event.count
            },
            comments: {
              total: Comment.count
            }
          }
        }, status: :ok
      end

      def fundraisers
        fundraisers = Fundraiser.includes(:author).order(created_at: :desc).page(params[:page]).per(params[:per_page])
        render json: {
          data: fundraisers.map { |f|
            {
              id: f.id,
              title: f.title,
              currency: f.currency,
              total: f.total,
              raised: f.raised,
              percentage: f.total.positive? ? (f.raised / f.total * 100).round(2) : 0,
              author: f.author.organization_name || f.author.email,
              created_at: f.created_at
            }
          },
          meta: {
            current_page: fundraisers.current_page,
            total_pages: fundraisers.total_pages,
            total_count: fundraisers.total_count
          }
        }, status: :ok
      end

      def tickets
        tickets = Ticket.includes(:category, :author).order(created_at: :desc).page(params[:page]).per(params[:per_page])
        render json: {
          data: TicketSerializer.render(tickets, view: :list),
          meta: {
            current_page: tickets.current_page,
            total_pages: tickets.total_pages,
            total_count: tickets.total_count,
            by_type: {
              offers: Ticket.offer.count,
              requests: Ticket.request.count
            },
            by_category: tickets_by_category
          }
        }, status: :ok
      end

      private

      def require_admin!
        unless current_user&.admin? || current_user.is_a?(AdminUser)
          render json: { error: "Forbidden" }, status: :forbidden
        end
      end

      def tickets_by_category
        Ticket.joins(:category)
              .group("categories.title")
              .count
      end
    end
  end
end
