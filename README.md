<div align="center">

<img src="https://gym-pilot-client.vercel.app/favicon.ico" width="64" alt="GymPilot Logo" />

# 🏋️ GymPilot — Fitness & Gym Management Platform

**A modern, full-featured gym management and fitness platform built with Next.js**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-gym--pilot--client.vercel.app-brightgreen?style=for-the-badge&logo=vercel)](https://gym-pilot-client.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-v4-38BDF8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7-47A248?style=for-the-badge&logo=mongodb)](https://mongodb.com/)

</div>

---

## 📖 Overview

**GymPilot** is a comprehensive fitness and gym management web application that connects members with world-class trainers, group classes, and a thriving community. It features user authentication, class browsing, a community forum, subscription payments via Stripe, and an admin dashboard — all wrapped in a sleek, animated UI.

> 🌐 **Live site:** [https://gym-pilot-client.vercel.app/](https://gym-pilot-client.vercel.app/)

---

## ✨ Features

- 🏠 **Landing Page** — Hero section, featured classes, member testimonials, and achievement stats
- 🧘 **All Classes** — Browse and explore available fitness classes
- 💬 **Community Forum** — Engage with fellow members
- 🔐 **Authentication** — Secure sign-in / sign-up powered by [Better Auth](https://www.better-auth.com/)
- 💳 **Payments** — Stripe-integrated subscription and free trial flows
- 🎨 **Smooth Animations** — Framer Motion powered transitions and interactions
- 📱 **Fully Responsive** — Mobile-first design using HeroUI + Tailwind CSS v4
- 🛠️ **Admin Area** — (Dashboard for managing members, classes, and trainers)

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) |
| **UI Library** | React 19 |
| **Styling** | Tailwind CSS v4 + HeroUI v3 |
| **Animations** | Framer Motion |
| **Auth** | Better Auth + MongoDB Adapter |
| **Database** | MongoDB 7 |
| **Payments** | Stripe |
| **Icons** | Lucide React + Gravity UI Icons |
| **Linting** | ESLint (Next.js config) |
| **Deployment** | Vercel |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **npm**, **yarn**, **pnpm**, or **bun**
- A running **MongoDB** instance (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- A **Stripe** account for payment integration

### 1. Clone the Repository

```bash
git clone https://github.com/mehedi-hasan2006/gym-pilot-client.git
cd gym-pilot-client
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory and add the following:

```env
# MongoDB
MONGODB_URI=your_mongodb_connection_string

# Better Auth
BETTER_AUTH_SECRET=your_auth_secret
BETTER_AUTH_URL=http://localhost:3000

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

---

## 📁 Project Structure

```
gym-pilot-client/
├── public/               # Static assets (images, icons)
├── src/
│   ├── app/              # Next.js App Router pages & layouts
│   │   ├── (auth)/       # Sign-in / Sign-up routes
│   │   ├── all-classes/  # Classes listing page
│   │   ├── community-forum/ # Community page
│   │   └── ...           # Other routes
│   ├── components/       # Reusable UI components
│   ├── lib/              # Utility functions & configs (auth, db, stripe)
│   └── styles/           # Global styles
├── .env.local            # Environment variables (not committed)
├── next.config.mjs       # Next.js configuration
├── tailwind.config.js    # Tailwind CSS configuration
└── package.json
```

---

## 🌍 Deployment

This project is deployed on **Vercel**. To deploy your own instance:

1. Push your code to GitHub.
2. Import the repository at [vercel.com/new](https://vercel.com/new).
3. Add all environment variables from `.env.local` in the Vercel dashboard.
4. Click **Deploy**.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/mehedi-hasan2006/gym-pilot-client)

---

## 🤝 Contributing

Contributions are welcome! To get started:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to your branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

Please follow the existing code style and keep commits descriptive.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

Made with ❤️ by [mehedi-hasan2006](https://github.com/mehedi-hasan2006)

⭐ If you find this project useful, please give it a star!

</div>