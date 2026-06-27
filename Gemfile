# frozen_string_literal: true

source 'https://rubygems.org'

# See https://guides.rubyonrails.org/getting_started.html
gem 'rails', '~> 8.1.2'

# See https://github.com/ged/ruby-pg
gem 'pg', '~> 1.5'

# See https://github.com/puma/puma
gem 'puma', '~> 6.6'

# See https://github.com/rails/jbuilder
# gem "jbuilder"

# Use Active Model has_secure_password [https://guides.rubyonrails.org/active_model_basics.html#securepassword]
gem 'bcrypt', '~> 3.1.7'

# See https://github.com/jhawthorn/discard
gem 'discard', '~> 1.4'

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem 'tzinfo-data', platforms: %i[ windows jruby ]

# See https://github.com/rails/solid_cache
gem 'solid_cache', '~> 1.0'

# See https://github.com/rails/solid_cable
gem 'solid_cable', '~> 1.0'

# See https://github.com/shopify/bootsnap
gem 'bootsnap', '~> 1.18', require: false

# See https://kamal-deploy.org
gem 'kamal', '~> 2.5', require: false

# See https://github.com/basecamp/thruster
gem 'thruster', '~> 0.1.10', require: false

# See https://github.com/janko/image_processing
gem 'image_processing', '~> 1.13'

# ActiveAdmin UI assets support in API-only app.
gem 'sprockets-rails', '~> 3.5'
gem 'sassc-rails', '~> 2.1'

# See https://github.com/cyu/rack-cors
gem "rack-cors"

# See https://github.com/rack-attack/rack-attack
gem 'rack-attack', '~> 6.7'

# See https://github.com/dry-rb/dry-validation
gem 'dry-validation', '~> 1.10'

# See https://github.com/sparklemotion/nokogiri
gem 'nokogiri', '>= 1.19.3'

# See https://github.com/rack/rack
gem 'rack', '>= 3.2.5'

gem 'action_text-trix', '>= 2.1.18'

gem 'activestorage', '>= 8.1.2.1'

gem 'mcp', '>= 0.9.2'

# See https://github.com/varvet/pundit
gem 'pundit', '~> 2.5.2'

# See https://github.com/activeadmin/activeadmin
gem 'activeadmin', '~> 3.3'

# See https://github.com/heartcombo/devise
gem 'devise', '>= 5.0.3'

# API Documentation
# See https://github.com/rswag/rswag
gem 'rswag-api', '~> 2.17'
gem 'rswag-ui', '~> 2.17'

# See https://github.com/okuramasafumi/alba
gem 'alba', '~> 3.8'

# See https://github.com/ruby/net-imap
gem 'net-imap', '>= 0.6.4'

# See https://github.com/rack/rack-session
gem 'rack-session', '>= 2.1.2'

group :test do
  # See https://github.com/rspec/rspec
  gem 'rspec', '~> 3.13'

  # See https://github.com/rswag/rswag
  gem 'rswag-specs', '~> 2.17'

  # See https://github.com/thoughtbot/shoulda-matchers
  gem 'shoulda-matchers', '~> 7.0'

  # See https://github.com/test-prof/test-prof
  gem 'test-prof', '~> 1.4'

  # See https://github.com/grosser/parallel_tests
  gem 'parallel_tests', '~> 4.0'

  # See https://github.com/sj26/rspec_junit_formatter
  gem 'rspec_junit_formatter', '~> 0.6'

  # See https://github.com/rubysec/bundler-audit
  gem 'bundler-audit', '~> 0.9'

  # See https://github.com/stanko-avic/bundler-leak
  gem 'bundler-leak', '~> 0.3'

  # See https://github.com/simplecov-ruby/simplecov
  gem 'simplecov', '~> 0.22'

  # See https://github.com/vicentllongo/simplecov-json
  gem 'simplecov-json', '~> 0.2'

  # See https://github.com/pundit-community/pundit-matchers
  gem 'pundit-matchers', '~> 4.0.0'
end

group :development do
  # See https://github.com/flyerhzm/bullet
  gem 'bullet', '~> 8.0'
end

group :development, :test do
  # See https://guides.rubyonrails.org/debugging_rails_applications.html#debugging-with-the-debug-gem
  gem 'debug', platforms: %i[mri windows], require: 'debug/prelude'

  gem 'dotenv-rails'

  # See https://github.com/pry/pry
  gem 'pry', '~> 0.15'

  # Testing framework
  gem 'rspec-rails', '~> 7.1'

  gem 'timecop', '~> 0.9.4'

  # See https://github.com/deivid-rodriguez/pry-byebug
  gem 'pry-byebug', '~> 3.12'

  # See https://github.com/rubocop/rubocop-performance
  gem 'rubocop-performance', '~> 1.26'

  # See https://github.com/rubocop/rubocop-rails
  gem 'rubocop-rails', '~> 2.30'

  # See https://github.com/rubocop/rubocop-rspec-rails
  gem 'rubocop-rspec_rails', '~> 2.30'

  # See https://github.com/rubocop/rubocop-rake
  gem 'rubocop-rake', '~> 0.7'

  # See https://github.com/rails/rubocop-rails-omakase
  gem 'rubocop-rails-omakase', '~> 1.0', require: false

  # See https://github.com/ffaker/ffaker
  gem 'ffaker', '~> 2.23'

  # See https://github.com/thoughtbot/factory_bot
  gem 'factory_bot_rails', '~> 6.5'

  # See https://github.com/ankane/strong_migrations
  gem 'strong_migrations', '~> 2.1'

  # See https://github.com/prontolabs/pronto
  gem 'pronto', '~> 0.11'
  gem 'pronto-flay', require: false
  gem 'pronto-rubocop', require: false

  # See https://github.com/DamirSvrtan/fasterer
  gem 'fasterer', '~> 0.11'

  # See https://github.com/presidentbeef/brakeman
  gem 'brakeman', '~> 8.0'

  # See https://github.com/lostisland/faraday-retry
  gem 'faraday-retry', '>= 2.4'

  gem 'faraday', '>= 2.14.2'

  # See https://github.com/evilmartians/lefthook
  gem 'lefthook', '~> 1.10'

  # See https://github.com/troessner/reek
  gem 'reek', '~> 6.4'
end

gem 'rubocop-factory_bot', '~> 2.28', group: :test

gem 'rexml', '~> 3.4', group: :test

gem "ruby-lsp", "~> 0.26.9"

gem "blueprinter", "~> 1.3"

gem "pg_search", "~> 2.3"

gem "devise-jwt", "~> 0.13.0"
