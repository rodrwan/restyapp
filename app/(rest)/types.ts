export interface CustomizationOption {
  description: string;
  priceModifier: number;
  selected?: boolean;
}

export interface Dish {
  id?: string;
  name: string;
  price: number;
  isAvailable: boolean;
  imageUrl?: string;
  description?: string;
  customizationOptions: CustomizationOption[];
}

export interface SubCategory {
  id?: string;
  name: string;
  dishes: Dish[];
}

export interface Category {
  id?: string;
  name: string;
  dishes: Dish[];
  subCategories: SubCategory[];
}

export interface Restaurant {
  id: string;
  name: string;
  address: string;
  phone: string;
  imageUrl?: string;
  rating: number;
}

export interface MenuData {
  restaurant: Restaurant;
  categories: Category[];
}
