# ChefMii Mobile App

A cross-platform mobile application for the ChefMii chef booking marketplace, built with React Native and Expo.

## 📱 Platforms

- **iOS** (iPhone & iPad)
- **Android** (Phones & Tablets)

## 🚀 Features

### Core Features
- **Browse & Search Chefs** - Find professional chefs by cuisine, location, and availability
- **Chef Profiles** - View detailed chef information, reviews, and portfolios
- **Booking System** - Book chefs for private dining, events, or cooking classes
- **Cart & Checkout** - Manage bookings and complete secure payments
- **User Authentication** - Sign up, login, and manage your account
- **Booking Management** - View, track, and manage your bookings

### Navigation
- Bottom tab navigation for main sections
- Stack navigation for detailed screens
- Smooth transitions and animations

## 🛠️ Tech Stack

- **React Native** - Cross-platform mobile framework
- **Expo** - Development and build toolchain
- **TypeScript** - Type-safe JavaScript
- **React Navigation** - Navigation library
- **Supabase** - Backend as a Service (Auth, Database, Storage)
- **Expo Linear Gradient** - Beautiful gradient effects
- **React Native Reanimated** - Smooth animations

## 📦 Installation

### Prerequisites
- Node.js 18+
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac) or Android Emulator

### Setup

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/Joseyosei/orchids-ChefMii.git
   cd orchids-ChefMii/chefmii-mobile
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Configure Supabase**
   
   Update the Supabase credentials in \`src/lib/supabase.ts\`:
   \`\`\`typescript
   const SUPABASE_URL = 'your-supabase-url';
   const SUPABASE_ANON_KEY = 'your-supabase-anon-key';
   \`\`\`

4. **Start the development server**
   \`\`\`bash
   npm start
   \`\`\`

5. **Run on device/simulator**
   - Press \`i\` for iOS Simulator
   - Press \`a\` for Android Emulator
   - Scan QR code with Expo Go app for physical device

## 📁 Project Structure

\`\`\`
chefmii-mobile/
├── App.tsx                 # Entry point
├── app.json               # Expo configuration
├── package.json           # Dependencies
├── tsconfig.json          # TypeScript config
├── babel.config.js        # Babel config
├── assets/                # Static assets (icons, splash)
└── src/
    ├── components/        # Reusable UI components
    │   ├── Button.tsx
    │   ├── ChefCard.tsx
    │   ├── CategoryCard.tsx
    │   ├── ReviewCard.tsx
    │   └── FilterModal.tsx
    ├── contexts/          # React Context providers
    │   ├── AuthContext.tsx
    │   └── CartContext.tsx
    ├── hooks/             # Custom React hooks
    ├── lib/               # Utilities and configurations
    │   └── supabase.ts
    ├── navigation/        # Navigation configuration
    │   └── RootNavigator.tsx
    ├── screens/           # Screen components
    │   ├── HomeScreen.tsx
    │   ├── FindChefsScreen.tsx
    │   ├── ChefDetailScreen.tsx
    │   ├── BookingScreen.tsx
    │   ├── BookingsScreen.tsx
    │   ├── CartScreen.tsx
    │   ├── CheckoutScreen.tsx
    │   ├── ProfileScreen.tsx
    │   ├── LoginScreen.tsx
    │   ├── RegisterScreen.tsx
    │   ├── ForgotPasswordScreen.tsx
    │   └── BookingConfirmationScreen.tsx
    └── types/             # TypeScript type definitions
        └── index.ts
\`\`\`

## 🏗️ Building for Production

### iOS
\`\`\`bash
eas build --platform ios
\`\`\`

### Android
\`\`\`bash
eas build --platform android
\`\`\`

### Both Platforms
\`\`\`bash
eas build --platform all
\`\`\`

## 🎨 Design System

### Colors
- **Primary**: #F97316 (Orange)
- **Secondary**: #EA580C (Dark Orange)
- **Success**: #10B981 (Green)
- **Warning**: #F59E0B (Amber)
- **Error**: #EF4444 (Red)
- **Text Primary**: #1F2937
- **Text Secondary**: #6B7280
- **Background**: #F9FAFB

### Typography
- **Headers**: Bold, 20-32px
- **Body**: Regular, 14-16px
- **Captions**: Regular, 12-13px

## 🧪 Testing with Ralph

This project includes a \`prd.json\` file for testing with the [Ralph](https://github.com/snarktank/ralph) autonomous AI agent loop.

\`\`\`bash
# Install Ralph
cp /path/to/ralph/ralph.sh scripts/ralph/
cp /path/to/ralph/CLAUDE.md scripts/ralph/

# Run Ralph
./scripts/ralph/ralph.sh
\`\`\`

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

Built with ❤️ for ChefMii
