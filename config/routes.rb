Rails.application.routes.draw do
  devise_for :admin_users, ActiveAdmin::Devise.config
  ActiveAdmin.routes(self)

  get "up" => "rails/health#show", as: :rails_health_check

  mount Rswag::Ui::Engine => "/api-docs"
  mount Rswag::Api::Engine => "/api-docs"

  namespace :api, defaults: { format: :json } do
    namespace :v1 do
      devise_for :users,
        path: "",
        singular: :user,
        path_names: {
          sign_in:  "login",
          sign_out: "logout"
        },
        controllers: {
          sessions: "api/v1/sessions"
        },
        only: [ :sessions ]

      resources :users, only: [ :index, :show, :create, :update, :destroy ] do
        member do
          patch :update_role
        end
      end
      resources :tickets, only: [ :index, :show, :create, :update, :destroy ] do
        resources :comments, only: [ :index, :create, :update, :destroy ]
      end
      resources :news_items, path: "news", only: [ :index, :show, :create, :update, :destroy ]
      resources :fundraisers, only: [ :index, :show, :create, :update, :destroy ]
      resources :categories, only: [ :index ]

      get "search", to: "search#index"

      namespace :stats do
        get "overview"
        get "fundraisers"
        get "tickets"
      end
    end
  end

  root to: ->(env) {
    [ 200, { "Content-Type" => "application/json" }, [ { status: "online", engine: "Peremoga Backend", version: "v1" }.to_json ] ]
  }
end
