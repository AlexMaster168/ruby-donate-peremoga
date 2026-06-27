# frozen_string_literal: true

puts "Seeding Peremoga..."

# Categories
categories_data = [
  "Medical", "Food", "Shelter", "Education", "Clothing",
  "Transport", "Legal Aid", "Psychological Support", "Reconstruction", "Other"
]
categories = categories_data.map { |title| Category.find_or_create_by!(title: title) }
puts "  #{categories.size} categories"

# Users
users = []

# Admin
admin = User.find_or_create_by!(email: "admin@peremoga.ua") do |u|
  u.password = "admin123"
  u.password_confirmation = "admin123"
  u.role = "admin"
  u.first_name = "Admin"
  u.last_name = "Super"
  u.location = "Kyiv"
  u.biography = "Platform administrator"
end
users << admin

# Moderator
moderator = User.find_or_create_by!(email: "moderator@peremoga.ua") do |u|
  u.password = "mod123456"
  u.password_confirmation = "mod123456"
  u.role = "moderator"
  u.first_name = "Olena"
  u.last_name = "Koval"
  u.location = "Lviv"
  u.biography = "Community moderator helping coordinate aid"
end
users << moderator

# Organizations
orgs_data = [
  { email: "charity@help.ua", name: "Help UA Foundation", loc: "Kyiv", bio: "Providing humanitarian aid across Ukraine since 2022" },
  { email: "medical@aid.ua", name: "Medical Aid UA", loc: "Dnipro", bio: "Medical supplies and field hospitals" },
  { email: "feed-people@help.ua", name: "Feed The People", loc: "Odesa", bio: "Food distribution to displaced families" },
  { email: "shelter@home.ua", name: "Shelter UA", loc: "Kharkiv", bio: "Temporary housing for internally displaced persons" },
  { email: "rebuild@help.ua", name: "Rebuild Ukraine", loc: "Zaporizhzhia", bio: "Reconstruction of damaged buildings and infrastructure" }
]

orgs_data.each do |data|
  org = User.find_or_create_by!(email: data[:email]) do |u|
    u.password = "org123456"
    u.password_confirmation = "org123456"
    u.role = "organization"
    u.organization_name = data[:name]
    u.location = data[:loc]
    u.biography = data[:bio]
  end
  users << org
end
puts "  #{users.size} users (1 admin, 1 moderator, #{orgs_data.size} organizations)"

# Individuals
individuals_data = [
  { email: "ivan@example.com", fn: "Ivan", ln: "Petrenko", loc: "Kyiv", bio: "Volunteer, ready to help with logistics" },
  { email: "maria@example.com", fn: "Maria", ln: "Shevchenko", loc: "Lviv", bio: "Teacher, can help with online education" },
  { email: "oleksandr@example.com", fn: "Oleksandr", ln: "Bondarenko", loc: "Kharkiv", bio: "Engineer, can assist with reconstruction" },
  { email: "natalia@example.com", fn: "Natalia", ln: "Tkachenko", loc: "Dnipro", bio: "Psychologist, offering free consultations" },
  { email: "andriy@example.com", fn: "Andriy", ln: "Melnyk", loc: "Odesa", bio: "Driver, available for transport aid" }
]

individuals_data.each do |data|
  user = User.find_or_create_by!(email: data[:email]) do |u|
    u.password = "user123456"
    u.password_confirmation = "user123456"
    u.role = "individual"
    u.first_name = data[:fn]
    u.last_name = data[:ln]
    u.location = data[:loc]
    u.biography = data[:bio]
  end
  users << user
end
puts "  #{individuals_data.size} individual users"

# Tickets (offers and requests)
individuals = User.individual.to_a
org_list = User.organization.to_a
all_authors = individuals + org_list

