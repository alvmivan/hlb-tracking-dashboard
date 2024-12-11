# HLB Tracking Dashboard

A React-based web dashboard for tracking delivery notes and managing company operations.

## Overview

HLB Tracking Dashboard is a TypeScript React application built with Vite that provides a user interface for:

- Managing delivery notes
- Viewing company information
- User management and authentication
- Multi-language support

## Key Features

- **Authentication System**: Secure login functionality with user session management
- **Delivery Notes Management**: View and track delivery notes with filtering capabilities
- **Company Inspector**: Detailed view of company information and related data
- **User Management**: User profile viewing and management
- **Localization**: Built-in support for multiple languages
- **Caching System**: Local caching implementation for improved performance

## Tech Stack

- React 18.3
- TypeScript
- Vite 6.0
- React Router DOM 7.0
- HLB API Library (Custom package)

## Project Structure

```
hlb-tracking-dashboard/
├── src/
│   ├── Companies/       # Company-related components and logic
│   ├── DeliveryNotes/   # Delivery notes management
│   ├── Home/            # Home screen components
│   ├── Initialization/  # App initialization logic
│   ├── LocalCache/      # Local caching implementation
│   ├── Localization/    # Multi-language support
│   ├── Users/           # User management components
│   └── App.tsx         # Main application component
```

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### ESLint Configuration

The project uses a custom ESLint configuration with TypeScript support. See `eslint.config.js` for details.

## Dependencies

### Main Dependencies
- react
- react-dom
- react-router-dom
- hlb-api-library

### Dev Dependencies
- TypeScript
- Vite
- ESLint
- Various TypeScript and React related plugins

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is private and proprietary. All rights reserved.
