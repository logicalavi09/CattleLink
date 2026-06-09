# PashuMarket

**Bharat ka Sabse Trusted Pashu Mandi** — A rural cattle marketplace connecting Indian farmers through video-first livestock listings.

PashuMarket is a modern web platform that lets farmers buy and sell cattle (cows, buffaloes, goats, sheep, and more) using short video reels to showcase animal health, gait, and temperament before scheduling a farm visit. Built with Next.js, TypeScript, Tailwind CSS v4, MongoDB, and Clerk authentication.

---

## Tech Stack

| Category | Technology |
|---|---|
| **Framework** | [Next.js](https://nextjs.org) 15.5.19 (App Router) |
| **Language** | TypeScript 5.9.2 |
| **UI Library** | React 19.2.7 |
| **Styling** | Tailwind CSS v4 |
| **Database** | MongoDB + [Mongoose](https://mongoosejs.com) 9.6 ODM |
| **Authentication** | [Clerk](https://clerk.com) (@clerk/nextjs 7.4) |
| **Icons** | [Lucide React](https://lucide.dev) |
| **Password Hashing** | bcryptjs |

---

## Features

- **Video-first listings** — Sellers upload short reels to demonstrate livestock health and movement
- **Category-based browsing** — Browse cattle by type: Cow, Buffalo, Goat, Sheep, and Other
- **Featured listings** — Highlighted animals promoted on the homepage
- **Trust & verification** — Verified sellers, breed insights, and fair pricing support
- **Clerk authentication** — Secure sign-up/sign-in with seller dashboard access
- **INR pricing** — Localized Indian Rupee formatting
- **Responsive design** — Mobile-first with horizontal scroll categories and adaptive layouts
- **Seller dashboard** — Authenticated sellers can list and manage their cattle (coming soon)

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) 18.17+
- A [MongoDB](https://mongodb.com) instance (local or Atlas)
- A [Clerk](https://clerk.com) application for authentication

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd PashuMarket

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
```

Edit `.env.local` with your own credentials:

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key |
| `CLERK_SECRET_KEY` | Clerk secret key |
| `MONGODB_URI` | MongoDB connection string |

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production

```bash
npm run build
npm start
```

---

## Project Structure

```
src/
├── app/
│   ├── globals.css          # Global styles & Tailwind theme tokens
│   ├── layout.tsx           # Root layout with ClerkProvider
│   └── page.tsx             # Homepage
├── components/
│   ├── navbar.tsx           # Sticky nav with search & auth
│   ├── hero-section.tsx     # Hero banner with trust highlights
│   ├── category-grid.tsx    # Category cards (Cow, Buffalo, etc.)
│   └── cattle-card.tsx      # Individual listing card
├── constants/
│   └── index.ts             # Categories, sample listings, trust highlights
├── lib/
│   ├── db.ts                # MongoDB connection singleton
│   ├── format.ts            # INR currency formatter
│   └── utils.ts             # cn() classname utility
├── models/
│   └── cattle.ts            # Mongoose schema & TypeScript types
└── middleware.ts             # Clerk auth route protection
```

---

## API Routes

| Route | Method | Description | Auth |
|---|---|---|---|
| `/api/cattle` | GET | List all cattle | Public |
| `/api/cattle` | POST | Create a new listing | Protected |

*Additional API routes planned for future releases.*

---

## Data Model

### Cattle Listing

| Field | Type | Description |
|---|---|---|
| `sellerId` | `string` | Clerk user ID of the seller |
| `name` | `string?` | Animal name |
| `type` | `string?` | Category (Cow, Buffalo, Goat, etc.) |
| `breed` | `string?` | Breed name |
| `price` | `number?` | Price in INR |
| `location` | `string?` | Seller location |
| `videoUrl` | `string?` | Video reel URL |
| `thumbnailUrl` | `string?` | Thumbnail image URL |
| `isSold` | `boolean` | Sold status (default: false) |
| `createdAt` | `Date` | Auto-generated |
| `updatedAt` | `Date` | Auto-generated |

---

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start development server (Turbopack) |
| `npm run build` | Create a production build |
| `npm start` | Run the production server |
| `npm run lint` | Run ESLint |

---

## Deployment

The project is optimized for deployment on [Vercel](https://vercel.com). Ensure the following environment variables are set in your deployment environment:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `MONGODB_URI`

---

## Roadmap

- [x] Landing page with categories and featured listings
- [x] Clerk authentication
- [x] MongoDB integration with Mongoose schema
- [ ] `/sell` page for listing cattle
- [ ] `/cattle/[id]` detail page with video player
- [ ] API route handlers for CRUD operations
- [ ] Search and filter functionality
- [ ] Image/video upload (using upload service)
- [ ] Mobile menu implementation
- [ ] Seller dashboard and analytics

---

## License

[MIT](LICENSE)
