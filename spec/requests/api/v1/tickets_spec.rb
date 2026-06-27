# frozen_string_literal: true

require "swagger_helper"

RSpec.describe "Tickets API", type: :request do
  path "/api/v1/tickets" do
    get "List tickets" do
      tags "Tickets"
      produces "application/json"
      parameter name: :page, in: :query, type: :integer, required: false
      parameter name: :ticket_type, in: :query, type: :string, required: false, enum: %w[offer request]

      response "200", "tickets listed" do
        schema type: :object, properties: {
          data: { type: :array, items: { "$ref" => "#/components/schemas/TicketList" } },
          meta: { "$ref" => "#/components/schemas/Pagination" }
        }
        let!(:ticket) { create(:ticket) }
        run_test!
      end
    end

    post "Create ticket" do
      tags "Tickets"
      security [bearer_auth: []]
      consumes "multipart/form-data"
      produces "application/json"
      parameter name: :"ticket[title]", in: :formData, type: :string, required: true
      parameter name: :"ticket[description]", in: :formData, type: :string, required: true
      parameter name: :"ticket[location]", in: :formData, type: :string, required: true
      parameter name: :"ticket[ticket_type]", in: :formData, type: :string, required: true, enum: %w[offer request]
      parameter name: :"ticket[category_id]", in: :formData, type: :string, required: true

      response "201", "ticket created" do
        let(:user) { create(:user, :individual) }
        let(:Authorization) { "Bearer #{Warden::JWTAuth::UserEncoder.new.call(user, :user, nil).first}" }
        let!(:category) { create(:category) }
        let(:"ticket[title]") { "Need help" }
        let(:"ticket[description]") { "Description text" }
        let(:"ticket[location]") { "Kyiv" }
        let(:"ticket[ticket_type]") { "offer" }
        let(:"ticket[category_id]") { category.id }
        run_test!
      end
    end
  end

  path "/api/v1/tickets/{id}" do
    parameter name: :id, in: :path, type: :string, required: true

    get "Get ticket" do
      tags "Tickets"
      security [bearer_auth: []]
      produces "application/json"

      response "200", "ticket found" do
        schema type: :object, properties: {
          data: { "$ref" => "#/components/schemas/Ticket" }
        }
        let(:user) { create(:user, :individual) }
        let(:Authorization) { "Bearer #{Warden::JWTAuth::UserEncoder.new.call(user, :user, nil).first}" }
        let!(:ticket) { create(:ticket, author: user) }
        let(:id) { ticket.id }
        run_test!
      end
    end

    patch "Update ticket" do
      tags "Tickets"
      security [bearer_auth: []]
      consumes "application/json"
      produces "application/json"
      parameter name: :ticket_params, in: :body, schema: {
        type: :object,
        properties: {
          ticket: {
            type: :object,
            properties: {
              title: { type: :string },
              description: { type: :string }
            }
          }
        }
      }

      response "200", "ticket updated" do
        let(:user) { create(:user, :individual) }
        let(:Authorization) { "Bearer #{Warden::JWTAuth::UserEncoder.new.call(user, :user, nil).first}" }
        let!(:ticket) { create(:ticket, author: user) }
        let(:id) { ticket.id }
        let(:ticket_params) { { ticket: { title: "Updated" } } }
        run_test!
      end
    end

    delete "Delete ticket" do
      tags "Tickets"
      security [bearer_auth: []]
      produces "application/json"

      response "204", "ticket deleted" do
        let(:user) { create(:user, :individual) }
        let(:Authorization) { "Bearer #{Warden::JWTAuth::UserEncoder.new.call(user, :user, nil).first}" }
        let!(:ticket) { create(:ticket, author: user) }
        let(:id) { ticket.id }
        run_test!
      end
    end
  end
end
