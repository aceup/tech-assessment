require 'rails_helper'

RSpec.describe OrderService do
  describe '.create' do
    let(:valid_params) { attributes_for(:order) }

    it 'creates an order successfully' do
      expect {
        result = described_class.create(valid_params)
        expect(result).to be_success
        expect(result.order).to be_persisted
        expect(result.order).to be_pending
        expect(result.errors).to be_nil
      }.to change(Order, :count).by(1)
    end

    it 'fails to create with invalid params' do
      invalid_params = valid_params.merge(customer_email: 'invalid-email')
      
      expect {
        result = described_class.create(invalid_params)
        expect(result).not_to be_success
        expect(result.order).to be_nil
        expect(result.errors).to be_present
      }.not_to change(Order, :count)
    end

    it 'sends confirmation email on order creation' do
      expect {
        described_class.create(valid_params)
      }.to have_enqueued_mail(OrderMailer, :confirmation_email)
    end
  end

  describe '.update_status' do
    let(:order) { create(:order) }

    context 'with valid status' do
      it 'updates status successfully' do
        result = described_class.update_status(order, :completed)
        
        expect(result).to be_success
        expect(result.order).to be_completed
        expect(result.errors).to be_nil
      end
    end

    context 'with invalid status' do
      it 'handles invalid status gracefully' do
        result = described_class.update_status(order, 'invalid_status')
        
        expect(result).not_to be_success
        expect(result.errors).to include(/Invalid status/)
        expect(order.reload).to be_pending
      end
    end
  end
end 