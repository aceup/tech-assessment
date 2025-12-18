class CreateOrders < ActiveRecord::Migration[7.2]
  def change
    create_table :orders do |t|
      t.string :title
      t.text :description
      t.date :due
      t.integer :status, default: 0, null: false

      t.timestamps
    end
  end
end
