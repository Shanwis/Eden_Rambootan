from flask import Flask, request, jsonify
import requests
import json
from datetime import datetime
import google.generativeai as genai
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Gemini API Setup
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "AIzaSyDhK8yjWiqGBs7Zort5VTMCk4j3FE8kyqU")

try:
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel('gemini-1.5-flash')
    print("✅ Gemini API configured for unified analysis")
except Exception as e:
    print(f"❌ Gemini configuration error: {e}")
    model = None

def fetch_data_from_source(url, params=None, method='GET', json_data=None):
    """Fetch data from a specific source API"""
    try:
        if method == 'GET':
            response = requests.get(url, params=params, timeout=10)
        else:
            response = requests.post(url, json=json_data, timeout=10)
        
        if response.status_code == 200:
            return response.json()
        else:
            print(f"❌ Error from {url}: {response.status_code}")
            return None
    except Exception as e:
        print(f"❌ Failed to fetch from {url}: {str(e)}")
        return None

def calculate_unified_reputation_score(reddit_data, news_data, mastodon_data, reviews_data):
    """Calculate unified reputation score from all sources"""
    total_score = 0
    total_weight = 0
    
    # Reddit Analysis (Weight: 30%)
    if reddit_data and reddit_data.get('sentiment_analysis'):
        reddit_sentiment = reddit_data['sentiment_analysis']
        if reddit_sentiment.get('total', 0) > 0:
            reddit_score = (reddit_sentiment.get('positive', 0) / reddit_sentiment['total']) * 100
            total_score += reddit_score * 0.3
            total_weight += 0.3
    
    # News Analysis (Weight: 25%)
    if news_data and news_data.get('sentiment_analysis'):
        news_sentiment = news_data['sentiment_analysis']
        if news_sentiment.get('total', 0) > 0:
            news_score = (news_sentiment.get('positive', 0) / news_sentiment['total']) * 100
            total_score += news_score * 0.25
            total_weight += 0.25
    
    # Mastodon Analysis (Weight: 20%)
    if mastodon_data and mastodon_data.get('posts'):
        # Simple sentiment calculation for Mastodon
        mastodon_posts = mastodon_data['posts']
        if mastodon_posts:
            positive_count = sum(1 for post in mastodon_posts if post.get('favourite_count', 0) > post.get('reply_count', 0))
            mastodon_score = (positive_count / len(mastodon_posts)) * 100
            total_score += mastodon_score * 0.2
            total_weight += 0.2
    
    # Reviews Analysis (Weight: 25%)
    if reviews_data and reviews_data.get('sentiment_analysis'):
        reviews_sentiment = reviews_data['sentiment_analysis']
        if reviews_sentiment.get('total', 0) > 0:
            reviews_score = (reviews_sentiment.get('positive', 0) / reviews_sentiment['total']) * 100
            total_score += reviews_score * 0.25
            total_weight += 0.25
    
    # Calculate final score
    if total_weight > 0:
        final_score = round(total_score / total_weight)
    else:
        final_score = 50  # Default neutral score
    
    return min(100, max(0, final_score))

def generate_unified_insights(company, reddit_data, news_data, mastodon_data, reviews_data, reputation_score):
    """Generate comprehensive AI insights from all data sources"""
    if model is None:
        return f"Unified Analysis: {company} has a reputation score of {reputation_score}/100. Focus on improving customer engagement across all platforms."
    
    try:
        # Prepare data summary
        data_summary = []
        
        if reddit_data and reddit_data.get('sentiment_analysis'):
            reddit_sentiment = reddit_data['sentiment_analysis']
            data_summary.append(f"Reddit: {reddit_sentiment.get('positive', 0)} positive, {reddit_sentiment.get('negative', 0)} negative posts")
        
        if news_data and news_data.get('sentiment_analysis'):
            news_sentiment = news_data['sentiment_analysis']
            data_summary.append(f"News: {news_sentiment.get('positive', 0)} positive, {news_sentiment.get('negative', 0)} negative articles")
        
        if mastodon_data and mastodon_data.get('post_count'):
            data_summary.append(f"Mastodon: {mastodon_data['post_count']} social media posts")
        
        if reviews_data and reviews_data.get('sentiment_analysis'):
            reviews_sentiment = reviews_data['sentiment_analysis']
            data_summary.append(f"Reviews: {reviews_sentiment.get('positive', 0)} positive, {reviews_sentiment.get('negative', 0)} negative reviews")
        
        prompt = f"""Comprehensive reputation analysis for "{company}":

Overall Reputation Score: {reputation_score}/100

Data Sources Analysis:
{'; '.join(data_summary)}

Key Insights from Individual Sources:
- Reddit: {reddit_data.get('ai_suggestions', 'No specific insights') if reddit_data else 'No Reddit data'}
- News: {news_data.get('ai_insights', 'No specific insights') if news_data else 'No news data'}
- Reviews: {reviews_data.get('ai_insights', 'No specific insights') if reviews_data else 'No reviews data'}

Provide:
1. Overall reputation assessment
2. Top 3 priority areas for improvement
3. Strategic recommendations for reputation management
4. Platform-specific action items

Keep response comprehensive but concise."""
        
        response = model.generate_content(
            prompt,
            generation_config=genai.types.GenerationConfig(
                max_output_tokens=800,
                temperature=0.7,
            )
        )
        return response.text.strip().replace('**', '')
        
    except Exception as e:
        print(f"❌ Gemini API Error: {e}")
        return f"Unified Analysis: {company} has a reputation score of {reputation_score}/100. Focus on improving customer engagement across all platforms based on the collected data."

