# frozen_string_literal: true

require "swagger_helper"

RSpec.describe "Search API", type: :request do
  path "/api/v1/search" do
    get "Search across entities" do
      tags "Search"
      produces "application/json"
      parameter name: :q, in: :query, type: :string, required: false
      parameter name: :scope, in: :query, type: :string, required: false, enum: %w[all tickets news fundraisers]

      response "200", "search results" do
        schema type: :object, properties: {
          data: {
            type: :object,
            properties: {
              tickets: { type: [:object, :null] },
              news_items: { type: [:object, :null] },
              fundraisers: { type: [:object, :null] }
            }
          }
        }
        run_test!
      end
    end
  end
end
