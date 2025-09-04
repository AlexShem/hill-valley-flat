# Hill Valley Flat Website Template

A modern, responsive website template built with Next.js for showcasing rental properties, apartments, or real estate
listings. This template features multilingual support, image galleries, contact forms, and a moving sale inventory
system powered by Supabase.

## ✨ Features

- **Responsive Design**: Optimized for desktop and mobile devices
- **Multilingual Support**: Built-in English/German language toggle
- **Image Galleries**: Photo galleries for property showcase
- **Moving Sale System**: Inventory management for items with Supabase backend
- **Contact Forms**: Integrated contact and visit booking forms
- **Modern UI**: Built with Tailwind CSS and shadcn/ui components
- **Performance Optimized**: Uses Next.js 15 with Turbopack

## 🛠 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 18.17 or later)
- **npm** (comes with Node.js) or **yarn** or **pnpm**
- **Git** for version control
- **Supabase account** (free tier available)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/hill-valley-flat-website.git
cd hill-valley-flat-website
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Set Up Supabase Project

#### Create a New Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose your organization and enter project details:
    - **Name**: Your project name (e.g., "my-property-website")
    - **Database Password**: Create a strong password
    - **Region**: Choose the closest region to your users
4. Click "Create new project" and wait for setup to complete

#### Get Your Supabase Credentials

1. In your Supabase dashboard, go to **Settings > API**
2. Copy the following values:
    - **Project URL** (under "Project URL")
    - **anon public key** (under "Project API keys")

### 4. Configure Environment Variables

1. Copy the example environment file:

    ```bash
    copy .env.example .env.local
    ```

2. Open `.env.local` and update with your Supabase credentials:

    ```bash
    NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
    ```

### 5. Set Up Database Schema

#### Option A: Using Supabase CLI (Recommended)

1. Install Supabase CLI:

    ```bash
    npm install -g supabase
    ```

2. Login to Supabase:

    ```bash
    supabase login
    ```

3. Link your project:

    ```bash
    supabase link --project-ref your-project-id
    ```

4. Push the database schema:

    ```bash
    supabase db push
    ```

#### Option B: Manual Setup

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the contents of `supabase/migrations/20250820190300_create_items_table.sql`
3. Paste and run the SQL to create the items table and related functions

### 6. Create Storage Bucket for Images

1. In your Supabase dashboard, go to **Storage**
2. Click "Create bucket"
3. Name it `images` (or update the bucket name in your code accordingly)
4. Set the bucket to **Public** if you want images to be publicly accessible
5. Configure bucket policies as needed for your use case

### 7. Customize Your Content

#### Update Property Information

Edit the translation files in `lib/translations.ts` to customize:

- Property details (title, location, pricing)
- Contact information
- Feature descriptions
- All text content

#### Add Your Images

Replace the images in the `public/` directory:

- `hill-valley-hero.png` - Main hero image
- `agency-*.jpg` - Agency setup photos
- `move-in-*.jpg` - Empty apartment photos
- Payment icons and logos as needed

#### Update Site Metadata

Edit `app/layout.tsx` to update:

- Site title and description
- Meta tags and SEO information
- Favicon and other icons

### 8. Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see your website.

## 📁 Project Structure

```
├── app/                    # Next.js 15 app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── Hero.tsx          # Hero section
│   ├── PhotoGallery.tsx  # Image gallery
│   └── ...               # Other components
├── lib/                   # Utility functions
│   ├── supabase.ts       # Supabase client
│   ├── translations.ts   # Multi-language content
│   └── utils.ts          # Helper functions
├── public/               # Static assets
├── supabase/            # Database schema and config
└── hooks/               # Custom React hooks
```

## 🎨 Customization

### Styling

- Uses **Tailwind CSS 4** for styling
- Component library: **shadcn/ui**
- Dark/light mode support with **next-themes**
- Responsive design built-in

### Adding New Languages

1. Add translations to `lib/translations.ts`
2. Update the language toggle in `components/LanguageToggle.tsx`
3. Add new language options to the provider

### Modifying the Moving Sale System

- Database schema: `supabase/migrations/`
- Types: `lib/database.types.ts`
- Components: `components/MovingSale.tsx`, `components/ItemModal.tsx`

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy automatically on every push

### Other Deployment Options

- **Netlify**: Similar process to Vercel
- **Railway**: Good for full-stack deployments
- **Self-hosted**: Use `npm run build` and `npm start`

## 📦 Key Dependencies

- **Next.js 15**: React framework with app router
- **TypeScript**: Type safety
- **Tailwind CSS 4**: Utility-first CSS framework
- **Supabase**: Backend-as-a-Service for database and auth
- **shadcn/ui**: Modern UI components
- **Framer Motion**: Animations and transitions
- **React Hook Form**: Form handling
- **Lucide React**: Icon library

## 🔧 Configuration Files

- `next.config.ts` - Next.js configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration
- `components.json` - shadcn/ui configuration
- `supabase/config.toml` - Supabase local development

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 📞 Support

If you need help setting up this template:

1. Check the [Next.js documentation](https://nextjs.org/docs)
2. Visit [Supabase documentation](https://supabase.com/docs)
3. Open an issue in this repository

---

Made with ❤️ using Next.js and Supabase
