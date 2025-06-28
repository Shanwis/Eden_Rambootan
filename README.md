# 🚀 AI Company Reputation Analyzer - Comprehensive Edition

A powerful Chrome extension that provides AI-powered company reputation analysis with comprehensive sentiment analysis across multiple data sources including Reddit, News, Google Reviews, and Mastodon.

## ✨ Features

### 🎯 Multi-Platform Data Analysis
- **Reddit Analysis** - AI-powered sentiment analysis with Gemini API
- **News Articles** - Real-time news mentions via NewsAPI
- **Google Reviews** - Business reviews via SerpAPI
- **Mastodon Posts** - Social media sentiment from Mastodon instances
- **Unified Analysis** - Combined insights from all sources

### 📊 Advanced Analytics
- **Comprehensive reputation scoring** with weighted calculations
- **Interactive sentiment trend charts** showing temporal patterns
- **Source distribution analysis** with visual breakdowns
- **AI-powered insights** for each data source
- **Unified recommendations** based on cross-platform analysis

### 🤖 AI-Powered Features
- **Google Gemini AI** integration for advanced sentiment analysis
- **NLTK VADER** sentiment scoring for accurate emotion detection
- **Cross-platform insight generation** with actionable recommendations
- **Automated issue identification** from negative feedback
- **Strategic reputation management suggestions**

### 🎨 Premium UI/UX
- **Glassmorphism design** with modern aesthetics
- **Responsive dashboard** with interactive charts
- **Real-time data status indicators** showing API availability
- **Export functionality** (PDF, CSV, Copy Summary)
- **Smooth animations** and micro-interactions

## 🛠 Tech Stack

### Frontend
- **React 18** - Modern component architecture
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Recharts** - Interactive data visualization
- **Lucide React** - Modern icon library

### Backend APIs
- **Flask** - Python web framework
- **Reddit API (PRAW)** - Reddit data scraping
- **Google Gemini AI** - Advanced sentiment analysis
- **NewsAPI** - Real-time news articles
- **SerpAPI** - Google Reviews and business data
- **NLTK VADER** - Sentiment analysis toolkit

### Data Processing
- **Unified Analysis Engine** - Combines all data sources
- **Weighted Reputation Scoring** - Intelligent score calculation
- **Cross-platform Sentiment Analysis** - Comprehensive emotion detection
- **AI Insight Generation** - Actionable business recommendations

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- Python 3.8+
- Chrome browser

### 1. Clone Repository
```bash
git clone <repository-url>
cd ai-company-reputation-analyzer
```

### 2. Install Dependencies
```bash
# Install Node.js dependencies
npm install

# Install Python dependencies
pip install -r requirements.txt
```

### 3. Configure API Keys
Create a `.env` file in the root directory:
```env
GEMINI_API_KEY=your_gemini_api_key_here
NEWS_API_KEY=your_newsapi_key_here
SERPAPI_KEY=your_serpapi_key_here
```

### 4. Build Extension
```bash
npm run build
```

### 5. Start Backend Servers
```bash
# Start all servers (recommended)
npm run start-servers

# Or start individually:
python reddit_scraper.py      # Port 5050
python news_scraper.py        # Port 5001  
python reviews_scraper.py     # Port 5003
python mastodon_scraper.py    # Port 5002
python unified_analyzer.py    # Port 5004
```

### 6. Load Extension in Chrome
1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (top right toggle)
3. Click "Load unpacked"
4. Select the `dist` folder from this project

## 🚀 Usage

### Basic Analysis
1. **Click the extension icon** in Chrome toolbar
2. **Enter company information**:
   - Company name
   - Location (city, country)
   - Company type (Tech, Retail, Healthcare, etc.)
3. **Click "Analyze Reputation"** to start comprehensive analysis
4. **View initial score** and wait for detailed dashboard

### Dashboard Features
- **Overall Reputation Score** - Weighted calculation from all sources
- **Sentiment Trends** - Time-based sentiment analysis charts
- **Source Distribution** - Visual breakdown of data sources
- **AI Insights** - Platform-specific and unified recommendations
- **Data Status** - Real-time API availability indicators
- **Export Options** - PDF reports, CSV data, summary copying

## 🤖 AI Analysis Features

### Sentiment Analysis
- **NLTK VADER** for baseline sentiment scoring
- **Google Gemini AI** for contextual analysis and insights
- **Cross-platform sentiment correlation**
- **Temporal trend analysis**

### Reputation Scoring Algorithm
```
Overall Score = (Reddit × 30%) + (News × 25%) + (Reviews × 25%) + (Mastodon × 20%)

Where each source score = (Positive Mentions / Total Mentions) × 100
```

### AI Insight Generation
- **Platform-specific analysis** for targeted improvements
- **Cross-platform pattern recognition**
- **Actionable business recommendations**
- **Priority-based issue identification**

## 📊 Data Sources & APIs

### Reddit Analysis (Port 5050)
- **PRAW** for Reddit API access
- **Multiple search strategies** for comprehensive coverage
- **Sentiment analysis** with NLTK VADER
- **AI insights** with Gemini API

### News Analysis (Port 5001)
- **NewsAPI.org** for real-time news articles
- **Multiple search queries** for better coverage
- **Sentiment analysis** of headlines and descriptions
- **Media perception insights**

### Reviews Analysis (Port 5003)
- **SerpAPI** for Google Reviews access
- **Business location matching**
- **Combined rating and text sentiment analysis**
- **Customer satisfaction insights**

### Mastodon Analysis (Port 5002)
- **Multiple Mastodon instances** for broader coverage
- **Hashtag and timeline searching**
- **Social media sentiment tracking**
- **Community engagement analysis**

### Unified Analysis (Port 5004)
- **Cross-platform data aggregation**
- **Weighted reputation scoring**
- **Comprehensive AI insights**
- **Strategic recommendations**

## 🔧 Configuration

### API Keys Required
1. **Google Gemini AI** - Advanced sentiment analysis
   - Get from: https://makersuite.google.com/app/apikey
   
2. **NewsAPI** - News article mentions
   - Get from: https://newsapi.org/
   
3. **SerpAPI** - Google Reviews access
   - Get from: https://serpapi.com/

### Fallback Systems
- **Intelligent fallbacks** when APIs are unavailable
- **Mock data generation** for testing and demos
- **Graceful degradation** with partial data
- **Status indicators** for API availability

## 📈 Performance & Scalability

### Optimization Features
- **Concurrent API calls** for faster data gathering
- **Intelligent caching** to reduce API usage
- **Rate limiting** to respect API constraints
- **Error handling** with automatic retries

### Scalability Considerations
- **Modular architecture** for easy extension
- **Separate servers** for each data source
- **Unified analysis engine** for cross-platform insights
- **Configurable weights** for reputation scoring

## 🔮 Future Enhancements

- [ ] **Twitter/X API** integration
- [ ] **LinkedIn company analysis**
- [ ] **Historical data tracking**
- [ ] **Competitor comparison**
- [ ] **Real-time alerts** for reputation changes
- [ ] **Advanced ML models** for sentiment analysis
- [ ] **Custom scoring algorithms**
- [ ] **White-label solutions**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Google Gemini AI** for advanced sentiment analysis
- **Reddit API (PRAW)** for social media data
- **NewsAPI** for real-time news coverage
- **SerpAPI** for Google Reviews access
- **NLTK** for natural language processing
- **React & Tailwind** for modern UI development

---

**Built with ❤️ for comprehensive AI-powered reputation analysis**