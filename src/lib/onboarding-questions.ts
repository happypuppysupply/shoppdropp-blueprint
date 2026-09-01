// Streamlined onboarding - 5 essential questions for research
export interface OnboardingQuestion {
  id: string
  section: string
  question: string
  type: 'cards' | 'chips' | 'text' | 'number' | 'slider'
  options?: string[]
  placeholder?: string
  multi?: boolean
  min?: number
  max?: number
  prefix?: string
}

export const ONBOARDING_QUESTIONS: OnboardingQuestion[] = [
  {
    id: 'store_name',
    section: 'Basics',
    question: "What will you name your store? (You can change this later)",
    type: 'text',
    placeholder: "e.g., Happy Puppy Supply"
  },
  {
    id: 'category',
    section: 'Products', 
    question: "Which industries/categories interest you? (Select multiple)",
    type: 'cards',
    multi: true,
    options: [
      "Pet Supplies 🐾 - Food, toys, accessories, grooming",
      "Home & Garden 🏡 - Decor, furniture, kitchen, outdoor",
      "Fashion & Apparel 👕 - Clothing, shoes, accessories, jewelry",
      "Beauty & Personal Care 💄 - Skincare, makeup, hair, wellness",
      "Health & Fitness 🏋️ - Supplements, fitness gear, nutrition",
      "Electronics & Tech 🔌 - Gadgets, accessories, smart home",
      "Toys & Games 🧸 - Toys, educational products, hobbies",
      "Sports & Outdoors ⛺ - Fitness, camping, hiking, cycling",
      "Baby & Kids 👶 - Baby gear, kids clothing, accessories",
      "Automotive 🚗 - Car accessories, maintenance, electronics",
      "Arts & Crafts 🎨 - Art supplies, DIY, crafting materials",
      "Jewelry & Accessories 💎 - Fashion jewelry, watches, accessories",
      "Kitchen & Dining 🍴 - Cookware, gadgets, appliances, serveware",
      "Travel & Luggage ✈️ - Luggage, travel accessories, organizers",
      "Office & School 📚 - Furniture, supplies, organization",
      "Tools & Hardware 🔧 - Tools, home improvement, hardware",
      "Gifts & Holidays 🎁 - Seasonal, special occasions, novelty",
      "Sustainable/Eco 🌱 - Eco-friendly, sustainable, natural products",
      "Luxury Goods 👑 - Premium, designer, high-end products"
    ]
  },
  {
    id: 'target_audience',
    section: 'Audience',
    question: "Who is your ideal customer? (Select all that apply)",
    type: 'cards',
    multi: true,
    options: [
      "Young Adults (18-34) - Trendy, social media savvy",
      "Parents (25-45) - Family-focused, practical buyers",
      "Professionals (30-50) - Higher income, quality focused",
      "Seniors (55+) - Comfort, convenience, value",
      "Pet Owners 🐾 - Passionate about pet care",
      "Home Owners 🏠 - Invest in home improvement",
      "Tech Enthusiasts 💻 - Early adopters, gadgets",
      "Budget Conscious 💰 - Value seekers, deal hunters",
      "Eco/Wellness 🌿 - Sustainability, health focused",
      "Luxury Buyers 💎 - Premium quality, status conscious"
    ]
  },
  {
    id: 'price_range',
    section: 'Pricing',
    question: "What's your target price range?",
    type: 'chips',
    options: [
      "Under $25 (Impulse buys, high volume)",
      "$25 - $50 (Sweet spot, good margins)",
      "$50 - $100 (Higher ticket, lower volume)",
      "$100+ (Premium, select audience)"
    ]
  },
  {
    id: 'marketing_channels',
    section: 'Marketing',
    question: "Where will you advertise? (Select your top channels)",
    type: 'cards',
    multi: true,
    options: [
      "Meta Ads (Facebook/Instagram) 📘",
      "TikTok 🎵",
      "Google Ads 🔍",
      "Pinterest 📌",
      "Influencer Marketing 👥",
      "Email Marketing 📧"
    ]
  },
  {
    id: 'monthly_budget',
    section: 'Budget',
    question: "What's your monthly ad budget?",
    type: 'chips',
    options: [
      "$500 - $1,000 (Testing phase)",
      "$1,000 - $3,000 (Getting serious)",
      "$3,000 - $5,000 (Scale mode)",
      "$5,000+ (Full acceleration)"
    ]
  }
]

export const getQuestionById = (id: string) => ONBOARDING_QUESTIONS.find(q => q.id === id)

export const TOTAL_ONBOARDING_QUESTIONS = ONBOARDING_QUESTIONS.length
