# Elijah's Discounts — Premium Designer Fashion Outlet

> **"Style for Less. Always."**  
> Curated clothing, luxury outerwear, and handcrafted footwear outlet based in **Fort Worth, Texas**.

---

## 1. Client Information

- **Business Name:** Elijah's Discounts
- **Category:** Online discount retail store, clothing and fashion focused (Men, Women, Kids, Shoes, Accessories)
- **Showroom Address:** 2609 Castaneda Cir, Fort Worth, TX 76112, USA
- **Phone:** (619) 807-4468
- **Email:** mrmuhammadseniors@yahoo.com
- **Timezone:** America/Chicago (CST) | **Currency:** USD ($)
- **Texas Sales Tax:** 8.25% (state 6.25% + Fort Worth transit 2.0%)
- **Free Shipping Threshold:** $75.00 | **Local Pickup:** Free same-day at Fort Worth showroom

---

## 2. Architecture & Tech Stack

- **Frontend & App Engine:** React 19 + TypeScript + Vite + Tailwind CSS v4
- **Typography:** Google Fonts ("Instrument Serif" display + "DM Sans" body prose + "JetBrains Mono" tabular numerals)
- **State Management & Persistence:** Unified `StoreContext` with atomic stock decrement, cart calculations, coupon engine, and `localStorage` persistence
- **Payments:** Stripe Checkout (Test Mode simulation with card `4242 4242 4242 4242`) + Pay at Pickup / Cash on Delivery
- **Database Architecture:** Prisma ORM schema provided in `prisma/schema.prisma` with PostgreSQL models for User, Address, Category, Product, Variant, Order, Coupon, Review, ContactMessage, and ActivityLog
- **Seed Catalog:** 24 authentic fashion pieces across Men, Women, Kids, Shoes, and Accessories with realistic MSRP compare-at prices (15%–60% savings), high-resolution imagery, and variant-level stock

---

## 3. Storefront Pages & Features

1. **Editorial Homepage:**
   - Rotating top announcement bar with Fort Worth store signal
   - High-fashion editorial hero with dual CTAs ("Shop New Arrivals", "Explore Weekly Deals")
   - Department category tiles (Men, Women, Shoes, Accessories, Kids)
   - "Weekly Deals" countdown timer synchronized with admin flash-sale schedule
   - New arrivals segmented tabbed grid
   - Seasonal clearance promotional banner with `CLEARANCE20` code
   - 4-pillar brand trust strip (Free Shipping, Fort Worth Pickup, Authenticity Guarantee, 30-Day Returns)
   - Verified client reviews & lookbook quotes
   - Newsletter signup with instant `WELCOME10` discount code reward
   - Rich footer with direct showroom contact and business hours

2. **Catalog & Shop View:**
   - Deep faceted filtering: Category, Subcategory, Size, Color, Price Range slider, Brand, On-Sale Only, In-Stock Only
   - Sorting: Featured, Newest, Discount %, Price: Low to High, Price: High to Low
   - Active filter chips with one-click clear
   - Density switcher (standard vs compact grid)

3. **Product Detail View:**
   - Multi-image gallery with zoom preview
   - Variant selector with real-time stock feedback for each size & color
   - Low-stock indicator ("Only X left in Fort Worth")
   - Sizing chart modal with measurements in inches and centimeters
   - Customer reviews rating breakdown & verified review submission form
   - "You May Also Like" recommendation carousel

4. **Cart Drawer & Checkout:**
   - Free shipping progress bar
   - Coupon promo code input (`WELCOME10`, `CLEARANCE20`, `FREESHIP`, `TEXAS15`)
   - Texas sales tax (8.25%) calculation
   - Standard, Express, and Fort Worth In-Store Pickup options
   - Stripe card payment test mode simulation + Cash/Card on Pickup
   - Atomic inventory deduction upon order confirmation
   - Printable invoice and packing slip generation

5. **Customer Portal (`/account`):**
   - Order history with tracking timeline (Pending → Paid → Processing → Shipped → Delivered)
   - Carrier tracking numbers (UPS, USPS)
   - Saved address manager
   - Wishlist management

---

## 4. Admin Dashboard Guide (`/admin`)

Access the admin dashboard via the **"Admin Portal"** pill in the top header, or switch personas directly in the Account tab.

### Available Admin Modules:
- **Dashboard Overview:** KPI metrics, 30-day revenue chart, fulfillment pipeline, and recent orders.
- **Products:** Create, edit, duplicate, and delete products; automated discount % computation from MSRP; CSV import and export.
- **Inventory:** Live variant-level stock editor with inline `+ / -` adjustments and low-stock warning banners.
- **Orders:** Process orders through the fulfillment pipeline, assign carrier tracking numbers, add internal staff notes, and print packing slips.
- **Customers:** View registered client spend, order count, and contact records.
- **Coupons & Flash Sales:** Create percentage, fixed, or free-shipping promotions; set the storefront countdown timer.
- **Shipping & Taxes:** Adjust the Texas sales tax rate (default 8.25%), free shipping minimum, and toggle in-store pickup.
- **Reviews Moderation:** Approve or hide submitted customer ratings.
- **Store CMS:** Edit homepage hero copy, subhead, and announcement bar messages.
- **Messages Inbox:** View and reply to messages submitted through the Contact Showroom form.
- **Audit Logs:** Real-time log of administrative events and stock adjustments.

---

## 5. Setup & Local Development

```bash
# 1. Install dependencies
npm install

# 2. Start development server (Port 3000)
npm run dev

# 3. Build for production
npm run build

# 4. Preview production build
npm run preview
```

### PostgreSQL & Prisma Setup (For Full-Stack Next.js deployment):
```bash
# Push schema to database
npx prisma db push

# Run the seed script
npx prisma db seed
```

---

## 6. Seed Coupons for Client Testing

[![Netlify Status](https://api.netlify.com/api/v1/badges/466781aa-faaf-42d2-8e84-1c1964714da6/deploy-status)](https://app.netlify.com/projects/elijahdiscount/deploys)

| Promo Code | Discount | Minimum Spend | Description |
| :--- | :--- | :--- | :--- |
| `WELCOME10` | 10% Off | $0.00 | First purchase discount |
| `FREESHIP` | Free Shipping | $50.00 | Free standard shipping |
| `CLEARANCE20` | 20% Off | $60.00 | Extra 20% off clearance items |
| `TEXAS15` | 15% Off | $100.00 | Exclusive discount for orders $100+ |
