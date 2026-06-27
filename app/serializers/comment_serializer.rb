# frozen_string_literal: true

class CommentSerializer < Blueprinter::Base
  identifier :id
  fields :body, :created_at, :updated_at

  association :user, blueprint: UserSerializer
end
