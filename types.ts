
export interface Review {
  id: string;
  user: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  isModerated: boolean;
}

export interface AppItem {
  id: string;
  name: string;
  subtitle: string;
  icon: string;
  category: string;
  rating: number;
  reviewsCount: string;
  price: string;
  description: string;
  screenshots: string[];
  developer: string;
  ageRating: string;
  userReviews: Review[];
}

export interface TodayStory {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  content: string;
}

export type Tab = 'Today' | 'Games' | 'Apps' | 'Arcade' | 'Search' | 'Admin';
