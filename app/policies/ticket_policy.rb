# frozen_string_literal: true

class TicketPolicy < ApplicationPolicy
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
    user.present? && record.author_id == user.id
  end

  def admin_or_moderator?
    user.present? && (
      user.is_a?(AdminUser) ||
      (user.is_a?(User) && (user.admin? || user.moderator?))
    )
  end
end
