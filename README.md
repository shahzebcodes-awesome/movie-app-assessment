# Movie Ticket Booking App

A premium, React Native cinema ticketing application built to demonstrate senior-level front-end architecture, performance optimization, and pixel-perfect UI implementation.

## Features

- **Bottom Tab Navigation**: Custom floating tab bar architecture.
- **Cinematic Watch Screen**: TMDB API integration with beautiful gradient overlays.
- **Lightning-Fast Search**: 500ms debounced search engine that transitions seamlessly between static genre grids and live API results.
- **Details & Trailer Integration**: Full-screen cinematic layouts, dynamic genre badges, and a fully functional embedded YouTube trailer player.
- **Interactive Seat Mapping Flow**: 
  - Date and Showtime horizontal scroll selection.
  - Dynamically generated 10-row theater layout.
  - Live interactive seating grid with real-time price calculation logic (VIP vs Regular pricing).
- **Senior Polish**: 
  - `Animated` skeleton loading states (no layout shift).
  - Memory-optimized `FlatList` components (60fps scrolling).
  - Global React Error Boundaries for graceful failure handling.

## Architecture & Tech Stack

This project strictly adheres to **Clean Architecture** and a Feature-Driven directory structure to ensure massive scalability:

- **React Native (Expo)**: Cross-platform framework supporting both iOS (10.0+) and Android (SDK 19+).
- **TypeScript**: Strict typing across all components and API layers.
- **React Query (@tanstack/react-query)**: Decouples server state from UI state, handling caching, loading states, and deduplication out of the box.
- **React Navigation v6**: Native stack and bottom tab routing.
- **React Native SVG**: High-performance, pixel-perfect scalable vector icons and seat maps.

## Directory Structure

```
src/
├── api/          # Global API clients (Axios instance)
├── components/   # Global reusable UI (ErrorBoundary, Skeleton, Icons)
├── features/     # Feature-driven modules (e.g., /movies)
│   └── movies/
│       ├── api/          # TMDB endpoints and React Query hooks
│       └── components/   # Domain-specific UI (MovieCard, GenreGrid)
├── hooks/        # Custom global hooks (useDebounce)
├── navigation/   # Stack & Tab Navigators
├── screens/      # Top-level screen components
└── theme/        # Global design tokens (colors, typography, spacing)
```

## Running the App

### Prerequisites
- Node.js
- Expo CLI

### Installation
1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Run `npm run start` to start the Expo Metro Bundler.
4. Press `w` to open in web browser, or scan the QR code via the Expo Go app on your physical device.

## Submission Notes
- **Orientations**: Configured in `app.json` to support both `portrait` and `landscape`.
- **SDK Requirements**: `minSdkVersion 19`, `targetSdkVersion 28`, and `iOS 10.0+` explicitly enforced in the manifest.
