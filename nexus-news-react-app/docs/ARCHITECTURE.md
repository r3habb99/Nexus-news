# Nexus News - Project Structure

## 📁 Clean Code Architecture

This project follows a clean, modular architecture for better maintainability and scalability.

```
nexus-news/
├── public/                      # Static assets
├── src/
│   ├── api/                     # API service layer
│   │   └── newsApi.js          # News API endpoints
│   │
│   ├── components/              # React components
│   │   ├── index.js            # Component exports
│   │   ├── NewsCard.jsx        # Individual news article card
│   │   ├── Navigation.jsx      # Top navigation bar
│   │   ├── MobileSidebar.jsx   # Mobile menu sidebar
│   │   ├── TrendingSection.jsx # Trending news section
│   │   ├── NewsGrid.jsx        # News articles grid
│   │   └── Footer.jsx          # Page footer
│   │
│   ├── constants/               # Application constants
│   │   ├── api.js              # API configuration
│   │   ├── categories.js       # News categories
│   │   └── countries.js        # Country codes mapping
│   │
│   ├── utils/                   # Utility functions
│   │   └── formatters.js       # Formatting helpers
│   │
│   ├── assets/                  # Images, icons, etc.
│   ├── App.jsx                  # Main application component
│   ├── App.css                  # Application styles
│   ├── main.jsx                 # Application entry point
│   └── index.css                # Global styles
│
├── index.html                   # HTML template
├── package.json                 # Dependencies
├── vite.config.js              # Vite configuration
└── eslint.config.js            # ESLint configuration
```

## 🏗️ Architecture Layers

### 1. **Components Layer** (`src/components/`)
Reusable UI components following single responsibility principle:
- **NewsCard**: Displays individual article with image, content, and metadata
- **Navigation**: Desktop navigation with category tabs and search
- **MobileSidebar**: Responsive mobile menu
- **TrendingSection**: Showcases trending articles
- **NewsGrid**: Grid layout for article display with loading states
- **Footer**: Application footer with links and branding

### 2. **API Layer** (`src/api/`)
Centralized API communication:
- **newsApi.js**: All API calls for fetching news data
  - `getLatest()` - Fetch latest news by category
  - `getTrending()` - Fetch trending articles
  - `search()` - Search news articles

### 3. **Constants Layer** (`src/constants/`)
Application-wide constants:
- **api.js**: API base URL and endpoints
- **categories.js**: News category definitions with icons
- **countries.js**: Country code to name mapping

### 4. **Utils Layer** (`src/utils/`)
Utility functions and helpers:
- **formatters.js**: Data formatting utilities
  - `formatCountry()` - Convert country codes to full names
  - `sanitizeContent()` - Clean article content

## 🎯 Benefits of This Architecture

1. **Separation of Concerns**: Each file has a single, clear responsibility
2. **Reusability**: Components and utilities can be easily reused
3. **Maintainability**: Easy to locate and update specific functionality
4. **Scalability**: Simple to add new features without affecting existing code
5. **Testability**: Isolated components are easier to unit test
6. **Developer Experience**: Clear structure makes onboarding easier

## 🔄 Data Flow

```
User Action → App.jsx (State Management) 
    ↓
API Layer (newsApi.js) → External API
    ↓
Components (Props) → UI Rendering
    ↓
Utils/Constants → Data Formatting
```

## 📦 Component Props Pattern

Components receive only the data and callbacks they need:
```javascript
<Navigation 
  activeTab={activeTab}
  setActiveTab={setActiveTab}
  searchQuery={searchQuery}
  onSearch={handleSearch}
/>
```

## 🚀 Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## 🛠️ Future Enhancements

Potential additions to the architecture:
- `/hooks` - Custom React hooks (useNews, useSearch, etc.)
- `/contexts` - React Context providers for global state
- `/types` - TypeScript type definitions
- `/services` - Additional service layers (auth, storage, etc.)
- `/tests` - Test files organized by component
- `/styles` - Shared style utilities and theme configuration

## 📝 Code Style

- Use functional components with hooks
- Implement prop-types or TypeScript for type safety
- Follow ESLint configuration
- Use meaningful variable and function names
- Add JSDoc comments for complex functions
- Keep components small and focused (< 200 lines)

---

Built with ⚡ Vite + React + TailwindCSS
