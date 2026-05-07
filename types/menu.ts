export type LocalizedText = {
  en: string;
  ar: string;
};

export type FoodItem = {
  id: string;
  name: LocalizedText;
  description: LocalizedText;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  image: string;
  dietType?: string;
  tag?: string;
  customMacros?: boolean;
};
