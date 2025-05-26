# Yalla Learn - Mobile App

<div align="center">
  <img src="./assets/images/brain-circuit.png" alt="Yalla Learn Logo" width="120" height="120" />
  
  <p align="center">
    <strong>Your campus marketplace for knowledge and resources</strong>
  </p>
  
  <p align="center">
    Connect. Learn. Thrive.
  </p>

  [![React Native](https://img.shields.io/badge/React%20Native-0.76.9-blue.svg)](https://reactnative.dev/)
  [![Expo](https://img.shields.io/badge/Expo-~52.0.43-black.svg)](https://expo.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-blue.svg)](https://www.typescriptlang.org/)
</div>

## 📖 Overview

Yalla Learn is a comprehensive mobile application designed to create a vibrant campus marketplace where students can buy, sell, and share educational resources. The platform facilitates knowledge exchange through product listings and service offerings, fostering a collaborative learning environment.

### 🎯 Key Features

- **📚 Product Marketplace**: Buy and sell textbooks, electronics, and educational materials
- **🤝 Service Exchange**: Offer and find tutoring, mentoring, and skill-sharing services
- **🔍 Smart Discovery**: Browse and filter listings with advanced search capabilities
- **📱 Cross-Platform**: Native mobile experience for iOS and Android
- **🌐 Web Integration**: Seamless web platform integration
- **🔄 Real-time Updates**: Live refresh and synchronization
- **👤 User Profiles**: Comprehensive user management system

## 🛠️ Tech Stack

### Frontend

- **Framework**: React Native 0.76.9 with Expo 52.0.43
- **Language**: TypeScript 5.3.3
- **Navigation**: Expo Router 4.0.20
- **UI Library**: Gluestack UI with NativeWind
- **Styling**: TailwindCSS 3.4.17 with NativeWind 4.1.23
- **State Management**: Redux Toolkit 2.7.0 with Redux Persist 6.0.0
- **Forms**: React Hook Form 7.55.0 with Yup/Zod validation
- **Icons**: Lucide React Native 0.509.0, Expo Vector Icons 14.0.2

### Development Tools

- **Package Manager**: npm
- **Code Quality**: ESLint with Expo preset

### Core Dependencies

- **HTTP Client**: Axios 1.9.0
- **Storage**: AsyncStorage 2.1.2
- **Image Handling**: Expo Image Picker 16.0.6
- **Web View**: React Native WebView 13.12.5
- **Animations**: Reanimated 3.16.1, Legend Motion 2.4.0

## 🚀 Quick Start

### Prerequisites

- Node.js (LTS version recommended)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio & Android SDK (for Android development)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/KhaledSaeed18/yalla-learn-app.git
   cd yalla-learn-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm start
   ```

### Platform-Specific Commands

```bash
# iOS Development
npm run ios

# Android Development  
npm run android

# Web Development
npm run web
```

## 📱 Project Structure

```
yalla-learn-app/
├── app/                    # App router pages and layouts
│   ├── (tabs)/            # Tab-based navigation pages
│   │   ├── index.tsx      # Home page
│   │   ├── listings.tsx   # Listings page
│   │   └── services.tsx   # Services page
│   └── _layout.tsx        # Root layout
├── components/            # Reusable UI components
│   └── ui/               # UI component library
│       ├── heading/      # Heading components
│       ├── text/         # Text components
│       ├── button/       # Button components
│       ├── listing-card/ # Product listing cards
│       └── service-card/ # Service cards
├── services/             # API service layer
├── types/                # TypeScript type definitions
├── assets/               # Static assets (images, fonts)
└── styles/               # Global styles and themes
```

## 🔧 Configuration

### Environment Setup

The project uses Expo's managed workflow with the following key configurations:

- **App Configuration**: `app.json` - Expo app settings
- **Tailwind Configuration**: `tailwind.config.js` - Styling configuration
- **Gluestack Configuration**: `gluestack-ui.config.json` - UI component settings

### Development Scripts

```bash
# Start development server
npm start

# Lint code
npm run lint

# Reset project (development utility)
npm run reset-project
```

## 🎨 UI/UX Design System

The application follows a consistent design system powered by:

- **Gluestack UI**: Component library with native performance
- **TailwindCSS**: Utility-first CSS framework
- **Custom Color Palette**: Primary, secondary, success, error, warning, info themes
- **Typography System**: Consistent heading and text styles
- **Responsive Design**: Adaptive layouts for different screen sizes

## 📋 Available Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start Expo development server |
| `npm run ios` | Start iOS development build |
| `npm run android` | Start Android development build |
| `npm run web` | Start web development build |
| `npm test` | Run test suite in watch mode |
| `npm run lint` | Run ESLint code analysis |

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes following our coding standards
4. Run linting: `npm run lint`
5. Commit your changes with clear messages
6. Push to your fork and submit a pull request

### Code Style

- Follow TypeScript best practices
- Use ESLint configuration provided
- Maintain consistent component structure
- Write meaningful commit messages
- Add comments for complex logic

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

- **Bug Reports**: [GitHub Issues](https://github.com/KhaledSaeed18/yalla-learn-app/issues)

<div align="center">

## 🌐 Visit Our Website

**Experience Yalla Learn in your browser!**

### [🚀 Try Yalla Learn →](https://yalla-learn.me)

</div>
