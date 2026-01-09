# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).

Order.create!([
  {
    title: "Website Redesign",
    client: "Tech Corp",
    description: "Complete redesign of company website with modern UI/UX",
    due: Date.today + 30.days,
    status: :pending
  },
  {
    title: "Mobile App Development",
    client: "StartupXYZ",
    description: "Build iOS and Android apps for food delivery service",
    due: Date.today + 45.days,
    status: :processing
  },
  {
    title: "Database Migration",
    client: "Enterprise Solutions",
    description: "Migrate legacy database to PostgreSQL",
    due: Date.today - 5.days,
    status: :completed
  },
  {
    title: "API Integration",
    client: "FinTech Inc",
    description: "Integrate payment gateway API",
    due: Date.today + 15.days,
    status: :processing
  },
  {
    title: "Marketing Campaign",
    client: "Fashion Brand",
    description: "Social media marketing campaign for summer collection",
    due: Date.today + 60.days,
    status: :pending
  },
  {
    title: "Server Maintenance",
    client: "Cloud Services",
    description: "Routine server maintenance and security updates",
    due: Date.today - 10.days,
    status: :cancelled
  },
  {
    title: "E-commerce Platform",
    client: "Retail Chain",
    description: "Build custom e-commerce platform with inventory management",
    due: Date.today + 90.days,
    status: :pending
  },
  {
    title: "Data Analytics Dashboard",
    client: "Analytics Pro",
    description: "Create interactive dashboard for sales data visualization",
    due: Date.today + 20.days,
    status: :processing
  },
  {
    title: "Security Audit",
    client: "BankCorp",
    description: "Comprehensive security audit of banking application",
    due: Date.today - 2.days,
    status: :completed
  },
  {
    title: "Logo Design",
    client: "New Startup",
    description: "Design modern logo and brand identity",
    due: nil,
    status: :pending
  }
])