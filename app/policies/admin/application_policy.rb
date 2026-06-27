# frozen_string_literal: true

module Admin
  class ApplicationPolicy < ::ApplicationPolicy
    def index?
      admin_user_present?
    end

    def show?
      admin_user_present?
    end

    def create?
      admin_user_present?
    end

    def update?
      admin_user_present?
    end

    def destroy?
      admin_user_present?
    end

    class Scope < ::ApplicationPolicy::Scope
      def resolve
        admin_user_present? ? scope.all : scope.none
      end

      private

      def admin_user_present?
        user.is_a?(AdminUser)
      end
    end

    private

    def admin_user_present?
      user.is_a?(AdminUser)
    end
  end
end
