# frozen_string_literal: true

class CommentPolicy < ApplicationPolicy
  def index?  = true
  def show?   = true

  def create? = user.present?

  def update?  = author? || admin_or_moderator?
  def destroy? = author? || admin_or_moderator?

  class Scope < ApplicationPolicy::Scope
    def resolve
      scope.all
    end
  end

  private

  def author?
    user.present? && record.user_id == user.id
  end

  def admin_or_moderator?
    user.present? && (
      user.is_a?(AdminUser) ||
      (user.is_a?(User) && (user.admin? || user.moderator?))
    )
  end
end
