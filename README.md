# 🚀 AI Company Reputation Analyzer - Chrome Extension

A stunning, modern Chrome extension that provides AI-powered company reputation analysis with beautiful animations and comprehensive analytics.

## ✨ Features

### 🎯 Popup Interface
- **Clean, animated search form** with glassmorphism design
- **Company name, location, and type inputs** with elegant styling
- **Real-time reputation score** with emoji indicators
- **Smooth transitions** and micro-interactions

### 📊 Dashboard Analytics
- **Comprehensive reputation metrics** with trend indicators
- **Interactive charts** (sentiment trends, source breakdown)
- **AI-powered suggestions** for reputation improvement
- **Export functionality** (PDF, CSV, Copy Summary)
- **Responsive design** with premium UI/UX

## 🛠 Tech Stack

- **React 18** - Modern component-based architecture
- **Tailwind CSS** - Utility-first styling with custom components
- **Framer Motion** - Smooth animations and transitions
- **Recharts** - Beautiful, responsive charts
- **Lucide React** - Modern icon library
- **Webpack** - Build tool and bundler

## 🎨 Design Features

- **Glassmorphism effects** with backdrop blur
- **Gradient backgrounds** and soft shadows
- **Premium color palette** with primary blue theme
- **Responsive grid layouts** and modern typography
- **Smooth animations** and hover effects
- **Professional data visualization**

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-company-reputation-analyzer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the extension**
   ```bash
   npm run build
   ```

4. **Load in Chrome**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (top right toggle)
   - Click "Load unpacked"
   - Select the `dist` folder from this project

## 🚀 Development

### Development Mode
```bash
npm run dev
```
This will watch for changes and rebuild automatically.

### Production Build
```bash
npm run build
```
Creates optimized files in the `dist` directory.

## 📁 Project Structure

```
├── src/
│   ├── popup.jsx          # Popup interface component
│   ├── dashboard.jsx      # Main dashboard component
│   ├── background.js      # Service worker
│   └── index.css          # Global styles and Tailwind
├── popup.html             # Popup HTML template
├── dashboard.html         # Dashboard HTML template
├── manifest.json          # Chrome extension manifest
├── webpack.config.js      # Build configuration
├── tailwind.config.js     # Tailwind CSS configuration
└── package.json           # Dependencies and scripts
```

## 🎯 Usage

1. **Click the extension icon** in your Chrome toolbar
2. **Enter company details**:
   - Company name
   - Location (city, country)
   - Company type (Tech, Retail, Healthcare, etc.)
3. **Click "Analyze Reputation"** to start the analysis
4. **View the score** and wait for the dashboard to open
5. **Explore comprehensive analytics** in the full dashboard

## 🔧 Customization

### Colors and Theme
Edit `tailwind.config.js` to customize:
- Primary color palette
- Animation timings
- Custom components

### API Integration
Replace mock data in components with real API calls:
- Update `handleAnalyze` in `popup.jsx`
- Modify data fetching in `dashboard.jsx`
- Configure endpoints in `background.js`

### Styling
- Modify `src/index.css` for global styles
- Update component-specific styles in each `.jsx` file
- Customize Tailwind classes for different looks

## 📊 Mock Data

The extension currently uses mock data for demonstration:
- **Sentiment trends** over 7 days
- **Source breakdown** (Reddit, Twitter, News, Reviews)
- **AI suggestions** with priority levels
- **Metrics** with trend indicators

## 🔮 Future Enhancements

- [ ] Real API integration for sentiment analysis
- [ ] Historical data comparison
- [ ] Custom alert notifications
- [ ] Advanced filtering options
- [ ] Dark/light theme toggle
- [ ] Export to more formats
- [ ] Real-time data updates

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Framer Motion** for smooth animations
- **Recharts** for beautiful data visualization
- **Tailwind CSS** for utility-first styling
- **Lucide** for modern icons

---

**Built with ❤️ for modern web development** 