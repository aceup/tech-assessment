require 'rails_helper'

RSpec.describe '/orders', type: :request do


  describe 'GET /api/v1/orders' do
    it 'returns all orders' do
      create_list(:order, 3)

      get "/api/v1/orders", headers: json_headers, as: :json

      expect(response).to have_http_status(:ok)
      expect(json_response).to be_an(Array)
      expect(json_response.size).to eq(3)
    end
  end

  describe 'GET /api/v1/orders/:id' do
    let(:order) { create(:order) }

    it 'returns the order' do
      get "/api/v1/orders/#{order.id}", headers: json_headers

      expect(response).to have_http_status(:ok)
      expect(json_response['id']).to eq(order.id)
      expect(json_response['status']).to eq('pending')
    end

    it 'returns not found for non-existent order' do
      get '/api/v1/orders/999999', headers: json_headers

      expect(response).to have_http_status(:not_found)
    end
  end

  describe 'POST /api/v1/orders' do
    let(:valid_params) { { order: attributes_for(:order) } }

    it 'creates a new order' do
      expect {
        post '/api/v1/orders', 
             params: valid_params,
             headers: json_headers,
             as: :json
      }.to change(Order, :count).by(1)

      expect(response).to have_http_status(:created)
      expect(json_response['customer_email']).to eq(valid_params[:order][:customer_email])
      expect(json_response['status']).to eq('pending')
    end

    it 'returns error for invalid params' do
      post '/api/v1/orders', 
           params: { order: attributes_for(:order, customer_email: 'invalid-email') },
           headers: json_headers,
           as: :json

      expect(response).to have_http_status(:unprocessable_entity)
      expect(json_response['errors']).to be_present
    end
  end

  describe 'PATCH /api/v1/orders/:id' do
    let(:order) { create(:order) }

    context 'with valid status' do
      it 'updates the order status' do
        patch "/api/v1/orders/#{order.id}", 
              params: { order: { status: :completed } },
              headers: json_headers,
              as: :json

        expect(response).to have_http_status(:ok)
        expect(order.reload).to be_completed
      end
    end

    context 'with invalid status' do
      it 'returns error for invalid status' do
        patch "/api/v1/orders/#{order.id}", 
              params: { order: { status: 'invalid_status' } },
              headers: json_headers,
              as: :json

        expect(response).to have_http_status(:unprocessable_entity)
        expect(json_response['errors']).to include(/invalid_status/)
        expect(order.reload).to be_pending
      end
    end
  end

  describe 'DELETE /api/v1/orders/:id' do
    let!(:order) { create(:order) }

    it 'deletes the order' do
      expect {
        delete "/api/v1/orders/#{order.id}", headers: json_headers
      }.to change(Order, :count).by(-1)

      expect(response).to have_http_status(:no_content)
    end
  end
end 