# Nexus Portfolio CMS

A terminal-style portfolio website with integrated CMS for managing content. Built with React, TypeScript, Tailwind CSS, and Supabase.

## ✨ Features

- **Interactive Terminal UI** - Unique terminal-style portfolio with functional commands
- **Admin CMS** - Full CRUD operations for all portfolio content
- **Authentication** - Email/password, Google, and GitHub OAuth
- **Role-Based Access** - Restrict CMS access to specific email addresses
- **Real-time Data** - Portfolio data fetched from Supabase database
- **Responsive Design** - Works on desktop and mobile devices
- **Vercel Deployment** - Optimized for Vercel hosting

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui, Radix UI
- **State Management**: TanStack Query
- **Routing**: React Router DOM
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Build Tool**: Vite
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js 18+ and npm
- A Supabase account and project
- (Optional) Vercel account for deployment

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/nexus.ilramdhan.dev.git
cd nexus.ilramdhan.dev
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy the example environment file and fill in your values:

```bash
cp .env.example .env
```

Edit `.env` with your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_ALLOWED_ADMIN_EMAILS=youremail@gmail.com,another@email.com
VITE_SITE_URL=https://yourdomain.com
VITE_SITE_NAME=Your Portfolio Name
```

### 4. Run Database Migrations

Run the SQL migrations in your Supabase dashboard:

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Execute the migration files in order:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_storage_policies.sql`

### 5. Create Storage Bucket

In Supabase dashboard:

1. Navigate to **Storage**
2. Create a new bucket named `ilramdhan.dev`
3. Set it to **Public** for public file access

### 6. Run the Seeder (Optional)

After creating your admin account, you can populate test data:

1. Sign up through the CMS (`/admin/login`)
2. Get your User ID from Supabase dashboard: **Authentication** → **Users**
3. Open `supabase/seed.sql`, replace all `YOUR_USER_UUID` with your actual UUID
4. Run the SQL in Supabase SQL Editor

### 7. Start Development Server

```bash
npm run dev
```

Open [http://localhost:8080](http://localhost:8080) to view the portfolio.

## 🔐 Setting Up Authentication

### Enable OAuth Providers

In your Supabase dashboard:

1. Go to **Authentication** → **Providers**
2. Enable **Google**:
   - Get OAuth credentials from [Google Cloud Console](https://console.cloud.google.com/)
   - Add authorized redirect URI: `https://your-project-ref.supabase.co/auth/v1/callback`
   - Enter Client ID and Client Secret in Supabase
3. Enable **GitHub**:
   - Create OAuth app in [GitHub Developer Settings](https://github.com/settings/developers)
   - Add callback URL: `https://your-project-ref.supabase.co/auth/v1/callback`
   - Enter Client ID and Client Secret in Supabase

### Configure Redirect URLs

In Supabase **Authentication** → **URL Configuration**:

- Site URL: `https://yourdomain.com`
- Redirect URLs: Add `https://yourdomain.com/admin/callback`

For local development, also add:
- `http://localhost:8080/admin/callback`

### Restrict Admin Access

Set allowed admin emails in your `.env`:

```env
VITE_ALLOWED_ADMIN_EMAILS=your.email@gmail.com,github-email@users.noreply.github.com
```

Only these emails can access the CMS. Leave empty to allow all authenticated users.

## 📂 Project Structure

```
nexus.ilramdhan.dev/
├── public/                 # Static assets
│   ├── favicon.svg        # Terminal-themed favicon
│   └── robots.txt
├── src/
│   ├── components/        # React components
│   │   ├── admin/        # Admin panel components
│   │   └── ui/           # shadcn/ui components
│   ├── contexts/         # React contexts (Auth)
│   ├── hooks/            # Custom hooks
│   ├── integrations/     # Supabase client
│   ├── pages/            # Page components
│   │   └── admin/        # CMS pages
│   ├── types/            # TypeScript types
│   ├── App.tsx           # Main app with routing
│   └── main.tsx          # Entry point
├── supabase/
│   ├── migrations/       # SQL migrations
│   └── seed.sql          # Seed data
├── .env.example          # Environment template
├── vercel.json           # Vercel config
└── README.md
```

## 🖥️ Terminal Commands

The portfolio terminal supports these commands:

| Command | Description |
|---------|-------------|
| `help` | Show all available commands |
| `about` | Display bio/about information |
| `projects` | List all portfolio projects |
| `project <n>` | Show detailed project info |
| `articles` | List published blog posts |
| `article <n>` | Read specific article |
| `skills` | Display tech stack by category |
| `experience` | Show work experience |
| `contact` | Display contact information |
| `social` | Show social media links |
| `ascii` | Display ASCII art logo |
| `tree` | Show file structure |
| `ls` | List directory contents |
| `cd <dir>` | Change directory |
| `pwd` | Print working directory |
| `whoami` | Display current user |
| `date` | Show current date/time |
| `clear` | Clear terminal screen |

## 🌐 Deployment on Vercel

### Automatic Deployment

1. Push your code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Environment Variables in Vercel

Add these in Vercel project settings:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_ALLOWED_ADMIN_EMAILS`
- `VITE_SITE_URL`
- `VITE_SITE_NAME`

### Build Settings

Vercel should auto-detect these settings:
- **Framework**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

## 📝 CMS Usage

Access the CMS at `/admin`:

1. **Dashboard** - Overview of all content counts
2. **Projects** - Manage portfolio projects
3. **Blogs** - Write and publish articles
4. **Resume** - Add work experience and education
5. **Services** - List services you offer
6. **Certificates** - Showcase certifications
7. **Tech Stack** - Manage skills by category
8. **Messages** - View contact form submissions
9. **Settings** - Profile and site configuration

## 🔧 Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## 📄 License

MIT License - feel free to use this project for your own portfolio!

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.

---

Built with ❤️ by [Ilham Ramadhan](https://ilramdhan.dev)