def generate_trend_data(reddit_data, news_data, reviews_data):
    """Generate trend data for charts"""
    # Create mock trend data based on sentiment analysis
    trend_data = []
    
    base_positive = 40
    base_neutral = 35
    base_negative = 25
    
    # Adjust based on actual data
    if reddit_data and reddit_data.get('sentiment_analysis'):
        reddit_sentiment = reddit_data['sentiment_analysis']
        if reddit_sentiment.get('total', 0) > 0:
            reddit_positive_ratio = reddit_sentiment.get('positive', 0) / reddit_sentiment['total']
            base_positive = int(reddit_positive_ratio * 60) + 20
            base_negative = max(10, 40 - base_positive)
            base_neutral = 100 - base_positive - base_negative
    
    # Generate 7 days of trend data with some variation
    import random
    for i in range(7):
        variation = random.randint(-5, 5)
        trend_data.append({
            'date': f'Day {i+1}',
            'positive': max(0, min(100, base_positive + variation)),
            'neutral': max(0, min(100, base_neutral + random.randint(-3, 3))),
            'negative': max(0, min(100, base_negative + random.randint(-3, 3)))
        })
    
    return trend_data

@app.route('/api/unified-analysis', methods=['GET'])
def unified_analysis():
    company = request.args.get('company')
    company_type = request.args.get('type')
    location = request.args.get('location', '')

    if not company:
        return jsonify({"error": "Missing 'company' parameter"}), 400

    print(f"🔍 Starting unified analysis for: {company}")
    
    # Fetch data from all sources
    reddit_data = fetch_data_from_source(
        'http://localhost:5050/api/reddit',
        params={'company': company, 'type': company_type}
    )
    
    news_data = fetch_data_from_source(
        'http://localhost:5001/api/news',
        params={'company': company, 'type': company_type}
    )
    
    mastodon_data = fetch_data_from_source(
        'http://localhost:5002/api/mastodon',
        params={'company': company, 'type': company_type}
    )
    
    reviews_data = fetch_data_from_source(
        'http://localhost:5003/api/reviews',
        method='POST',
        json_data={'company': company, 'category': company_type, 'location': location}
    )
    
    # Calculate unified reputation score
    reputation_score = calculate_unified_reputation_score(reddit_data, news_data, mastodon_data, reviews_data)
    
    # Generate unified insights
    unified_insights = generate_unified_insights(company, reddit_data, news_data, mastodon_data, reviews_data, reputation_score)
    
    # Generate trend data
    trend_data = generate_trend_data(reddit_data, news_data, reviews_data)
    
    # Prepare source breakdown
    source_breakdown = []
    if reddit_data and reddit_data.get('post_count', 0) > 0:
        source_breakdown.append({'name': 'Reddit', 'value': reddit_data['post_count'], 'color': '#FF6B6B'})
    if news_data and news_data.get('article_count', 0) > 0:
        source_breakdown.append({'name': 'News', 'value': news_data['article_count'], 'color': '#45B7D1'})
    if mastodon_data and mastodon_data.get('post_count', 0) > 0:
        source_breakdown.append({'name': 'Mastodon', 'value': mastodon_data['post_count'], 'color': '#4ECDC4'})
    if reviews_data and reviews_data.get('review_count', 0) > 0:
        source_breakdown.append({'name': 'Reviews', 'value': reviews_data['review_count'], 'color': '#96CEB4'})
    
    # Calculate total for percentages
    total_mentions = sum(source['value'] for source in source_breakdown)
    if total_mentions > 0:
        for source in source_breakdown:
            source['percentage'] = round((source['value'] / total_mentions) * 100)
    
    return jsonify({
        'company': company,
        'reputation_score': reputation_score,
        'unified_insights': unified_insights,
        'trend_data': trend_data,
        'source_breakdown': source_breakdown,
        'data_sources': {
            'reddit': reddit_data,
            'news': news_data,
            'mastodon': mastodon_data,
            'reviews': reviews_data
        },
        'analysis_timestamp': datetime.now().isoformat(),
        'total_mentions': total_mentions
    })

if __name__ == '__main__':
    app.run(port=5004, debug=True)