tickets_data = [
  { title: "First aid kits available", desc: "Have 50 first aid kits ready for distribution. Can deliver within Kyiv.", type: "offer", cat: "Medical", loc: "Kyiv", author: org_list[0] },
  { title: "Need warm clothes for children", desc: "Looking for children's winter clothes sizes 92-128 for displaced families.", type: "request", cat: "Clothing", loc: "Kharkiv", author: individuals[0] },
  { title: "Free legal consultations", desc: "Offering free legal aid for displaced persons regarding documentation and housing rights.", type: "offer", cat: "Legal Aid", loc: "Lviv", author: individuals[1] },
  { title: "Emergency food supplies needed", desc: "Village near Bakhmut needs food packages for 200 elderly residents.", type: "request", cat: "Food", loc: "Donetsk region", author: org_list[2] },
  { title: "Psychological support hotline", desc: "Free psychological support for veterans and their families. Available daily 9am-9pm.", type: "offer", cat: "Psychological Support", loc: "Dnipro", author: individuals[3] },
  { title: "Transport for medical evacuations", desc: "Have a minibus available for medical evacuation transport in Zaporizhzhia region.", type: "offer", cat: "Transport", loc: "Zaporizhzhia", author: individuals[4] },
  { title: "School supplies for IDP children", desc: "Need notebooks, pens, and backpacks for 150 children in temporary shelter.", type: "request", cat: "Education", loc: "Kherson", author: org_list[1] },
  { title: "Temporary shelter available", desc: "Can accommodate 10 people in a heated building in Lviv. Beds and meals provided.", type: "offer", cat: "Shelter", loc: "Lviv", author: org_list[3] },
  { title: "Water purification systems needed", desc: "Remote village needs portable water purification systems. 5 units required.", type: "request", cat: "Other", loc: "Mykolaiv", author: individuals[2] },
  { title: "Free dental care for soldiers", desc: "Dental clinic offering free treatment for wounded soldiers and veterans.", type: "offer", cat: "Medical", loc: "Kyiv", author: org_list[1] },
  { title: "Rebuilding materials for homes", desc: "Need roofing materials and insulation for 12 damaged houses in Kherson region.", type: "request", cat: "Reconstruction", loc: "Kherson", author: org_list[4] },
  { title: "English classes for refugees", desc: "Free online English classes for Ukrainian refugees abroad. Groups of 10.", type: "offer", cat: "Education", loc: "Online", author: individuals[1] },
  { title: "Blankets and sleeping bags", desc: "Urgently need 200 blankets and 100 sleeping bags for frontline humanitarian aid.", type: "request", cat: "Clothing", loc: "Sumy", author: org_list[0] },
  { title: "Generator repair services", desc: "Electrician offering free repair of generators and electrical equipment.", type: "offer", cat: "Other", loc: "Kharkiv", author: individuals[2] },
  { title: "Medicine delivery to frontline", desc: "Need volunteers to deliver medicine packages to frontline medical points.", type: "request", cat: "Medical", loc: "Donetsk region", author: org_list[1] }
]

tickets = []
tickets_data.each do |data|
  ticket = Ticket.find_or_create_by!(title: data[:title]) do |t|
    t.description = data[:desc]
    t.ticket_type = data[:type]
    t.category = Category.find_by!(title: data[:cat])
    t.location = data[:loc]
    t.author = data[:author]
  end
  tickets << ticket
end
puts "  #{tickets.size} tickets"

# Comments
comments_data = [
  { ticket: tickets[0], user: individuals[0], body: "Great initiative! How can I help distribute these?" },
  { ticket: tickets[0], user: individuals[4], body: "I can transport within Kyiv region if needed." },
  { ticket: tickets[2], user: individuals[3], body: "This is very valuable. Many IDPs need legal help." },
  { ticket: tickets[3], user: org_list[0], body: "We can send food packages from our Kyiv warehouse." },
  { ticket: tickets[4], user: individuals[0], body: "Thank you for this service. Sharing with veterans I know." },
  { ticket: tickets[7], user: individuals[1], body: "Is this still available? I have a family of 4 needing shelter." },
  { ticket: tickets[7], user: org_list[3], body: "Yes, please contact us directly. We have space." },
  { ticket: tickets[10], user: individuals[2], body: "I can help with installation if materials arrive." },
  { ticket: tickets[12], user: individuals[4], body: "I can drive to Sumy next week with a loaded trailer." },
  { ticket: tickets[14], user: individuals[3], body: "I have medical supplies ready. Where to deliver?" }
]

