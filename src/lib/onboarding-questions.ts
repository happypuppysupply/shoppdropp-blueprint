export interface OnboardingQuestion {
  id: string;
  section: string;
  question: string;
  type: 'cards' | 'chips' | 'text' | 'number' | 'slider';
  options?: string[];
  placeholder?: string;
  multi?: boolean;
  min?: number;
  max?: number;
  prefix?: string;
}

export const ONBOARDING_QUESTIONS: OnboardingQuestion[] = [
  { id: 'business_goal', section: 'Business Goals', question: "Why are you starting this business? What's your ultimate goal?", type: 'cards', options: ["Side Income 💰", "Profitable Brand 🚀", "Multi-Million Empire 👑", "Passion Project ❤️", "Financial Freedom 🏖️"] },
  { id: 'success_timeline', section: 'Business Goals', question: "What's your target timeline?", type: 'cards', options: ["3-6 months", "6-12 months", "1-2 years", "2+ years"] },
  { id: 'time_commitment', section: 'Business Goals', question: "How much time weekly?", type: 'cards', options: ["5-10 hrs/week", "10-20 hrs/week", "20-40 hrs/week", "40+ hrs/week"] },
  { id: 'store_name', section: 'Store Identity', question: "What's your store name?", type: 'text', placeholder: "e.g., Happy Puppy Supply" },
  { id: 'store_theme', section: 'Store Identity', question: "What Shopify theme style?", type: 'cards', options: ["Minimal & Clean ✨", "Bold & Modern 🔥", "Warm & Friendly 🏠", "Luxury & Elegant 💎", "Playful & Fun 🎨", "Rustic & Natural 🌿"] },
  { id: 'category', section: 'Product Strategy', question: "What category?", type: 'cards', options: ["Pet Supplies 🐾", "Home & Garden 🏡", "Beauty & Care 💄", "Electronics 🔌", "Fashion 👕", "Fitness 🏋️", "Toys & Kids 🧸", "Health 🧘", "Food 🍔", "Arts 🎨"] },
  { id: 'niche', section: 'Product Strategy', question: "What's your specific niche?", type: 'text', placeholder: "e.g., luxury dog accessories" },
  { id: 'sourcing', section: 'Product Strategy', question: "How will you source products?", type: 'cards', options: ["Dropshipping", "Print-on-Demand", "Wholesale", "Hybrid", "Manufacturing"] },
  { id: 'price_range', section: 'Product Strategy', question: "What price range?", type: 'cards', options: ["$10-30", "$30-60", "$60-100", "$100-200", "$200+"] },
  { id: 'target_margin', section: 'Product Strategy', question: "Target profit margin?", type: 'cards', options: ["20-30%", "30-40%", "40-50%", "50%+"] },
  { id: 'locations', section: 'Target Audience', question: "Target locations?", type: 'chips', options: ["United States 🇺🇸", "Canada 🇨🇦", "UK 🇬🇧", "Australia 🇦🇺", "Germany 🇩🇪", "France 🇫🇷", "Europe 🇪🇺", "Mexico 🇲🇽", "Brazil 🇧🇷", "SE Asia 🌏"], multi: true },
  { id: 'age_range', section: 'Target Audience', question: "Target age groups?", type: 'chips', options: ["18-24", "25-34", "35-44", "45-54", "55-64", "65+"], multi: true },
  { id: 'gender', section: 'Target Audience', question: "Target gender?", type: 'cards', options: ["All Genders", "Women", "Men"] },
  { id: 'income_level', section: 'Target Audience', question: "Income level?", type: 'cards', options: ["Budget-conscious", "Middle income", "Upper-middle", "Affluent", "All levels"] },
  { id: 'interests', section: 'Target Audience', question: "Customer interests?", type: 'chips', options: ["Health & Fitness", "Fashion", "Technology", "Home Decor", "Travel", "Food", "Gaming", "Parenting", "Sustainability", "Luxury", "Outdoor", "Arts"], multi: true },
  { id: 'life_stage', section: 'Target Audience', question: "Life stages?", type: 'chips', options: ["Young professionals", "New parents", "Parents with kids", "Empty nesters", "Retirees", "Students", "Homeowners", "Pet owners", "Fitness enthusiasts"], multi: true },
  { id: 'brand_personality', section: 'Brand', question: "Brand personality?", type: 'cards', options: ["Fun & Playful 🎉", "Luxury & Premium 💎", "Eco-Friendly 🌿", "Professional 💼", "Trendy & Bold 🔥", "Cozy 🏠", "Minimalist ✨"] },
  { id: 'price_positioning', section: 'Brand', question: "Price positioning?", type: 'cards', options: ["Budget-friendly", "Mid-range", "Premium", "Luxury"] },
  { id: 'uvp', section: 'Brand', question: "Why buy from YOU?", type: 'text', placeholder: "Your unique value proposition..." },
  { id: 'pain_points', section: 'Brand', question: "Pain points solved?", type: 'chips', options: ["Saves time", "Saves money", "Reduces stress", "Improves health", "Better quality", "Hard to find", "More convenient", "Sustainable"], multi: true },
  { id: 'marketing_budget', section: 'Marketing', question: "Monthly marketing budget?", type: 'number', placeholder: "500", min: 0, max: 50000, prefix: "$" },
  { id: 'ad_platform', section: 'Marketing', question: "Primary ad platform?", type: 'cards', options: ["Meta/Facebook Ads", "TikTok Ads", "Google Ads", "Pinterest Ads", "Influencer Marketing"] },
  { id: 'content_strategy', section: 'Marketing', question: "Content types?", type: 'chips', options: ["Product demos", "Lifestyle", "Educational", "Behind-the-scenes", "UGC", "Testimonials", "Fun content", "Influencer collabs"], multi: true },
  { id: 'launch_strategy', section: 'Marketing', question: "Launch strategy?", type: 'cards', options: ["Soft launch", "Grand opening", "Pre-launch", "Influencer launch", "Paid ads day 1"] },
  { id: 'support_level', section: 'Operations', question: "Support level?", type: 'cards', options: ["Email only", "Email + Chat", "Full support", "VIP"] },
  { id: 'shipping_strategy', section: 'Operations', question: "Shipping approach?", type: 'cards', options: ["Free all orders", "Free over $X", "Flat rate", "Calculated", "Premium options"] },
  { id: 'success_metrics', section: 'Operations', question: "Success metrics?", type: 'chips', options: ["Revenue growth", "Profit margins", "CAC", "LTV", "Conversion rate", "Email list", "Social followers", "Satisfaction"], multi: true },
];

export const TOTAL_ONBOARDING_QUESTIONS = ONBOARDING_QUESTIONS.length;

export function getQuestion(index: number): OnboardingQuestion | undefined {
  return ONBOARDING_QUESTIONS[index];
}

export function getQuestionById(id: string): OnboardingQuestion | undefined {
  return ONBOARDING_QUESTIONS.find(q => q.id === id);
}

export function getSectionName(id: string): string {
  const q = getQuestionById(id);
  return q?.section || 'Other';
}
