# frozen_string_literal: true

require "swagger_helper"

RSpec.describe "Users API", type: :request do
  path "/api/v1/users" do
    get "List users" do
      tags "Users"
      security [bearer_auth: []]
      produces "application/json"

      response "200", "users listed" do
        schema type: :object, properties: {
          data: { type: :array, items: { "$ref" => "#/components/schemas/User" } }
        }
        let(:user) { create(:user, :admin) }
        let(:Authorization) { "Bearer #{Warden::JWTAuth::UserEncoder.new.call(user, :user, nil).first}" }
        let!(:other_user) { create(:user, :individual) }
        run_test!
      end
    end

    post "Register user" do
      tags "Users"
      consumes "application/json"
      produces "application/json"
      parameter name: :user_params, in: :body, schema: {
        type: :object,
        properties: {
          user: {
            type: :object,
            properties: {
              email: { type: :string },
              password: { type: :string },
              password_confirmation: { type: :string },
              first_name: { type: :string },
              last_name: { type: :string },
              organization_name: { type: :string },
              role: { type: :string, enum: %w[individual organization] }
            },
            required: %w[email password password_confirmation role]
          }
        }
      }

      response "201", "user registered" do
        schema type: :object, properties: {
          data: { "$ref" => "#/components/schemas/User" },
          token: { type: :string }
        }
        let(:user_params) { { user: { email: "new@test.com", password: "password123", password_confirmation: "password123", first_name: "John", last_name: "Doe", role: "individual" } } }
        run_test!
      end
    end
  end

  path "/api/v1/users/{id}" do
    parameter name: :id, in: :path, type: :string, required: true

    get "Get user" do
      tags "Users"
      security [bearer_auth: []]
      produces "application/json"

      response "200", "user found" do
        schema type: :object, properties: {
          data: { "$ref" => "#/components/schemas/User" }
        }
        let(:user) { create(:user, :admin) }
        let(:Authorization) { "Bearer #{Warden::JWTAuth::UserEncoder.new.call(user, :user, nil).first}" }
        let(:id) { user.id }
        run_test!
      end
    end

    patch "Update user" do
      tags "Users"
      security [bearer_auth: []]
      consumes "application/json"
      produces "application/json"
      parameter name: :user_params, in: :body, schema: {
        type: :object,
        properties: {
          user: {
            type: :object,
            properties: {
              first_name: { type: :string },
              last_name: { type: :string },
              biography: { type: :string },
              location: { type: :string }
            }
          }
        }
      }

      response "200", "user updated" do
        let(:user) { create(:user, :individual) }
        let(:Authorization) { "Bearer #{Warden::JWTAuth::UserEncoder.new.call(user, :user, nil).first}" }
        let(:id) { user.id }
        let(:user_params) { { user: { first_name: "Updated" } } }
        run_test!
      end
    end

    delete "Delete user" do
      tags "Users"
      security [bearer_auth: []]
      produces "application/json"

      response "204", "user deleted" do
        let(:user) { create(:user, :individual) }
        let(:Authorization) { "Bearer #{Warden::JWTAuth::UserEncoder.new.call(user, :user, nil).first}" }
        let(:id) { user.id }
        run_test!
      end
    end
  end
end
