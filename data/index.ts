import { FaqItem, MealPlan, MenuItem, Testimonial } from "@/types";

export const NAV_ITEMS: MenuItem[] = [
  { label: "Plans & Packages", href: "/en/plans-and-packages" },
  { label: "Menu", href: "/en/menu" },
  { label: "The Cafe", href: "/en/calo-cafe" },
  {
    label: "Large Orders",
    href: "#",
    subItems: [
      { label: "Corporate & Businesses", href: "/en/corporate-and-business" },
      { label: "Personal Gatherings", href: "/en/personal-gatherings" },
    ],
  },
  { label: "Blog", href: "/en/blog" },
];

export const HERO_SLIDES = [
  {
    text: "For Busy People",
    image:
      "https://cdncaloapp.com/28e125562515cd84cda748118c399f96ec409f93.webp",
  },
  {
    text: "To Lose Weight",
    image:
      "https://cdncaloapp.com/ecd285aaa9068e0e7a697b012d4aa086f4198b7f.webp",
  },
  {
    text: "To Gain Muscle",
    image:
      "https://cdncaloapp.com/f0fc00e59e47badebea8fa65e595ac4e967ed125.webp",
  },
  {
    text: "For High Performers",
    image:
      "https://cdncaloapp.com/59a6f5ea2928db1fb0dd8f77f18909fd66d712f6.webp",
  },
];



export const MEAL_PLANS: MealPlan[] = [
  {
    title: "High Protein",
    dietType: "high-protein",
    href: "/en/high-protein-meal-plan",
    image:
      "https://api-blog.calo.app/wp-content/uploads/2025/09/ChickenSatayBowl.webp",
    protein: 50,
    carbs: 40,
    fat: 20,
    isPercent: true,
  },
  {
    title: "Balanced",
    dietType: "balanced",
    href: "/en/balanced-meal-plan",
    image:
      "https://api-blog.calo.app/wp-content/uploads/2025/09/RedThaiSalmonCurry.webp",
    protein: 35,
    carbs: 55,
    fat: 30,
    isPercent: true,
  },
  {
    title: "Vegetarian",
    dietType: "vegetarian",
    href: "/en/vegetarian-meal-plan",
    image:
      "https://api-blog.calo.app/wp-content/uploads/2025/09/Frame-1597884141.webp",
    protein: 25,
    carbs: 55,
    fat: 30,
    isPercent: true,
  },
  {
    title: "Chef's Picks",
    dietType: "chef-picks",
    href: "/en/chef-picks-meal-plan",
    image: "https://api-blog.calo.app/wp-content/uploads/2025/09/Bowl.webp",
    protein: 35,
    carbs: 55,
    fat: 30,
    isPercent: true,
  },
  {
    title: "Custom Macros",
    dietType: "custom-macros",
    image:
      "https://api-blog.calo.app/wp-content/uploads/2025/09/GarlicBraisedBeefBrisket.webp",
    protein: 53,
    carbs: 38,
    fat: 29,
    isPercent: false,
  },
  {
    title: "Low Carb",
    dietType: "low-carb",
    href: "/en/low-carb-meal-plan",
    image:
      "https://api-blog.calo.app/wp-content/uploads/2025/10/Frame-1597884141.webp",
    protein: 35,
    carbs: 20,
    fat: 50,
    isPercent: true,
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    name: "Safa Ebrahim",
    avatar:
      "https://api-blog.calo.app/wp-content/uploads/2025/10/Ellipse-807.webp",
    content:
      "As a busy mom, I've been subscribed to Calo for over a year and a half now, and I can't imagine being without it! I reached my goal weight, but I decided to keep my subscription. I like the meal variety and choices, but most of all, I love the flexibility and the outstanding customer service.",
  },
  {
    id: "2",
    name: "Thomas George",
    avatar:
      "https://api-blog.calo.app/wp-content/uploads/2025/10/Ellipse-807-1.webp",
    content:
      "Before, I found it hard to eat right even though I exercised regularly. But with CALO, that changed. Their tasty food made dieting easier and more enjoyable. Thanks to CALO, I lost 12kg! They really helped me eat better and get healthier.",
  },
  {
    id: "3",
    name: "Ali Alsadeq",
    avatar:
      "https://api-blog.calo.app/wp-content/uploads/2025/10/Frame-1597884367.webp",
    content:
      "Over the past three years I've tried several meal plans, and I would say Calo was one of the best meal plans I've tried! Food is delicious and I get lots of flexibility by choosing my meals out of a few options. Highly recommended!",
  },
  {
    id: "4",
    name: "Zainab Bucheeri",
    avatar:
      "https://api-blog.calo.app/wp-content/uploads/2025/10/Frame-1597884368.webp",
    content:
      "My second family. I love calo they are important part for me I love their meals plans they have a excellent service help the customer soon I like always to choose them they are my second family wish them always the best.",
  },
  {
    id: "5",
    name: "Shoug Naimi",
    avatar:
      "https://api-blog.calo.app/wp-content/uploads/2025/10/Frame-1597884368-1.webp",
    content:
      "Calo's application was easy to use and through it I was able to choose the meals I truly like yet keep my food healthy. When facing any issue I was able to reach out through an instant customer service live chat and everyone was quick and helpful!",
  },
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: "Am I tied into a contract?",
    answer: "Nope, no contracts here. You can pause or cancel anytime.",
  },
  {
    question: "Can I exclude ingredients?",
    answer:
      "Yes! You have the ability to edit individual meals, where you can remove ingredients/components from all meals except for snacks.",
  },
  {
    question: "What if I don't like a meal on my menu?",
    answer:
      "You can swap out any dish on the menu. We have 80+ different dish options for you to choose from each week.",
  },
  {
    question: "Can I enter my own macros?",
    answer:
      "Absolutely. We have a special custom macros plan for this. You enter your goal macros and we get working on a menu that matches them.",
  },
  {
    question: "Up to what point can I make changes to my delivery?",
    answer:
      "You can edit your menu, skip, pause, change your delivery address or delivery timing anytime up to 48 hours before your delivery - all from the app!",
  },
  {
    question: "How long do the meals last?",
    answer: "The meals last up to 3 days in the fridge.",
  },
  {
    question: "What oils do you cook with?",
    answer:
      "We cook predominantly with extra virgin olive oil, and don't use any seed oils. You'll find some dessert options with coconut oil or butter too.",
  },
  {
    question: "What type of packaging does your food come in?",
    answer:
      "Our food comes in easy to recycle clip lids, bagasse compostable plates/containers. Hot meal dishes have a recyclable plastic liner to improve food safety and this is also oven safe. Our meal plates/containers are oven and microwave proof.",
  },
  {
    question: "How do I pause my subscription?",
    answer:
      "To put your subscription on hold, sign in to your account, go to 'Account Settings', and choose 'Pause Subscription'. You can set the duration of the pause according to your needs.",
  },
];




