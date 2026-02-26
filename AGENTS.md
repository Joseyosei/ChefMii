## Project Summary
ChefMii Global is a comprehensive platform connecting chefs, vendors (farmers), businesses, and individuals in the culinary industry. It features a supply marketplace, chef hiring, event packages, and educational resources (ChefMii Academy).

## Tech Stack
- Frontend: React (Vite), TypeScript, Tailwind CSS, Shadcn UI
- Backend/Database: Supabase (PostgreSQL, Auth, Storage)
- Payments: Stripe
- Icons: Lucide React
- Routing: React Router DOM

## Architecture
- `src/pages/`: Page components representing different routes.
- `src/components/`: Reusable UI components.
- `src/integrations/supabase/`: Supabase client and generated types.
- `src/hooks/`: Custom React hooks for auth and data fetching.
- `supabase/migrations/`: Database schema migrations.

## User Preferences
- Use functional components.
- No comments unless requested.
- Use Lucide icons for UI elements.
- Maintain a clean, premium, and distinctive "foodie" aesthetic.

## Project Guidelines
- Always use the App Router-like patterns if applicable, though currently using React Router.
- Keep 'use client' if porting to Next.js.
- Dashboard links are role-based (Chef, Vendor, Business, etc.).

## Common Patterns
- Data fetching using React Query (via Supabase integrations).
- Form handling with custom hooks or standard React state.
- Tooltips used for secondary information (e.g., bulk pricing details).
