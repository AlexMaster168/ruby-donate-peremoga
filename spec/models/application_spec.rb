# frozen_string_literal: true

require "rails_helper"

RSpec.describe "Application" do
  it "loads the Rails environment" do
    expect(Rails.env).to eq("test")
  end

  it "has a database connection" do
    expect(ActiveRecord::Base.connection).to be_active
  end
end
