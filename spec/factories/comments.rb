# frozen_string_literal: true

FactoryBot.define do
  factory :comment do
    body { "Comment text" }
    association :user
    ticket
  end
end
