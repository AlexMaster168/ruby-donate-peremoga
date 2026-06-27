# frozen_string_literal: true

require "swagger_helper"

RSpec.describe "Auth API", type: :request do
  path "/api/v1/login" do
    post "Sign in" do
      tags "Auth"
      consumes "application/json"
      produces "application/json"
      parameter name: :credentials, in: :body, schema: {
        type: :object,
        properties: {
          user: {
            type: :object,
            properties: {
              email: { type: :string },
              password: { type: :string }
            },
            required: %w[email password]
          }
        }
      }

      response "200", "signed in" do
        schema type: :object, properties: {
          data: { "$ref" => "#/components/schemas/User" },
          token: { type: :string }
        }
        let!(:user) { User.create!(email: "login@test.com", password: "password123", password_confirmation: "password123", role: "individual", first_name: "Test", last_name: "User") }
        let(:credentials) { { user: { email: "login@test.com", password: "password123" } } }
        run_test!
      end

      response "401", "invalid credentials" do
        let(:credentials) { { user: { email: "wrong@test.com", password: "wrong" } } }
        run_test!
      end
    end
  end

  path "/api/v1/logout" do
    delete "Sign out" do
      tags "Auth"
      security [bearer_auth: []]
      produces "application/json"

      response "200", "signed out" do
        let(:user) { create(:user, :individual) }
        let(:Authorization) { "Bearer #{Warden::JWTAuth::UserEncoder.new.call(user, :user, nil).first}" }
        run_test!
      end
    end
  end
end
