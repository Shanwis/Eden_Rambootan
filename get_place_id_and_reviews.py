import os
import re
import time
import json
from typing import Any
from flask import Flask, request, jsonify
from serpapi import GoogleSearch  # type: ignore
from dotenv import load_dotenv  # pip install python-dotenv

# Load environment variables
load_dotenv()
SERPAPI_KEY = os.getenv("SERPAPI_KEY")

app = Flask(__name__)

def normalize_company(company: str) -> str:
    """Remove special characters from company name."""
    return re.sub(r"[\'\"]", "", company).strip()

def maps_search(query: str):
    """Search Google Maps for a business."""
    time.sleep(1)  # Rate limit protection
    try:
        results = GoogleSearch({
            "engine": "google_maps",
            "q": query,
            "api_key": SERPAPI_KEY
        }).get_dict()
        return results.get("local_results", [])
    except Exception as e:
        print(f"❌ Search failed: {str(e)}")
        return []

def get_reviews(place_id: str):
    """Fetch reviews for a specific place_id."""
    time.sleep(1)  # Rate limit protection
    try:
        response = GoogleSearch({
            "engine": "google_maps_reviews",
            "place_id": place_id,
            "api_key": SERPAPI_KEY
        }).get_dict()
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

@app.route('/get_reviews', methods=['POST'])
def get_reviews_api():
    data = request.get_json()
    if data is None:
        return jsonify({'error': 'Invalid JSON sent in request.'}), 400

    company = data.get('company')
    category = data.get('category')
    location = data.get('location', '')  # Optional

    if not company or not category:
        return jsonify({'error': 'Missing required fields: company or category'}), 400

    places = find_best_place(company, category, location)
    if not places:
        return jsonify({'error': 'Business not found.'}), 404

    first_place = places[0]
    reviews = get_reviews(first_place.get("place_id"))
    extracted = extract_review_fields(reviews)

    return jsonify({
        'company': first_place.get('title'),
        'address': first_place.get('address'),
        'reviews': extracted
    })

# Optional CLI display for debugging
def display_reviews(reviews: list):
    """Print only rating, text, and time/date for each review."""
    if not reviews:
        print("❌ No written reviews found (only ratings may exist).")
        return

    print(f"\n📄 Found {len(reviews)} written reviews:")
    for i, review in enumerate(reviews[:10], 1):  # Show top 10
        rating = review.get('rating', '?')
        text = review.get('snippet')
        if not text:
            text = get_original_snippet(review.get('extracted_snippet'))
        date = review.get('date', 'Date unknown')
        print(f"{i}. ⭐ {rating} — 🕒 {date}\n   📝 {text}\n")

if __name__ == "__main__":
    app.run(port=5000, debug=True)
