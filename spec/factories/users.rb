# frozen_string_literal: true

FactoryBot.define do
  factory :user do
    sequence(:email) { |n| "user#{n}@example.com" }
    password { "password123" }
    password_confirmation { "password123" }
    role { "individual" }
    first_name { "Test" }
    last_name { "User" }

    trait :individual do
      role { "individual" }
    end

    trait :organization do
      role { "organization" }
      first_name { nil }
      last_name { nil }
      sequence(:organization_name) { |n| "Org #{n}" }
    end

    trait :moderator do
      role { "moderator" }
    end

    trait :admin do
      role { "admin" }
    end
  end
end
