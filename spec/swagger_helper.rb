# frozen_string_literal: true

require "rails_helper"
require "rswag/specs"

RSpec.configure do |config|
  config.openapi_root = Rails.root.to_s.gsub("spec", "swagger")

  config.openapi_specs = {
    "v1/swagger.yaml" => {
      openapi: "3.0.1",
      info: {
        title: "Peremoga API",
        version: "v1",
        description: "Donation and aid-coordination platform for Ukraine"
      },
      paths: {},
      servers: [
        { url: "http://localhost:3000", description: "Development" }
      ],
      components: {
        securitySchemes: {
          bearer_auth: {
            type: :http,
            scheme: :bearer,
            bearer_format: "JWT"
          }
        },
        schemas: {
          Error: {
            type: :object,
            properties: {
              error: { type: :string }
            }
          },
          Pagination: {
            type: :object,
            properties: {
              current_page: { type: :integer },
              next_page: { type: [:integer, :null] },
              prev_page: { type: [:integer, :null] },
              total_pages: { type: :integer },
              total_count: { type: :integer },
              per_page: { type: :integer }
            }
          },
          User: {
            type: :object,
            properties: {
              id: { type: :string, format: :uuid },
              email: { type: :string },
              role: { type: :string, enum: %w[individual organization moderator admin] },
              first_name: { type: [:string, :null] },
              last_name: { type: [:string, :null] },
              organization_name: { type: [:string, :null] },
              biography: { type: [:string, :null] },
              location: { type: [:string, :null] },
              created_at: { type: :string, format: :date_time }
            },
            required: %w[id email role]
          },
          Category: {
            type: :object,
            properties: {
              id: { type: :string, format: :uuid },
              title: { type: :string }
            },
            required: %w[id title]
          },
          Ticket: {
            type: :object,
            properties: {
              id: { type: :string, format: :uuid },
              title: { type: :string },
              description: { type: :string },
              location: { type: :string },
              image: { type: [:string, :null] },
              image_url: { type: [:string, :null] },
              ticket_type: { type: :string, enum: %w[offer request] },
              category: { "$ref" => "#/components/schemas/Category" },
              author: { "$ref" => "#/components/schemas/User" },
              created_at: { type: :string, format: :date_time },
              updated_at: { type: :string, format: :date_time }
            },
            required: %w[id title description ticket_type]
          },
          TicketList: {
            type: :object,
            properties: {
              id: { type: :string, format: :uuid },
              title: { type: :string },
              ticket_type: { type: :string },
              location: { type: :string },
              created_at: { type: :string, format: :date_time },
              category: { "$ref" => "#/components/schemas/Category" }
            }
          },
          Fundraiser: {
            type: :object,
            properties: {
              id: { type: :string, format: :uuid },
              title: { type: :string },
              description: { type: [:string, :null] },
              image: { type: [:string, :null] },
              image_url: { type: [:string, :null] },
              currency: { type: :string, enum: %w[UAH USD] },
              raised: { type: :number },
              total: { type: :number },
              progress_percent: { type: :number },
              author: { "$ref" => "#/components/schemas/User" },
              created_at: { type: :string, format: :date_time },
              updated_at: { type: :string, format: :date_time }
            },
            required: %w[id title currency raised total]
          },
          NewsItem: {
            type: :object,
            properties: {
              id: { type: :string, format: :uuid },
              title: { type: :string },
              description: { type: :string },
              image: { type: [:string, :null] },
              image_url: { type: [:string, :null] },
              kind: { type: :string, enum: %w[news event] },
              author: { "$ref" => "#/components/schemas/User" },
              created_at: { type: :string, format: :date_time },
              updated_at: { type: :string, format: :date_time }
            },
            required: %w[id title description kind]
          },
          Comment: {
            type: :object,
            properties: {
              id: { type: :string, format: :uuid },
              body: { type: :string },
              user: { "$ref" => "#/components/schemas/User" },
              created_at: { type: :string, format: :date_time },
              updated_at: { type: :string, format: :date_time }
            },
            required: %w[id body]
          }
        }
      }
    }
  }

  config.openapi_format = :yaml
end
