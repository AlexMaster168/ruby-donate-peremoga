# frozen_string_literal: true

require "swagger_helper"

RSpec.describe "Comments API", type: :request do
  path "/api/v1/tickets/{ticket_id}/comments" do
    parameter name: :ticket_id, in: :path, type: :string, required: true

    get "List comments" do
      tags "Comments"
      security [bearer_auth: []]
      produces "application/json"

      response "200", "comments listed" do
        schema type: :object, properties: {
          data: { type: :array, items: { "$ref" => "#/components/schemas/Comment" } },
          meta: { "$ref" => "#/components/schemas/Pagination" }
        }
        let(:user) { create(:user, :individual) }
        let(:Authorization) { "Bearer #{Warden::JWTAuth::UserEncoder.new.call(user, :user, nil).first}" }
        let!(:ticket) { create(:ticket) }
        let(:ticket_id) { ticket.id }
        let!(:comment) { create(:comment, ticket: ticket) }
        run_test!
      end
    end

    post "Create comment" do
      tags "Comments"
      security [bearer_auth: []]
      consumes "application/json"
      produces "application/json"
      parameter name: :comment_params, in: :body, schema: {
        type: :object,
        properties: {
          comment: {
            type: :object,
            properties: {
              body: { type: :string }
            },
            required: %w[body]
          }
        }
      }

      response "201", "comment created" do
        let(:user) { create(:user, :individual) }
        let(:Authorization) { "Bearer #{Warden::JWTAuth::UserEncoder.new.call(user, :user, nil).first}" }
        let!(:ticket) { create(:ticket) }
        let(:ticket_id) { ticket.id }
        let(:comment_params) { { comment: { body: "Great!" } } }
        run_test!
      end
    end
  end
end
