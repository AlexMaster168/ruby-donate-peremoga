# frozen_string_literal: true

class SearchService
  def initialize(params)
    @query    = params[:q].to_s.strip
    @type     = params[:type]
    @scope    = params[:scope] || "all"
    @page     = params[:page]
    @per_page = params[:per_page]
    @category_id = params[:category_id]
    @location = params[:location]
    @currency = params[:currency]
  end

  def call
    case @scope
    when "tickets"      then search_tickets
    when "news"         then search_news_items
    when "fundraisers"  then search_fundraisers
    else search_all
    end
  end

  private

  def search_all
    {
      tickets: serialize_results(search_tickets, TicketSerializer),
      news_items: serialize_results(search_news_items, NewsItemSerializer),
      fundraisers: serialize_results(search_fundraisers, FundraiserSerializer)
    }
  end

  def search_tickets
    scope = Ticket.includes(:category, :author)
    scope = ilike_search(scope, @query) if @query.present?
    scope = scope.where(ticket_type: @type) if @type.present?
    scope = scope.where(category_id: @category_id) if @category_id.present?
    scope = scope.where("location ILIKE ?", "%#{@location}%") if @location.present?
    scope.order(created_at: :desc).page(@page).per(@per_page)
  end

  def search_news_items
    scope = NewsItem.includes(:author)
    scope = ilike_search(scope, @query) if @query.present?
    scope = scope.where(kind: @type) if @type.present?
    scope.order(created_at: :desc).page(@page).per(@per_page)
  end

  def search_fundraisers
    scope = Fundraiser.includes(:author)
    scope = ilike_search(scope, @query) if @query.present?
    scope = scope.where(currency: @currency) if @currency.present?
    scope.order(created_at: :desc).page(@page).per(@per_page)
  end

  def ilike_search(scope, query)
    pattern = "%#{query}%"
    scope.where("title ILIKE :q OR description ILIKE :q", q: pattern)
  end

  def serialize_results(collection, serializer)
    {
      data: JSON.parse(serializer.render(collection)),
      meta: {
        current_page: collection.current_page,
        total_pages: collection.total_pages,
        total_count: collection.total_count
      }
    }
  end
end
