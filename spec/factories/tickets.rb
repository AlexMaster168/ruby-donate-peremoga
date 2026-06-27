# frozen_string_literal: true

FactoryBot.define do
  factory :ticket do
    sequence(:title) { |n| "Ticket #{n}" }
    description { "Description text" }
    location { "Kyiv" }
    ticket_type { "offer" }
    association :author, factory: [:user, :individual]
    category

    trait :offer do
      ticket_type { "offer" }
    end

    trait :request do
      ticket_type { "request" }
    end
  end
end
