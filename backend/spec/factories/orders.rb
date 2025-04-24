FactoryBot.define do
  factory :order do
    customer_email { Faker::Internet.email }
    total_amount { Faker::Commerce.price(range: 0..1000.0) }
    status { :pending }
    notes { Faker::Lorem.sentence }

    trait :completed do
      status { :completed }
    end

    trait :processing do
      status { :processing }
    end

    trait :cancelled do
      status { :cancelled }
    end
  end
end 