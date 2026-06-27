# frozen_string_literal: true

FactoryBot.define do
  factory :category do
    sequence(:title) { |n| "Category #{%w[One Two Three Four Five Six Seven Eight Nine Ten].at(n - 1) || "Extra"}" }
  end
end
