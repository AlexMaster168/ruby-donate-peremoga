# frozen_string_literal: true

FactoryBot.define do
  factory :news_item do
    sequence(:title) { |n| "News #{n}" }
    description { "Description" }
    kind { "news" }
    association :author, factory: [:user, :organization]

    trait :news do
      kind { "news" }
    end

    trait :event do
      kind { "event" }
    end
  end
end
