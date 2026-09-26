# GymOS - Intelligent Fitness Management Platform

GymOS is a modern, AI-powered gym management system built for scalability, performance, and seamless user experiences.

## Technical Architecture

GymOS follows a modular, cloud-native architecture using a React frontend and an InsForge backend.

### Frontend
- **Framework:** React 19 + Vite (TypeScript)
- **Styling:** Tailwind CSS v4, custom glassmorphism, responsive UI
- **Routing:** React Router (or equivalent)
- **State Management:** React Context / Zustand
- **Animations:** Motion (Framer Motion)
- **Testing:** Vitest + React Testing Library

### Backend (InsForge)
- **Database:** PostgreSQL (managed by InsForge BaaS)
- **Authentication:** InsForge Auth (JWT, Row Level Security)
- **Edge Functions:** InsForge Edge Functions (Deno/Node-based)
- **Storage:** S3-compatible InsForge Storage
- **Payments:** Integrated Stripe/Razorpay via InsForge

## Database Schema (Proposed)

1. **Users (Auth)**
   - `id` (UUID, Primary Key)
   - `email` (String, Unique)
   - `role` (Enum: Member, Trainer, Staff, Admin)

2. **Members**
   - `id` (UUID, Primary Key)
   - `user_id` (UUID, Foreign Key)
   - `member_code` (String, Unique)
   - `full_name` (String)
   - `plan_type` (Enum: Day Pass, Monthly, Annual, VIP)
   - `expiry_date` (Timestamp)
   - `status` (Enum: Active, Frozen, Expired)

3. **CheckInLogs**
   - `id` (UUID, Primary Key)
   - `member_id` (UUID, Foreign Key)
   - `timestamp` (Timestamp)
   - `method` (String: QR, Manual)
   - `status` (Enum: Allowed, Denied)

4. **Classes**
   - `id` (UUID, Primary Key)
   - `title` (String)
   - `trainer_id` (UUID, Foreign Key)
   - `capacity` (Int)
   - `start_time` (Timestamp)

5. **Invoices**
   - `id` (UUID, Primary Key)
   - `member_id` (UUID, Foreign Key)
   - `amount` (Decimal)
   - `status` (Enum: Pending, Paid, Overdue)

## Workflows & Process Flow

### Member Onboarding
1. **Lead Generation:** User inquiries via web/ads are captured.
2. **Registration:** Admin converts lead to Member. InsForge Auth creates user account.
3. **Billing:** Invoice generated. Payment processed via Stripe webhook.
4. **Activation:** Member status becomes `Active`.

### Check-in Flow
1. **Scan QR:** Member scans QR code at turnstile.
2. **Validation:** System checks `expiry_date` and `status`.
3. **Logging:** `CheckInLogs` table is updated.
4. **Feedback:** UI reflects Access Granted or Denied.

### Staff Geofencing
1. **Location Request:** Staff app requests GPS coordinates.
2. **Validation:** Checks if coordinates are within Gym radius.
3. **Action:** If inside, check-in approved. If outside, "Manager Review Required".

## Development Setup

```bash
# Install dependencies
npm install --legacy-peer-deps

# Start dev server
npm run dev

# Run UAT Tests
npm run test:uat

# Build for production
npm run build
```
