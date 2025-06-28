# 🚀 Eden_Rambootan - AI Company Reputation Analyzer

A stunning, modern Chrome extension that provides AI-powered company reputation analysis with beautiful animations and comprehensive analytics from multiple data sources.

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
- **Real-time data integration** from multiple sources

### 🔍 Data Sources
- **Reddit Analysis** - AI-powered sentiment analysis with Gemini API
- **News Articles** - Real-time news mentions via NewsAPI
- **Mastodon Posts** - Social media sentiment from Mastodon instances
- **Google Reviews** - Business reviews via SerpAPI

## 🛠 Tech Stack

### Frontend
- **React 18** - Modern component-based architecture
- **Tailwind CSS** - Utility-first styling with custom components
- **Framer Motion** - Smooth animations and transitions
- **Recharts** - Beautiful, responsive charts
- **Lucide React** - Modern icon library
- **Webpack** - Build tool and bundler

### Backend APIs
- **Flask** - Python web framework for API endpoints
- **Reddit API (PRAW)** - Reddit data scraping and analysis
- **Google Gemini AI** - Advanced sentiment analysis and insights
- **NewsAPI** - Real-time news article fetching
- **SerpAPI** - Google Reviews and business data
- **NLTK VADER** - Sentiment analysis toolkit

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
- Python 3.8+
- npm or yarn

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Eden_Rambootan
   ```

2. **Install Node.js dependencies**
   ```bash
   npm install
   ```

3. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up API Keys**
   Create a `.env` file in the root directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   NEWS_API_KEY=your_newsapi_key_here
   SERPAPI_KEY=your_serpapi_key_here
   ```

5. **Build the extension**
   ```bash
   npm run build
   ```

6. **Start the backend servers**
   ```bash
   # Terminal 1 - Reddit Analysis Server
   python reddit_scraper.py

   # Terminal 2 - News API Server
   python app.py

   # Terminal 3 - Mastodon Server
   python mastodon_scraper.py

   # Terminal 4 - Reviews Server
   python get_place_id_and_reviews.py
   ```

7. **Load in Chrome**
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

### Start All Servers
```bash
npm run start-servers
```
Installs Python dependencies and starts all backend servers.

## 📁 Project Structure

```
├── src/
│   ├── popup.jsx          # Popup interface component
│   ├── dashboard.jsx      # Main dashboard component
│   ├── background.js      # Service worker
│   └── index.css          # Global styles and Tailwind
├── reddit_scraper.py      # Reddit API and AI analysis
├── app.py                 # News API server
├── mastodon_scraper.py    # Mastodon data scraping
├── get_place_id_and_reviews.py # Google Reviews API
├── popup.html             # Popup HTML template
├── dashboard.html         # Dashboard HTML template
├── manifest.json          # Chrome extension manifest
├── webpack.config.js      # Build configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── requirements.txt       # Python dependencies
└── package.json           # Node.js dependencies and scripts
```

## 🎯 Usage

1. **Click the extension icon** in your Chrome toolbar
2. **Enter company details**:
   - Company name
   - Location (city, country)
   - Company type (Tech, Retail, Healthcare, etc.)
3. **Click "Analyze Reputation"** to start the analysis
4. **View the score** and wait for the dashboard to open
5. **Explore comprehensive analytics** including:
   - Reddit sentiment analysis with AI insights
   - News article mentions
   - Mastodon social media sentiment
   - Google Reviews data
   - AI-powered improvement suggestions

## 🤖 AI Features

### Reddit Analysis
- **Sentiment Analysis** using NLTK VADER
- **AI Insights** powered by Google Gemini
- **Key Issue Extraction** from negative feedback
- **Improvement Suggestions** based on sentiment patterns

### Multi-Source Integration
- **Real-time data** from 4+ sources
- **Unified sentiment scoring**
- **Cross-platform trend analysis**
- **Comprehensive reporting**

## 🔧 API Configuration

### Required API Keys

1. **Google Gemini AI** - For advanced sentiment analysis
   - Get key from: https://makersuite.google.com/app/apikey
   
2. **NewsAPI** - For news article mentions
   - Get key from: https://newsapi.org/
   
3. **SerpAPI** - For Google Reviews
   - Get key from: https://serpapi.com/

4. **Reddit API** - Already configured with demo credentials
   - For production, get your own from: https://www.reddit.com/prefs/apps

## 📊 Data Sources

The extension integrates with multiple data sources:

- **Reddit**: Real-time posts and comments with AI sentiment analysis
- **News Articles**: Latest news mentions via NewsAPI
- **Mastodon**: Decentralized social media sentiment
- **Google Reviews**: Business reviews and ratings

## 🔮 Future Enhancements

- [ ] Twitter/X API integration
- [ ] LinkedIn company page analysis
- [ ] Historical data comparison
- [ ] Custom alert notifications
- [ ] Advanced filtering options
- [ ] Dark/light theme toggle
- [ ] Real-time data updates
- [ ] Competitor comparison

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Google Gemini AI** for advanced sentiment analysis
- **Reddit API (PRAW)** for social media data
- **Framer Motion** for smooth animations
- **Recharts** for beautiful data visualization
- **Tailwind CSS** for utility-first styling
- **Lucide** for modern icons

---

**Built with ❤️ for modern web development and AI-powered insights**