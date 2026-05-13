export type LocalizedText = {
  en: string;
  ar: string;
};

export type FoodItem = {
  id: string;
  name: LocalizedText;
  description: LocalizedText;
  category: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  image: string;
  dietType?: string;
  tag?: string;
  customMacros?: boolean;
};
