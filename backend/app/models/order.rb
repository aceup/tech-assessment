class Order < ApplicationRecord
  enum status: {
    pending: 0,
    processing: 1,
    completed: 2,
    cancelled: 3
  }

  validates :customer_email, presence: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :total_amount, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :status, presence: true

  before_validation :set_default_status, on: :create

  private

  def set_default_status
    self.status ||= :pending
  end
end 