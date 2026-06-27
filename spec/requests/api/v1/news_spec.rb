# frozen_string_literal: true

require "swagger_helper"

RSpec.describe "News API", type: :request do
  path "/api/v1/news" do
    get "List news" do
      tags "News"
      produces "application/json"

      response "200", "news listed" do
        let!(:news_item) { create(:news_item) }
        run_test!
      end
    end

    post "Create news" do
      tags "News"
      security [bearer_auth: []]
      consumes "application/json"
      produces "application/json"
      parameter name: :news_item_params, in: :body, schema: {
        type: :object,
        properties: {
          news_item: {
            type: :object,
            properties: {
              title: { type: :string },
              description: { type: :string },
              kind: { type: :string, enum: %w[news event] }
            },
            required: %w[title description kind]
          }
        }
      }

      response "201", "news created" do
        let(:user) { create(:user, :organization) }
        let(:Authorization) { "Bearer #{Warden::JWTAuth::UserEncoder.new.call(user, :user, nil).first}" }
        let(:news_item_params) { { news_item: { title: "Breaking News", description: "Something happened", kind: "news" } } }
        run_test!
      end
    end
  end

  path "/api/v1/news/{id}" do
    parameter name: :id, in: :path, type: :string, required: true

    get "Get news" do
      tags "News"
      security [bearer_auth: []]
      produces "application/json"

      response "200", "news found" do
        let(:user) { create(:user, :organization) }
        let(:Authorization) { "Bearer #{Warden::JWTAuth::UserEncoder.new.call(user, :user, nil).first}" }
        let!(:news_item) { create(:news_item, author: user) }
        let(:id) { news_item.id }
        run_test!
      end
    end

    delete "Delete news" do
      tags "News"
      security [bearer_auth: []]
      produces "application/json"

      response "204", "news deleted" do
        let(:user) { create(:user, :organization) }
        let(:Authorization) { "Bearer #{Warden::JWTAuth::UserEncoder.new.call(user, :user, nil).first}" }
        let!(:news_item) { create(:news_item, author: user) }
        let(:id) { news_item.id }
        run_test!
      end
    end
  end
end
