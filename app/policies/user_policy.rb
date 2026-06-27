# frozen_string_literal: true

class UserPolicy < ApplicationPolicy
  def index?  = true
  def show?   = true

  def create? = true

  def update?
    admin? || own_record?
  end

  def destroy?
    admin? || own_record?
  end

  def update_role?
    admin?
  end

  class Scope < ApplicationPolicy::Scope
    def resolve
      scope.kept
    end
  end

  private

  def admin?
    user.is_a?(AdminUser) || (user.is_a?(User) && user.admin?)
  end

  def moderator?
    user.is_a?(User) && user.moderator?
  end

  def own_record?
    user.is_a?(User) && record.id == user.id
  end
end
