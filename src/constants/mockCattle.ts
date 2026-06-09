export interface MockCattleListing {
  id: string;
  videoUrl: string;
  breed: string;
  price: number;
  location: string;
  sellerName: string;
  category: string;
  description: string;
}

export const mockCattleListings: MockCattleListing[] = [
  {
    id: "m1",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    breed: "Gir Cow",
    price: 55000,
    location: "Karnal, Haryana",
    sellerName: "Ramesh Singh",
    category: "Cow",
    description: "High milk yield, 12L/day. Vaccinated and dewormed.",
  },
  {
    id: "m2",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    breed: "Murrah Buffalo",
    price: 72000,
    location: "Ludhiana, Punjab",
    sellerName: "Gurpreet Kaur",
    category: "Buffalo",
    description: "Pregnancy checked. Produces 8kg fat-rich milk daily.",
  },
  {
    id: "m3",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    breed: "Jamunapari Goat",
    price: 18000,
    location: "Agra, Uttar Pradesh",
    sellerName: "Vikram Yadav",
    category: "Goat",
    description: "Healthy male, 2 years old. Good for breeding.",
  },
  {
    id: "m4",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    breed: "Dorper Sheep",
    price: 24000,
    location: "Jaipur, Rajasthan",
    sellerName: "Mohammed Rafiq",
    category: "Sheep",
    description: "Flock of 3 sheep. All vaccinated and healthy.",
  },
  {
    id: "m5",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    breed: "HF Cross Heifer",
    price: 46000,
    location: "Indore, Madhya Pradesh",
    sellerName: "Priya Sharma",
    category: "Other",
    description: "Cross-breed Holstein Friesian. 18 months old.",
  },
  {
    id: "m6",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    breed: "Sahiwal Cow",
    price: 62000,
    location: "Hisar, Haryana",
    sellerName: "Suresh Kumar",
    category: "Cow",
    description: "Pure Sahiwal. Excellent heat tolerance, 10L/day.",
  },
];
