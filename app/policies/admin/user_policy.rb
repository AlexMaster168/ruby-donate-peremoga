module Admin
  class UserPolicy < ApplicationPolicy
    # All admins can read
    def index? = true
    def show?  = true

    def create? = true

    def update? = true

    def destroy? = super_admin?

    class Scope < ApplicationPolicy::Scope
      def resolve
        scope.with_discarded
      end
    end

    private

    def super_admin?
      user.super_admin?
    end
  end
end
