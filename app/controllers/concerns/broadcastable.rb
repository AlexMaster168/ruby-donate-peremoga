# frozen_string_literal: true

module Broadcastable
  extend ActiveSupport::Concern

  private

  def broadcast_new_ticket(ticket)
    ActionCable.server.broadcast(
      "news_feed",
      {
        type: "new_ticket",
        data: TicketSerializer.render(ticket)
      }
    )
  end

  def broadcast_new_news_item(news_item)
    ActionCable.server.broadcast(
      "news_feed",
      {
        type: "new_news_item",
        data: NewsItemSerializer.render(news_item)
      }
    )
  end

  def broadcast_fundraiser_update(fundraiser)
    ActionCable.server.broadcast(
      "news_feed",
      {
        type: "fundraiser_update",
        data: FundraiserSerializer.render(fundraiser)
      }
    )
  end

  def broadcast_to_user(user, payload)
    ActionCable.server.broadcast(
      "notifications_#{user.id}",
      payload
    )
  end
end
