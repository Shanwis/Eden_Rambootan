import os
import re
import time
import json
from typing import Any
from flask import Flask, request, jsonify
import serpapi
from dotenv import load_dotenv  # pip install python-dotenv
from nltk.sentiment.vader import SentimentIntensityAnalyzer
import nltk
import google.generativeai as genai

# Download required NLTK data
try:
    nltk.download("vader_lexicon", quiet=True)
except:
    pass

# Load environment variables
load_dotenv()
SERPAPI_KEY = os.getenv("SERPAPI_KEY")

app = Flask(__name__)

# Initialize sentiment analyzer
analyzer = SentimentIntensityAnalyzer()

# Gemini API Setup
# To update your API key, either:
# 1. Set environment variable: GEMINI_API_KEY=your_new_key_here
# 2. Or replace the default value below with your new API key
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "AIzaSyAwpKvs7vZAswo4-fw0e5BGsFaEDeHRhBM")

try:
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel('gemini-1.5-flash')
    print("✅ Gemini API configured for reviews analysis")
except Exception as e:
    print(f"❌ Gemini configuration error: {e}")
    model = None

def analyze_reviews_sentiment(reviews):
    """Analyze sentiment of Google reviews"""
    sentiment_results = {"positive": 0, "negative": 0, "neutral": 0, "total": 0}
    analyzed_reviews = []
    
    for review in reviews:
        text = review.get('text', '')
        rating = review.get('rating', 0)
        
        if text and len(text) > 5:
            # Analyze sentiment using NLTK
            score = analyzer.polarity_scores(text)
            compound = score["compound"]
            
            # Also consider star rating for sentiment
            if isinstance(rating, (int, float)):
                if rating >= 4:
                    rating_sentiment = 0.5
                elif rating <= 2:
                    rating_sentiment = -0.5
                else:
                    rating_sentiment = 0.0
                
                # Combine text sentiment with rating sentiment
                combined_sentiment = (compound + rating_sentiment) / 2
            else:
                combined_sentiment = compound
            
            review_analysis = {
                'text': text,
                'rating': rating,
                'date': review.get('date', ''),
                'sentiment_score': combined_sentiment,
                'sentiment_breakdown': score,
                'source': 'Google Reviews'
            }
            analyzed_reviews.append(review_analysis)
            
            if combined_sentiment >= 0.05:
                sentiment_results["positive"] += 1
            elif combined_sentiment <= -0.05:
                sentiment_results["negative"] += 1
            else:
                sentiment_results["neutral"] += 1
            sentiment_results["total"] += 1
    
    return sentiment_results, analyzed_reviews

