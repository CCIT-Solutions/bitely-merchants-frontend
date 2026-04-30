
export interface MenuItem {
  label: string;
  href: string;
  subItems?: { label: string; href: string }[];
}



export interface MealPlan {
  title: string;
  dietType: string;
  href?: string;
  image: string;
  protein: number;
  carbs: number;
  fat: number;
  isPercent?: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  content: string;
  avatar: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}
