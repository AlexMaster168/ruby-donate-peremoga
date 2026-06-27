# frozen_string_literal: true

require "swagger_helper"

RSpec.describe "Categories API", type: :request do
  path "/api/v1/categories" do
    get "List categories" do
      tags "Categories"
      produces "application/json"

      response "200", "categories listed" do
        schema type: :object, properties: {
          data: { type: :array, items: { "$ref" => "#/components/schemas/Category" } }
        }
        let!(:category) { create(:category) }
        run_test!
      end
    end
  end
end
