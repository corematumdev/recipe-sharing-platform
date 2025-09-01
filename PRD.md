# Recipe Sharing Platform - Product Requirements Document

## Project Overview

A modern recipe sharing platform where users can upload, browse, and discover recipes. Built with Next.js and Supabase for a seamless user experience with real-time capabilities.

## Core Features

### 1. User Authentication & Profiles
- **User Registration/Login**: Email/password and social authentication
- **User Profiles**: Customizable profiles with bio, profile picture, and recipe collections
- **User Dashboard**: Personal dashboard to manage recipes and view analytics

### 2. Recipe Management
- **Recipe Upload**: Rich text editor with image upload capabilities
- **Recipe Details**: Ingredients, instructions, prep/cook time, servings, difficulty level
- **Recipe Categories**: Categorization by cuisine, meal type, dietary restrictions
- **Recipe Images**: Multiple image support with thumbnail generation
- **Recipe Versioning**: Ability to edit and maintain recipe versions

### 3. Browse & Discovery
- **Recipe Feed**: Paginated feed of all recipes with filtering options
- **Search Functionality**: Full-text search across recipes, ingredients, and authors
- **Advanced Filters**: Filter by cuisine, dietary restrictions, cook time, difficulty
- **Recipe Collections**: Curated collections and user-created playlists
- **Trending Recipes**: Popular and trending recipe discovery

### 4. Social Features
- **Recipe Rating & Reviews**: Star ratings and text reviews
- **Comments System**: Threaded comments on recipes
- **Following System**: Follow favorite recipe creators
- **Recipe Sharing**: Share recipes via social media and direct links
- **Recipe Favorites**: Save recipes to personal collection

### 5. Enhanced Features
- **Meal Planning**: Weekly meal planner integration
- **Shopping Lists**: Auto-generate shopping lists from recipes
- **Recipe Scaling**: Automatic ingredient scaling for different serving sizes
- **Nutrition Information**: Basic nutritional data display
- **Print-Friendly Views**: Optimized recipe printing

## Tech Stack

### Frontend
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui or Radix UI
- **State Management**: Zustand or React Context
- **Form Handling**: React Hook Form with Zod validation
- **Image Handling**: Next.js Image component with optimization

### Backend & Database
- **Backend-as-a-Service**: Supabase
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth
- **File Storage**: Supabase Storage for recipe images
- **Real-time**: Supabase Realtime for live comments/ratings

### Additional Tools
- **Rich Text Editor**: Tiptap or React-Quill
- **Image Upload**: React-Dropzone with Supabase Storage
- **Email**: Supabase built-in email or Resend
- **Deployment**: Vercel
- **Analytics**: Vercel Analytics or PostHog

## Database Schema

### Core Tables
```sql
-- Users (handled by Supabase Auth)
profiles (
  id uuid references auth.users,
  username text unique,
  full_name text,
  bio text,
  avatar_url text,
  created_at timestamp,
  updated_at timestamp
)

-- Recipes
recipes (
  id uuid primary key,
  user_id uuid references profiles(id),
  title text not null,
  description text,
  prep_time integer,
  cook_time integer,
  servings integer,
  difficulty text,
  cuisine text,
  meal_type text,
  dietary_restrictions text[],
  ingredients jsonb,
  instructions jsonb,
  created_at timestamp,
  updated_at timestamp
)

-- Recipe Images
recipe_images (
  id uuid primary key,
  recipe_id uuid references recipes(id),
  image_url text,
  is_primary boolean,
  alt_text text
)

-- Categories
categories (
  id uuid primary key,
  name text unique,
  description text,
  slug text unique
)

-- Recipe Categories (many-to-many)
recipe_categories (
  recipe_id uuid references recipes(id),
  category_id uuid references categories(id)
)

-- Reviews & Ratings
reviews (
  id uuid primary key,
  recipe_id uuid references recipes(id),
  user_id uuid references profiles(id),
  rating integer check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamp
)

-- Recipe Collections
collections (
  id uuid primary key,
  user_id uuid references profiles(id),
  name text,
  description text,
  is_public boolean default false
)

-- Collection Recipes (many-to-many)
collection_recipes (
  collection_id uuid references collections(id),
  recipe_id uuid references recipes(id),
  added_at timestamp
)

-- User Follows
user_follows (
  follower_id uuid references profiles(id),
  following_id uuid references profiles(id),
  created_at timestamp
)
```

## Step-by-Step Implementation Guide

### Phase 1: Foundation Setup (Week 1)
1. **Project Setup**
   - Initialize Next.js project with TypeScript
   - Setup Tailwind CSS and UI component library
   - Configure ESLint and Prettier
   - Setup Supabase project and environment variables

2. **Authentication System**
   - Implement Supabase Auth integration
   - Create login/signup pages
   - Setup protected routes and middleware
   - Create user profile management

3. **Basic Layout & Navigation**
   - Create responsive layout components
   - Implement navigation with user state
   - Setup basic routing structure

### Phase 2: Core Recipe Features (Week 2-3)
1. **Database Setup**
   - Create Supabase tables and relationships
   - Setup Row Level Security (RLS) policies
   - Configure storage bucket for images

2. **Recipe Creation**
   - Build recipe creation form with validation
   - Implement image upload functionality
   - Create rich text editor for instructions
   - Setup ingredient management system

3. **Recipe Display**
   - Create recipe detail page
   - Implement responsive recipe cards
   - Add recipe image gallery

### Phase 3: Browse & Discovery (Week 3-4)
1. **Recipe Feed**
   - Implement paginated recipe listing
   - Create search functionality
   - Add filtering and sorting options

2. **Categories & Tags**
   - Setup category management
   - Implement category-based browsing
   - Create tag system for recipes

### Phase 4: Social Features (Week 4-5)
1. **Rating & Review System**
   - Implement star rating component
   - Create review/comment system
   - Add moderation capabilities

2. **User Interactions**
   - Implement recipe favoriting
   - Create user following system
   - Add recipe sharing functionality

### Phase 5: Enhanced Features (Week 5-6)
1. **Collections & Meal Planning**
   - Create recipe collections
   - Implement meal planning calendar
   - Add shopping list generation

2. **Advanced Features**
   - Recipe scaling functionality
   - Nutrition information display
   - Print-friendly recipe views

### Phase 6: Optimization & Launch (Week 6-7)
1. **Performance & SEO**
   - Implement SEO optimization
   - Add loading states and error handling
   - Optimize images and performance

2. **Testing & Deployment**
   - Add unit and integration tests
   - Setup CI/CD pipeline
   - Deploy to production

## Success Metrics

- **User Engagement**: Daily/Monthly active users, time spent on platform
- **Content Creation**: Number of recipes uploaded per month
- **Social Interaction**: Recipe ratings, comments, and shares
- **User Retention**: Return user rate and recipe creation frequency

## Future Enhancements

- Mobile app development
- Advanced AI recipe recommendations
- Video recipe support
- Cooking timer integration
- Community challenges and contests
- Recipe monetization features