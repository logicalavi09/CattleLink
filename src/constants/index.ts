import {
  Beef,
  Cloud,
  Grid3x3,
  Droplets,
  Leaf,
  ShieldCheck,
  Sparkles,
  Truck,
  Video,
  Wheat,
} from "lucide-react";

import type { CattleCategory, CattleListing } from "@/models/cattle";

export const categories: CattleCategory[] = [
  {
    name: "Cow",
    description: "Gir, Sahiwal, Jersey",
    icon: Leaf,
  },
  {
    name: "Buffalo",
    description: "Murrah, Jaffarabadi",
    icon: Droplets,
  },
  {
    name: "Goat",
    description: "Beetal, Jamunapari",
    icon: Beef,
  },
  {
    name: "Sheep",
    description: "Nali, Dorper",
    icon: Cloud,
  },
  {
    name: "Other",
    description: "Calves, bulls, mixed stock",
    icon: Grid3x3,
  },
];

export const cattleListings: CattleListing[] = [
  {
    id: "g1",
    category: "Cow",
    breed: "Gir Cow",
    location: "Haryana",
    price: 55000,
    mediaLabel: "Video preview available",
    statusLabel: "High milk yield",
    featured: true,
  },
  {
    id: "b1",
    category: "Buffalo",
    breed: "Murrah Buffalo",
    location: "Punjab",
    price: 72000,
    mediaLabel: "Seller video attached",
    statusLabel: "Pregnancy checked",
    featured: true,
  },
  {
    id: "g2",
    category: "Goat",
    breed: "Jamunapari Goat",
    location: "Uttar Pradesh",
    price: 18000,
    mediaLabel: "Short reel ready",
    statusLabel: "Healthy herd",
    featured: false,
  },
  {
    id: "s1",
    category: "Sheep",
    breed: "Dorper Sheep",
    location: "Rajasthan",
    price: 24000,
    mediaLabel: "Walkaround clip",
    statusLabel: "Vaccinated recently",
    featured: false,
  },
  {
    id: "o1",
    category: "Other",
    breed: "HF Cross Heifer",
    location: "Madhya Pradesh",
    price: 46000,
    mediaLabel: "Marketplace reel",
    statusLabel: "Farm verified",
    featured: true,
  },
];

export const trustHighlights = [
  { label: "Verified sellers", icon: ShieldCheck },
  { label: "Video listings", icon: Video },
  { label: "Fast local delivery", icon: Truck },
  { label: "Breed insights", icon: Sparkles },
  { label: "Fair pricing support", icon: Wheat },
];