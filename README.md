# Golf Charity Platform

A modern web application that enables users to support charitable causes through seamless online donations.

## 🚀 Features

* 🔐 User authentication using Supabase
* 🛡️ Protected routes for authorized users
* 💳 Secure payments powered by Stripe
* ⚡ Fast and responsive UI built with Next.js
* 📱 Mobile-friendly design

---

## 🛠️ Tech Stack

* **Frontend:** Next.js (App Router)
* **Backend/Auth:** Supabase
* **Payments:** Stripe
* **Styling:** Tailwind CSS

---

## 📦 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/MrSayyed/golf-charity-platform.git
cd golf-charity-platform
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory and add:

```env
NEXT_PUBLIC_SUPABASE_URL=https://uyoxeplfeuepotyzrnfv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5b3hlcGxmZXVlcG90eXpybmZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwMjM3MzcsImV4cCI6MjA5MDU5OTczN30.qw1vUaKPIhmTQRmRzSLIZ7IRJtr5kqxJKP51WnZOM5Y

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51THM86GxeVR3zW6uKkIvKBOruCvFIeGa4Hl1vRRLGL3GRQIrQxhdFAdV2pzeuNbJz3ZeLsmykJ9gCuyYHybKeEAd00yQZ4ePO9

STRIPE_SECRET_KEY=your_stripe_secret_key
```

### 4. Run the development server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

---

## 🔐 Authentication

Authentication is handled using Supabase, with session management and protected routes implemented via middleware.

---

## 💳 Payments

Stripe is integrated for secure payment processing using Checkout Sessions.

---

## 📌 Future Improvements

* Donation history for users
* Admin dashboard for managing campaigns
* Email notifications for transactions
* Enhanced UI/UX

---

## 📄 License

This project is open-source and available under the MIT License.
