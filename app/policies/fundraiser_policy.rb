# frozen_string_literal: true

class FundraiserPolicy < ApplicationPolicy
  def index? = true
  def show?  = true

  def create? = organization? || admin_or_moderator?

  def update?  = (organization? && author?) || admin_or_moderator?
  def destroy? = (organization? && author?) || admin_or_moderator?

  class Scope < ApplicationPolicy::Scope
    def resolve
      scope.all
    end
  end

  private

  def organization?
    user.present? && user.organization?
  end

  def author?
    record.author_id == user.id
  end

  def admin_or_moderator?
    user.present? && (
      user.is_a?(AdminUser) ||
      (user.is_a?(User) && (user.admin? || user.moderator?))
    )
  end
end
