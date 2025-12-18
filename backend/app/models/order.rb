class Order < ApplicationRecord
    validates :title, presence: true
    enum :status, {:pending=>0, :processing=>1, :completed=>2, :cancelled=>3}
end
