# frozen_string_literal: true

class TicketsChannel < ApplicationCable::Channel
  def subscribed
    ticket = Ticket.find(params[:ticket_id])
    stream_for ticket
  end

  def unsubscribed
  end
end
