from flask import Flask, request, jsonify
import time
import requests
import re
import json
from urllib.parse import quote_plus
import os
from nltk.sentiment.vader import SentimentIntensityAnalyzer
import nltk
import google.generativeai as genai

# Download required NLTK data
try:
    nltk.download("vader_lexicon", quiet=True)
except:
    pass

app = Flask(__name__)

# Initialize sentiment analyzer
analyzer = SentimentIntensityAnalyzer()

# Gemini API Setup
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "AIzaSyDhK8yjWiqGBs7Zort5VTMCk4j3FE8kyqU")

try:
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel('gemini-1.5-flash')
    print("✅ Gemini API configured for news analysis")
except Exception as e:
    print(f"❌ Gemini configuration error: {e}")
    model = None

def analyze_news_sentiment(news_articles):
    """Analyze sentiment of news articles"""
    sentiment_results = {"positive": 0, "negative": 0, "neutral": 0, "total": 0}
    analyzed_articles = []
    
    for article in news_articles:
        # Extract text from article format
        if article.startswith("News (") or article.startswith("News Summary ("):
            # Extract the actual content after the source
            text = article.split("): ", 1)[-1] if "): " in article else article
        else:
            text = article
        
        # Analyze sentiment
        score = analyzer.polarity_scores(text)
        compound = score["compound"]
        
        article_analysis = {
            'text': text,
            'sentiment_score': compound,
            'sentiment_breakdown': score,
            'source': 'News'
        }
        analyzed_articles.append(article_analysis)
        
        if compound >= 0.05:
            sentiment_results["positive"] += 1
        elif compound <= -0.05:
            sentiment_results["negative"] += 1
        else:
            sentiment_results["neutral"] += 1
        sentiment_results["total"] += 1
    
    return sentiment_results, analyzed_articles

def get_news_ai_insights(company, sentiment_results, analyzed_articles):
    """Generate AI insights from news sentiment analysis"""
    if model is None:
        return f"News Analysis: {sentiment_results['positive']} positive, {sentiment_results['negative']} negative articles found. Focus on addressing negative coverage themes."
    
    try:
        # Get sample negative and positive articles
        negative_articles = [art['text'][:100] for art in analyzed_articles if art['sentiment_score'] <= -0.05][:3]
        positive_articles = [art['text'][:100] for art in analyzed_articles if art['sentiment_score'] >= 0.05][:3]
        
        prompt = f"""Analyze news sentiment for "{company}":

News Results: {sentiment_results['positive']} positive, {sentiment_results['negative']} negative, {sentiment_results['neutral']} neutral articles

Sample negative coverage: {'; '.join(negative_articles) if negative_articles else 'None'}
Sample positive coverage: {'; '.join(positive_articles) if positive_articles else 'None'}

Provide:
1. Media perception analysis
2. Key themes in coverage
3. Reputation management suggestions
Keep response brief and actionable."""
        
        response = model.generate_content(
            prompt,
            generation_config=genai.types.GenerationConfig(
                max_output_tokens=400,
                temperature=0.7,
            )
        )
        return response.text.strip().replace('**', '')
        
    except Exception as e:
        print(f"❌ Gemini API Error: {e}")
        return f"News Analysis: {sentiment_results['positive']} positive, {sentiment_results['negative']} negative articles found. Focus on addressing negative coverage themes."

def get_real_news_mentions(query):
    """Get real news mentions using NewsAPI.org"""
    try:
        print(f"🔍 Searching news for: '{query}'")
        
        # NewsAPI.org endpoint
        encoded_query = quote_plus(query)
        url = f"https://newsapi.org/v2/everything"
        
        # You can get a free API key from https://newsapi.org/
        # For now, using a demo key (limited to 100 requests per day)
        api_key = os.getenv("NEWS_API_KEY", "demo")  # Use demo key if no API key set
        
        params = {
            'q': query,
            'apiKey': api_key,
            'language': 'en',
            'sortBy': 'relevancy',
            'pageSize': 15
        }
        
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        }
        
        response = requests.get(url, params=params, headers=headers, timeout=15)
        
        if response.status_code == 200:
            data = response.json()
            articles = data.get('articles', [])
            
            news_mentions = []
            for article in articles:
                title = article.get('title', '')
                description = article.get('description', '')
                source = article.get('source', {}).get('name', 'Unknown Source')
                url = article.get('url', '')
                published_at = article.get('publishedAt', '')
                
                if title and len(title) > 10:
                    news_mentions.append({
                        'title': title,
                        'description': description,
                        'source': source,
                        'url': url,
                        'published_at': published_at,
                        'text': f"{title}. {description}" if description else title
                    })
            
            return news_mentions
        
        elif response.status_code == 401:
            print("❌ NewsAPI authentication failed. Using fallback news data.")
            return get_fallback_news_mentions(query)
        else:
            print(f"❌ NewsAPI error: {response.status_code}")
            return get_fallback_news_mentions(query)
        
    except Exception as e:
        print(f"❌ Error with NewsAPI: {str(e)}")
        return get_fallback_news_mentions(query)