def get_reviews_ai_insights(company, sentiment_results, analyzed_reviews):
    """Generate AI insights from reviews sentiment analysis"""
    if model is None:
        return f"Reviews Analysis: {sentiment_results['positive']} positive, {sentiment_results['negative']} negative reviews found. Focus on addressing service quality issues."
    
    try:
        # Get sample negative and positive reviews
        negative_reviews = [rev['text'][:100] for rev in analyzed_reviews if rev['sentiment_score'] <= -0.05][:3]
        positive_reviews = [rev['text'][:100] for rev in analyzed_reviews if rev['sentiment_score'] >= 0.05][:3]
        
        prompt = f"""Analyze Google Reviews sentiment for "{company}":

Reviews Results: {sentiment_results['positive']} positive, {sentiment_results['negative']} negative, {sentiment_results['neutral']} neutral reviews

Sample negative reviews: {'; '.join(negative_reviews) if negative_reviews else 'None'}
Sample positive reviews: {'; '.join(positive_reviews) if positive_reviews else 'None'}

Provide:
1. Customer satisfaction analysis
2. Key service issues identified
3. Improvement recommendations
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
        return f"Reviews Analysis: {sentiment_results['positive']} positive, {sentiment_results['negative']} negative reviews found. Focus on addressing service quality issues."

def normalize_company(company: str) -> str:
    """Remove special characters from company name."""
    return re.sub(r"[\'\"]", "", company).strip()

def maps_search(query: str):
    """Search Google Maps for a business."""
    time.sleep(1)  # Rate limit protection
    try:
        results = serpapi.search({
            "engine": "google_maps",
            "q": query,
            "api_key": SERPAPI_KEY
        }).as_dict()
        return results.get("local_results", [])
    except Exception as e:
        print(f"❌ Search failed: {str(e)}")
        return []

def get_reviews(place_id: str):
    """Fetch reviews for a specific place_id."""
    time.sleep(1)  # Rate limit protection
    try:
        response = serpapi.search({
            "engine": "google_maps_reviews",
            "place_id": place_id,
            "api_key": SERPAPI_KEY
        }).as_dict()
        reviews = response.get("reviews", [])
        return reviews
    except Exception as e:
        print(f"❌ Failed to get reviews: {str(e)}")
        return []

def find_best_place(company: str, category: str, location: str):
    """Try multiple search variations to find the business."""
    name = normalize_company(company)
    loc = location.strip()
    cat = category.lower().strip()
    queries = [
        f"{name} {loc}",
        f"{name} {cat} {loc}",
        f"{cat} {name} {loc}",
        f"{name} near {loc}"
    ]
    for query in queries:
        results = maps_search(query)
        if results:
            return results
    return []

def get_original_snippet(snippet: Any) -> str:
    if isinstance(snippet, dict):
        return snippet.get('original', '[No text]')
    return '[No text]'

def extract_review_fields(reviews):
    """Extract only rating, text, and date from reviews."""
    extracted = []
    for review in reviews:
        rating = review.get('rating', '?')
        text = review.get('snippet')
        if not text:
            text = get_original_snippet(review.get('extracted_snippet'))
        date = review.get('date', 'Date unknown')
        extracted.append({
            'rating': rating,
            'text': text,
            'date': date
        })
    return extracted

def generate_fallback_reviews(company):
    """Generate realistic fallback reviews when API is unavailable"""
    fallback_reviews = [
        {
            'rating': 5,
            'text': f"Excellent service from {company}! The staff was professional and the quality exceeded my expectations. Highly recommend to anyone looking for reliable service.",
            'date': '2 weeks ago'
        },
        {
            'rating': 4,
            'text': f"Good experience with {company}. The process was smooth and the results were satisfactory. Minor room for improvement in communication.",
            'date': '1 month ago'
        },
        {
            'rating': 2,
            'text': f"Had some issues with {company}'s service. Response time was slow and the initial quality didn't meet expectations. They did resolve it eventually.",
            'date': '3 weeks ago'
        },
        {
            'rating': 5,
            'text': f"Outstanding work by {company}! They went above and beyond to ensure everything was perfect. Will definitely use their services again.",
            'date': '1 week ago'
        },
        {
            'rating': 3,
            'text': f"Average experience with {company}. The service was okay but nothing exceptional. Price was fair for what we received.",
            'date': '2 months ago'
        }
    ]
    return fallback_reviews

@app.route('/api/reviews', methods=['POST'])
def get_reviews_api():
    data = request.get_json()
    if data is None:
        return jsonify({'error': 'Invalid JSON sent in request.'}), 400

    company = data.get('company')
    category = data.get('category')
    location = data.get('location', '')  # Optional

    if not company or not category:
        return jsonify({'error': 'Missing required fields: company or category'}), 400

    try:
        places = find_best_place(company, category, location)
        
        if not places:
            print("🔄 No business found, using fallback reviews")
            reviews = generate_fallback_reviews(company)
            is_real_data = False
        else:
            first_place = places[0]
            reviews = get_reviews(first_place.get("place_id"))
            extracted = extract_review_fields(reviews)
            
            if not extracted:
                print("🔄 No reviews found, using fallback reviews")
                reviews = generate_fallback_reviews(company)
                is_real_data = False
            else:
                reviews = extracted
                is_real_data = True
        
        # Analyze sentiment of reviews
        sentiment_results, analyzed_reviews = analyze_reviews_sentiment(reviews)
        
        # Generate AI insights
        ai_insights = get_reviews_ai_insights(company, sentiment_results, analyzed_reviews)
        
        source_description = "Real Google Reviews" if is_real_data else "Fallback reviews data (API unavailable)"
        
        return jsonify({
            'company': places[0].get('title') if places else company,
            'address': places[0].get('address') if places else f"{location}",
            'reviews': reviews,
            'sentiment_analysis': sentiment_results,
            'analyzed_reviews': analyzed_reviews,
            'ai_insights': ai_insights,
            'review_count': len(reviews),
            'source': source_description,
            'is_real_data': is_real_data
        })
        
    except Exception as e:
        print(f"❌ General error: {str(e)}")
        return jsonify({
            "error": f"Error analyzing reviews: {str(e)}",
            "suggestion": "The reviews analysis service might be temporarily unavailable. Try again later."
        }), 500

# Legacy endpoint for backward compatibility
@app.route('/get_reviews', methods=['POST'])
def get_reviews_legacy():
    return get_reviews_api()

if __name__ == "__main__":
    app.run(port=5003, debug=True)