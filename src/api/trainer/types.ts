export type Trainer = {
  id: number;
  name: string;
  title: string;
  category: string[];
  images: string[];
  description: string;
  student_count: number;
  rating: number;
  min_price: number;
  reviews: number;
  students: number;
  is_favorite?: boolean;
}