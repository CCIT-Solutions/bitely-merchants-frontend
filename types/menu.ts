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
  dietType: string;
  image: string;
  customMacros?: boolean;
};
