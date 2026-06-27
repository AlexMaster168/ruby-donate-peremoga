# frozen_string_literal: true

module Paginatable
  extend ActiveSupport::Concern

  DEFAULT_PER_PAGE = 20
  MAX_PER_PAGE     = 100

  private

  def paginate(scope)
    scope.page(params[:page]).per(per_page_param)
  end

  def per_page_param
    [
      params.fetch(:per_page, DEFAULT_PER_PAGE).to_i,
      MAX_PER_PAGE
    ].min
  end

  def pagination_meta(collection)
    {
      current_page:  collection.current_page,
      next_page:     collection.next_page,
      prev_page:     collection.prev_page,
      total_pages:   collection.total_pages,
      total_count:   collection.total_count,
      per_page:      collection.limit_value
    }
  end
end
