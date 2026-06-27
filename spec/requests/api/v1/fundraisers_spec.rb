# frozen_string_literal: true

require "swagger_helper"

RSpec.describe "Fundraisers API", type: :request do
  path "/api/v1/fundraisers" do
    get "List fundraisers" do
      tags "Fundraisers"
      produces "application/json"

      response "200", "fundraisers listed" do
        let!(:fundraiser) { create(:fundraiser) }
        run_test!
      end
    end

    post "Create fundraiser" do
      tags "Fundraisers"
      security [bearer_auth: []]
      consumes "application/json"
      produces "application/json"
      parameter name: :fundraiser_params, in: :body, schema: {
        type: :object,
        properties: {
          fundraiser: {
            type: :object,
            properties: {
              title: { type: :string },
              currency: { type: :string, enum: %w[UAH USD] },
              total: { type: :number }
            },
            required: %w[title currency total]
          }
        }
      }

      response "201", "fundraiser created" do
        let(:user) { create(:user, :organization) }
        let(:Authorization) { "Bearer #{Warden::JWTAuth::UserEncoder.new.call(user, :user, nil).first}" }
        let(:fundraiser_params) { { fundraiser: { title: "Help Fund", currency: "UAH", total: 10000 } } }
        run_test!
      end
    end
  end

  path "/api/v1/fundraisers/{id}" do
    parameter name: :id, in: :path, type: :string, required: true

    get "Get fundraiser" do
      tags "Fundraisers"
      security [bearer_auth: []]
      produces "application/json"

      response "200", "fundraiser found" do
        let(:user) { create(:user, :organization) }
        let(:Authorization) { "Bearer #{Warden::JWTAuth::UserEncoder.new.call(user, :user, nil).first}" }
        let!(:fundraiser) { create(:fundraiser, author: user) }
        let(:id) { fundraiser.id }
        run_test!
      end
    end

    delete "Delete fundraiser" do
      tags "Fundraisers"
      security [bearer_auth: []]
      produces "application/json"

      response "204", "fundraiser deleted" do
        let(:user) { create(:user, :organization) }
        let(:Authorization) { "Bearer #{Warden::JWTAuth::UserEncoder.new.call(user, :user, nil).first}" }
        let!(:fundraiser) { create(:fundraiser, author: user) }
        let(:id) { fundraiser.id }
        run_test!
      end
    end
  end
end
