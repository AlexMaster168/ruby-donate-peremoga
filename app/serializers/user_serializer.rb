# frozen_string_literal: true

class UserSerializer < Blueprinter::Base
  identifier :id
  fields :email, :role, :location, :biography, :created_at

  field :avatar_url do |user, _opts|
    next unless user.avatar.attached?

    "/rails/active_storage/blobs/#{user.avatar.blob.signed_id}/#{user.avatar.filename}"
  end

  view :normal do
    field :first_name,       if: ->(_name, user, _opts) { user.individual? }
    field :last_name,        if: ->(_name, user, _opts) { user.individual? }
    field :organization_name, if: ->(_name, user, _opts) { user.organization? }
  end
end
