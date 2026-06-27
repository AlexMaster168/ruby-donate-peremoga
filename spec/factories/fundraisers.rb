# frozen_string_literal: true

FactoryBot.define do
  factory :fundraiser do
    sequence(:title) { |n| "Fundraiser #{n}" }
    description { "Description" }
    currency { "UAH" }
    total { 10000 }
    raised { 0 }
    association :author, factory: [:user, :organization]

    trait :uah do
      currency { "UAH" }
    end

    trait :usd do
      currency { "USD" }
    end
  end
end