def get_fallback_news_mentions(query):
    """Fallback news mentions when API is unavailable"""
    company = query.split()[0] if query else "Company"
    
    fallback_news = [
        {
            'title': f"Breaking: {company} announces new product line with innovative features",
            'description': f"{company} continues to expand its market presence with cutting-edge technology solutions that address customer needs.",
            'source': 'Tech News Daily',
            'url': 'https://example.com/news1',
            'published_at': '2024-01-15T10:00:00Z',
            'text': f"Breaking: {company} announces new product line with innovative features. {company} continues to expand its market presence with cutting-edge technology solutions that address customer needs."
        },
        {
            'title': f"Tech Review: {company}'s latest release shows significant improvements",
            'description': f"Industry experts praise {company} for addressing user feedback and implementing meaningful improvements in their latest update.",
            'source': 'Industry Review',
            'url': 'https://example.com/news2',
            'published_at': '2024-01-14T15:30:00Z',
            'text': f"Tech Review: {company}'s latest release shows significant improvements. Industry experts praise {company} for addressing user feedback and implementing meaningful improvements in their latest update."
        },
        {
            'title': f"Business Update: {company} reports strong quarterly earnings",
            'description': f"{company} exceeds analyst expectations with robust financial performance and positive market outlook for the coming quarter.",
            'source': 'Business Wire',
            'url': 'https://example.com/news3',
            'published_at': '2024-01-13T09:15:00Z',
            'text': f"Business Update: {company} reports strong quarterly earnings. {company} exceeds analyst expectations with robust financial performance and positive market outlook for the coming quarter."
        },
        {
            'title': f"Customer Story: How {company} helped transform business operations",
            'description': f"A detailed case study showcasing how {company}'s solutions enabled digital transformation and improved operational efficiency for enterprise clients.",
            'source': 'Customer Success',
            'url': 'https://example.com/news4',
            'published_at': '2024-01-12T14:20:00Z',
            'text': f"Customer Story: How {company} helped transform business operations. A detailed case study showcasing how {company}'s solutions enabled digital transformation and improved operational efficiency for enterprise clients."
        },
        {
            'title': f"Industry Analysis: {company} continues to lead in market innovation",
            'description': f"Market research indicates {company} maintains competitive advantage through consistent innovation and strategic partnerships in the industry.",
            'source': 'Market Research',
            'url': 'https://example.com/news5',
            'published_at': '2024-01-11T11:45:00Z',
            'text': f"Industry Analysis: {company} continues to lead in market innovation. Market research indicates {company} maintains competitive advantage through consistent innovation and strategic partnerships in the industry."
        }
    ]
    
    return fallback_news[:5]  # Return 5 fallback news items

def scrape_news_alternative(query):
    """Try multiple methods to get real news mentions"""
    search_queries = [
        query.strip(),
        f"{query} company",
        f"{query} business",
        f"{query} technology",
        f"{query} innovation"
    ]
    
    for search_query in search_queries:
        print(f"🔍 Trying news search query: '{search_query}'")
        
        # Try to get real news mentions
        news_mentions = get_real_news_mentions(search_query)
        if news_mentions:
            return news_mentions
        
        time.sleep(1)  # Rate limiting
    
    return []

@app.route('/api/news', methods=['GET'])
def scrape_news_data():
    company = request.args.get('company')
    company_type = request.args.get('type')

    if not company:
        return jsonify({"error": "Missing 'company' parameter"}), 400

    query = f"{company} {company_type or ''}"

    try:
        print(f"🔍 Starting news search for: '{query}'")
        
        # Try to get real news mentions
        news_articles = scrape_news_alternative(query)
        
        if not news_articles:
            print("🔄 No real news found, using fallback data")
            news_articles = get_fallback_news_mentions(query)
        
        # Analyze sentiment of news articles
        sentiment_results, analyzed_articles = analyze_news_sentiment([article['text'] for article in news_articles])
        
        # Generate AI insights
        ai_insights = get_news_ai_insights(company, sentiment_results, analyzed_articles)
        
        # Check if data is real or fallback
        is_real_data = not any('example.com' in article.get('url', '') for article in news_articles)
        source_description = "Real news from NewsAPI.org" if is_real_data else "Fallback news data (API unavailable)"
        
        return jsonify({
            "news_articles": news_articles,
            "sentiment_analysis": sentiment_results,
            "analyzed_articles": analyzed_articles,
            "ai_insights": ai_insights,
            "query_used": query,
            "article_count": len(news_articles),
            "source": source_description,
            "is_real_data": is_real_data
        })
            
    except Exception as e:
        print(f"❌ General error: {str(e)}")
        return jsonify({
            "error": f"Error searching news: {str(e)}",
            "suggestion": "The news search service might be temporarily unavailable. Try again later."
        }), 500

# Legacy endpoint for backward compatibility
@app.route('/api/twitter', methods=['GET'])
def scrape_tweet_texts():
    return scrape_news_data()

if __name__ == '__main__':
    app.run(port=5001, debug=True)