export const COMMUNITY_POSTS = [
  {
    username: "@mostyle_coach",
    image:
      "https://api-blog.calo.app/wp-content/uploads/2025/10/Rectangle-6491.webp",
    avatar:
      "https://api-blog.calo.app/wp-content/uploads/2025/10/Ellipse-807.png",
  },
  {
    username: "@kate__hogg",
    image:
      "https://api-blog.calo.app/wp-content/uploads/2025/10/Rectangle-6492.webp",
    avatar:
      "https://api-blog.calo.app/wp-content/uploads/2025/10/Ellipse-807-1.png",
  },
  {
    username: "@sultanfalasi",
    image:
      "https://api-blog.calo.app/wp-content/uploads/2025/10/Rectangle-6493.webp",
    avatar:
      "https://api-blog.calo.app/wp-content/uploads/2025/10/Ellipse-807-2.png",
  },
  {
    username: "@s_mozakzak",
    image:
      "https://api-blog.calo.app/wp-content/uploads/2025/10/Rectangle-6494.webp",
    avatar:
      "https://api-blog.calo.app/wp-content/uploads/2025/10/Ellipse-807-3.png",
  },
  {
    username: "@laurazaraa",
    image:
      "https://api-blog.calo.app/wp-content/uploads/2025/10/Rectangle-6495.webp",
    avatar:
      "https://api-blog.calo.app/wp-content/uploads/2025/10/Ellipse-807-4.png",
  },
  {
    username: "@khadija.chahmoud",
    image:
      "https://api-blog.calo.app/wp-content/uploads/2025/10/Rectangle-6496.webp",
    avatar:
      "https://api-blog.calo.app/wp-content/uploads/2025/10/Ellipse-807-5.png",
  },
  {
    username: "@nasegeh",
    image:
      "https://api-blog.calo.app/wp-content/uploads/2025/10/Rectangle-6497.webp",
    avatar:
      "https://api-blog.calo.app/wp-content/uploads/2025/10/Ellipse-807-6.png",
  },
  {
    username: "@catagorgulho",
    image:
      "https://api-blog.calo.app/wp-content/uploads/2025/10/Rectangle-6498.webp",
    avatar:
      "https://api-blog.calo.app/wp-content/uploads/2025/10/Ellipse-807-7.png",
  },
  {
    username: "@ommie10",
    image:
      "https://api-blog.calo.app/wp-content/uploads/2025/10/Rectangle-6490.webp",
    avatar:
      "https://api-blog.calo.app/wp-content/uploads/2025/10/Ellipse-807-8.png",
  },
  {
    username: "@eatwithandrea_",
    image:
      "https://api-blog.calo.app/wp-content/uploads/2025/10/Rectangle-6499.webp",
    avatar:
      "https://api-blog.calo.app/wp-content/uploads/2025/10/Ellipse-807-9.png",
  },
];

export const BUSINESS_LOGOS = [
  "https://api-blog.calo.app/wp-content/uploads/2025/10/c080184a7a3d726c031514b2fd5294cdbad25362.webp",
  "https://api-blog.calo.app/wp-content/uploads/2025/10/b936d965063cc9476bf73084ac151363525e730e.webp",
  "https://api-blog.calo.app/wp-content/uploads/2025/10/47652b10f3675a6e63bb18cc6d334a28014bb59d.webp",
  "https://api-blog.calo.app/wp-content/uploads/2025/10/3283e738f964a9bd51d5a7b182b8f22cba53725d.webp",
];