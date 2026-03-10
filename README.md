# Travel Listing Platform

A modern full-stack web application that enables users to share and discover unique travel experiences. Users can create, edit, and manage their travel listings with rich media content, while exploring destinations shared by the community.

## Project Overview

This platform provides a seamless experience for travel enthusiasts to document and share their journeys. The application features user authentication, CRUD operations for travel listings, image management through cloud storage, and an intuitive interface with both light and dark mode support. Users can browse all community listings or filter to view only their own experiences.

## Setup Instructions

### Prerequisites

- Node.js 20 or higher
- npm, yarn, pnpm, or bun package manager
- Backend API server running (default: `http://localhost:5000`)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Tech Stack

### Frontend (Recommended)

- **Next.js** - React framework with App Router for server-side rendering and optimized performance
- **React** - Latest React with improved concurrent features
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework for responsive design
- **shadcn/ui** - High-quality, accessible UI components built on Radix UI

### Backend (Recommended)

- **Node.js/Express** - RESTful API server
- **JWT (JSON Web Tokens)** - Secure user authentication

### Storage (Recommended)

- **MongoDB** - NoSQL database for storing users and listings
- **Cloudinary** - Cloud-based image storage and optimization

## Features Implemented

- **User Authentication**
  - User registration with validation
  - Secure login system
  - Session persistence using sessionStorage
  - Protected routes for authenticated users

- **Travel Listing Management**
  - Create new travel experiences with title, location, image, description, and price
  - View all community listings with pagination
  - Edit own listings
  - Delete own listings with confirmation dialog

- **Image Upload**
  - Drag-and-drop image upload interface
  - Cloud storage via Cloudinary

- **User Interface**
  - Responsive design for mobile, tablet, and desktop

- **Navigation & Views**
  - "Public Feed" feed showing community listings
  - "My Feed" for viewing user's own listings
  - Individual listing detail pages
  - Search functionality
  - Pagination controls

## Architecture & Key Decisions

### Technology Stack Choice

I chose **Next.js** as the foundation for several reasons:

- Server-side rendering (SSR) improves SEO, which is crucial for a travel discovery platform
- App Router's file-based routing simplifies navigation structure
- Built-in optimization for images, fonts, and scripts enhances performance
- React Server Components reduce client-side JavaScript bundle size

**TypeScript** was selected for type safety, reducing runtime errors and improving developer experience with autocomplete and documentation. **Tailwind CSS** enables rapid UI development with consistent styling, while **shadcn/ui** provides professional, customizable components without bloating the bundle.

### Authentication Architecture

The application implements a **two-tier authentication system**:

**1. API Key for Registration and Login**

- Initial registration and login endpoints are protected by an API key
- This provides a basic layer of security to prevent unauthorized account creation
- The API key acts as a shared secret between frontend and backend

**2. JWT Tokens for Authenticated Operations**

- After successful login, the server issues a JWT token
- This token contains user identity and is stored in sessionStorage
- All subsequent API requests (create, edit, delete listings) include this token in the Authorization header
- Tokens can be set to expire, enhancing security

This hybrid approach balances ease of account creation with robust security for user-specific operations.

### Travel Listing Storage

Travel listings are stored in **MongoDB**, a NoSQL database, for several advantages:

- **Flexible Schema**: Listings can evolve (e.g., adding tags, ratings) without complex migrations
- **Document Model**: Each listing is a self-contained document with embedded author information
- **Performance**: MongoDB's indexing capabilities enable fast queries for filtering and pagination
- **Scalability**: Horizontal scaling through sharding supports future growth

Each listing document contains:

- Core fields: title, location, description, price
- Author reference: embedded user data (firstName, lastName, \_id)
- Image URL: Cloudinary CDN link
- Metadata: creation timestamp, unique ID

### Image Storage with Cloudinary

Instead of storing images directly in the database, I chose **Cloudinary** for several critical reasons:

**Performance**:

- Database storage would increase document size, slowing queries
- Binary data in databases consumes significant storage and bandwidth
- Cloudinary's CDN ensures fast image delivery globally

**Cost Efficiency**:

- Storing large binary files in MongoDB is expensive at scale
- Cloudinary offers a generous free tier and optimized storage pricing

### One Improvement with More Time

If I had more time, I would improve the performance of the listing pages by rendering the data on the server instead of fetching it only after the page loads. Right now, the listings are loaded on the client side, which causes a short loading delay. By using Next.js server-side rendering, the page could load with the listing data already included, making the experience faster and smoother for users.

This would also help with SEO because search engines would be able to see the full content of the page. In addition, I would implement incremental static regeneration so the pages can stay fast while still updating when the data changes.

I would also add Redis as a caching layer to store frequently requested listing data. This would reduce database requests and improve response times for users who access the same listings often.

## Question: If this platform had 10,000 travel listings, what changes would you make to improve performance and user experience?

With 10,000 travel listings, several strategic changes would be essential for performance and user experience:

**Pagination and Infinite Scroll**: Currently, all listings are loaded at once. To improve performance, I would implement page-wise fetching with server-side pagination so only a small set of listings loads at a time. I would also add infinite scroll so more listings load automatically as users scroll, creating a smoother browsing experience.

**Database Indexing**: Adding indexes on commonly queried fields such as location, author, createdAt, and price would significantly speed up database queries. Compound indexes could also help optimize common filter combinations.

**Caching**: I would add Redis to cache frequently requested listings and homepage data, reducing database load and improving response times. Edge caching through platforms like Cloudflare could further improve global performance.
