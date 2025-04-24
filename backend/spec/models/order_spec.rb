require 'rails_helper'

RSpec.describe Order, type: :model do
  describe 'validations' do
    it 'is valid with valid attributes' do
      expect(build(:order)).to be_valid
    end

    it 'is not valid without a customer email' do
      order = build(:order, customer_email: nil)
      expect(order).not_to be_valid
      expect(order.errors[:customer_email]).to include("can't be blank")
    end

    it 'is not valid with an invalid email format' do
      order = build(:order, customer_email: 'invalid-email')
      expect(order).not_to be_valid
      expect(order.errors[:customer_email]).to include('is invalid')
    end

    it 'is not valid without a total amount' do
      order = build(:order, total_amount: nil)
      expect(order).not_to be_valid
      expect(order.errors[:total_amount]).to include("can't be blank")
    end

    it 'is not valid with a negative total amount' do
      order = build(:order, total_amount: -1)
      expect(order).not_to be_valid
      expect(order.errors[:total_amount]).to include('must be greater than or equal to 0')
    end
  end

  describe 'status' do
    it 'defaults to pending' do
      order = create(:order)
      expect(order).to be_pending
    end

    it 'can transition through different statuses' do
      order = create(:order)
      
      expect(order).to be_pending
      
      order.processing!
      expect(order).to be_processing
      
      order.completed!
      expect(order).to be_completed
      
      order.cancelled!
      expect(order).to be_cancelled
    end

    it 'includes all status values' do
      expect(Order.statuses.keys).to match_array(%w[pending processing completed cancelled])
    end
  end
end 