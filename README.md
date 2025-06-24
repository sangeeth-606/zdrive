# zDrive 🚀

> ⚠️ **Development Status**: This project is currently in active development. Features may be incomplete and breaking changes are expected. Not recommended for production use yet.

A modern, full-stack cloud storage application built with Next.js 15, featuring secure file management, user authentication, and a sleek UI.

## ✨ Features

- **🔐 Secure Authentication** - Powered by Clerk for robust user management
- **📁 File & Folder Management** - Organize your files with hierarchical folder structures
- **☁️ Cloud Storage** - Upload and store files with UploadThing integration
- **🎨 Modern UI** - Beautiful gradient design with Tailwind CSS and Radix UI components
- **📊 Database Management** - Efficient data handling with Drizzle ORM and SingleStore
- **📈 Analytics** - User behavior tracking with PostHog
- **🚀 Performance** - Built on Next.js 15 with Turbo mode for lightning-fast development
- **📱 Responsive Design** - Works seamlessly across all devices

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible, unstyled UI components
- **Lucide React** - Beautiful SVG icons

### Backend & Database
- **Drizzle ORM** - Type-safe database toolkit
- **SingleStore** - High-performance distributed SQL database
- **MySQL2** - Database driver
- **Zod** - Runtime type validation

### Authentication & File Upload
- **Clerk** - Complete authentication solution
- **UploadThing** - File upload infrastructure

### Development Tools
- **TypeScript** - Static type checking
- **ESLint** - Code linting with Next.js configuration
- **Prettier** - Code formatting
- **pnpm** - Fast, disk space efficient package manager

### Analytics & Monitoring
- **PostHog** - Product analytics and feature flags

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- SingleStore database instance

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/zdrive.git
   cd zdrive
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Environment Setup**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Database
   DATABASE_URL="your_database_url"
   SINGLESTORE_USER="your_singlestore_user"
   SINGLESTORE_PASS="your_singlestore_password"
   SINGLESTORE_HOST="your_singlestore_host"
   SINGLESTORE_PORT="3306"
   SINGLESTORE_DB_NAME="your_database_name"

   # Authentication (Clerk)
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
   CLERK_SECRET_KEY="your_clerk_secret_key"
   NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
   NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"

   # File Upload (UploadThing)
   UPLOADTHING_SECRET="your_uploadthing_secret"
   UPLOADTHING_APP_ID="your_uploadthing_app_id"

   # Analytics (PostHog)
   NEXT_PUBLIC_POSTHOG_KEY="your_posthog_key"
   ```

4. **Database Setup**
   ```bash
   # Generate database migrations
   pnpm db:generate
   
   # Run migrations
   pnpm db:migrate
   
   # (Optional) Seed the database
   pnpm db:push
   ```

5. **Start Development Server**
   ```bash
   pnpm dev
   ```

   Visit [http://localhost:3000](http://localhost:3000) to see your application.

## 📝 Available Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start development server with Turbo mode |
| `pnpm build` | Build the application for production |
| `pnpm start` | Start the production server |
| `pnpm preview` | Build and start production server |
| `pnpm lint` | Run ESLint for code quality |
| `pnpm lint:fix` | Fix ESLint issues automatically |
| `pnpm format:check` | Check code formatting |
| `pnpm format:write` | Format code with Prettier |
| `pnpm typecheck` | Run TypeScript type checking |
| `pnpm check` | Run linting and type checking |
| `pnpm db:generate` | Generate database migrations |
| `pnpm db:migrate` | Run database migrations |
| `pnpm db:push` | Push schema to database |
| `pnpm db:studio` | Open Drizzle Studio for database management |

## 🏗️ Project Structure

```
zdrive/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (home)/            # Home route group
│   │   │   ├── drive/         # Main drive interface
│   │   │   └── sign-in/       # Authentication pages
│   │   ├── api/               # API routes
│   │   │   └── uploadthing/   # File upload endpoints
│   │   ├── f/[folderId]/      # Dynamic folder routes
│   │   └── _providers/        # React context providers
│   ├── components/            # Reusable UI components
│   │   └── ui/               # Base UI components
│   ├── lib/                  # Utility functions and configurations
│   ├── server/               # Server-side code
│   │   ├── actions.ts        # Server actions
│   │   └── db/              # Database layer
│   └── styles/              # Global styles
├── drizzle/                 # Database migrations and schema
├── public/                  # Static assets
└── scripts/                # Utility scripts
```

## 🗄️ Database Schema

The application uses a relational database with the following main entities:

- **Files Table** - Stores file metadata (name, size, URL, owner, parent folder)
- **Folders Table** - Manages folder hierarchy and organization
- **User Management** - Handled by Clerk authentication

## 🔧 Configuration Files

- `drizzle.config.ts` - Database configuration and migrations
- `tailwind.config.ts` - Tailwind CSS customization
- `next.config.js` - Next.js configuration
- `eslint.config.js` - ESLint rules and settings
- `prettier.config.js` - Code formatting preferences

## 🚀 Deployment

### Netlify (Recommended)

The project includes a `netlify.toml` configuration for easy deployment:

1. Push your code to a Git repository
2. Connect your repository to Netlify
3. Set up environment variables in Netlify dashboard
4. Deploy automatically on every commit



## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Create T3 App](https://create.t3.gg/)
- UI components from [Radix UI](https://www.radix-ui.com/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)
- Authentication by [Clerk](https://clerk.com/)
- File uploads powered by [UploadThing](https://uploadthing.com/)

---

Made with ❤️ 