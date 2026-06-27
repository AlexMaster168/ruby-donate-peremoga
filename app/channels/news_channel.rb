# frozen_string_literal: true

class NewsChannel < ApplicationCable::Channel
  def subscribed
    stream_from "news_feed"
  end

  def unsubscribed
  end
end