comments_data.each do |data|
  Comment.find_or_create_by!(
    ticket: data[:ticket],
    user: data[:user],
    body: data[:body]
  )
end
puts "  #{comments_data.size} comments"

# Fundraisers (only organizations can create)
fundraisers_data = [
  { title: "Warm Winter for Kharkiv", desc: "Heating supplies for 500 families in Kharkiv affected by infrastructure damage.", currency: "UAH", total: 500000, raised: 234500, author: org_list[0] },
  { title: "Medical Equipment for Field Hospital", desc: "Portable ultrasound, ventilators, and surgical tools for the mobile hospital unit.", currency: "USD", total: 25000, raised: 8700, author: org_list[1] },
  { title: "Feed 1000 Displaced Families", desc: "Monthly food packages for 1000 IDP families in Dnipro region.", currency: "UAH", total: 800000, raised: 612000, author: org_list[2] },
  { title: "Rebuild School in Izium", desc: "Restoring the main school building damaged in 2022. New windows, roof, and furniture.", currency: "USD", total: 50000, raised: 31200, author: org_list[4] },
  { title: "Emergency Shelter Expansion", desc: "Expanding temporary shelter capacity from 100 to 300 beds in Lviv.", currency: "UAH", total: 1200000, raised: 445000, author: org_list[3] },
  { title: "Solar Panels for Hospitals", desc: "Installing solar panels on 3 regional hospitals to ensure uninterrupted power supply.", currency: "USD", total: 80000, raised: 12300, author: org_list[1] }
]

fundraisers_data.each do |data|
  Fundraiser.find_or_create_by!(title: data[:title]) do |f|
    f.description = data[:desc]
    f.currency = data[:currency]
    f.total = data[:total]
    f.raised = data[:raised]
    f.author = data[:author]
  end
end
puts "  #{fundraisers_data.size} fundraisers"

# News items
news_data = [
  { title: "New Humanitarian Corridor Opened", desc: "A new humanitarian corridor has been established for aid delivery to frontline areas.", kind: "news", author: org_list[0] },
  { title: "Winter Aid Drive Launch", desc: "Join our winter aid campaign. Collection points now open in all major cities.", kind: "event", author: org_list[2] },
  { title: "Medical Team Deployment", desc: "A team of 20 medical professionals deployed to Kherson region for 3-month mission.", kind: "news", author: org_list[1] },
  { title: "Volunteer Training Workshop", desc: "Free first aid and disaster response training for volunteers. December 15-16 in Kyiv.", kind: "event", author: org_list[0] },
  { title: "Housing Restoration Progress", desc: "200 homes repaired in Zaporizhzhia region this quarter. Target: 500 by spring.", kind: "news", author: org_list[4] },
  { title: "Charity Gala Dinner", desc: "Annual charity gala to support education programs for displaced children. December 20, Kyiv.", kind: "event", author: org_list[3] },
  { title: "Water Supply Restored in Mykolaiv", desc: "Clean water supply restored to 3 villages after installation of purification systems.", kind: "news", author: org_list[1] },
  { title: "Children's New Year Celebration", desc: "New Year celebration for 500 IDP children. Gifts, entertainment, and warm meals provided.", kind: "event", author: org_list[2] }
]

news_data.each do |data|
  NewsItem.find_or_create_by!(title: data[:title]) do |n|
    n.description = data[:desc]
    n.kind = data[:kind]
    n.author = data[:author]
  end
end
puts "  #{news_data.size} news items"

puts "\nSeed complete!"
puts "  Login as admin: admin@peremoga.ua / admin123"
puts "  Login as org: charity@help.ua / org123456"
puts "  Login as user: ivan@example.com / user123456"
