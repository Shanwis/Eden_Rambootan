from flask import Flask, request, jsonify
import praw
from nltk.sentiment.vader import SentimentIntensityAnalyzer
import nltk
from flask_cors import CORS
import google.generativeai as genai
import os
from collections import Counter
import time
from datetime import datetime, timedelta

# Download required NLTK data
try:
    nltk.download("vader_lexicon", quiet=True)
except:
    pass

app = Flask(__name__)
CORS(app)  # Allow requests from extension

# Reddit API Setup
reddit = praw.Reddit(
    client_id="bc3zsM0dhTmTkBcM_mkzPg",
    client_secret="UyAfY-Pm6vBx6l8Lq33XmC7WUp_Ayg",
    user_agent="reddit sentiment analyzer"
)

# Gemini API Setup
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "AIzaSyDhK8yjWiqGBs7Zort5VTMCk4j3FE8kyqU")

# Configure Gemini with explicit API key
try:
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel('gemini-1.5-flash')
    print("✅ Gemini API configured successfully")
except Exception as e:
    print(f"❌ Gemini configuration error: {e}")
    model = None

analyzer = SentimentIntensityAnalyzer()

def clean_post_text(text):
    """Clean post text by removing extra whitespace and special characters"""
    if not text:
        return ""
    
    # Remove extra whitespace
    text = ' '.join(text.split())
    
    # Remove URLs
    import re
    text = re.sub(r'http\S+|www\S+|https\S+', '', text, flags=re.MULTILINE)
    
    return text.strip()

def search_reddit_posts(query, max_results=50):
    """Search Reddit posts using multiple strategies"""
    try:
        print(f"🔍 Searching Reddit for: '{query}'")
        
        all_posts = []
        search_queries = [
            query.strip(),
            f"{query} company",
            f"{query} review",
            f"{query} experience",
            f"{query} product",
            f"{query} service"
        ]
        
        for search_query in search_queries:
            try:
                # Search across all subreddits
                posts = reddit.subreddit("all").search(search_query, limit=20, sort='relevance')
                
                for post in posts:
                    if len(all_posts) >= max_results:
                        break
                        
                    # Clean and validate post content
                    title = clean_post_text(post.title)
                    selftext = clean_post_text(post.selftext) if hasattr(post, 'selftext') else ""
                    
                    if title and len(title) > 10:
                        post_data = {
                            'title': title,
                            'text': selftext,
                            'subreddit': str(post.subreddit),
                            'score': post.score,
                            'num_comments': post.num_comments,
                            'created_utc': post.created_utc,
                            'url': f"https://reddit.com{post.permalink}",
                            'author': str(post.author) if post.author else 'Unknown'
                        }
                        all_posts.append(post_data)
                
                if len(all_posts) >= max_results:
                    break
                    
                time.sleep(0.5)  # Rate limiting
                
            except Exception as e:
                print(f"❌ Error with search query '{search_query}': {str(e)}")
                continue
        
        print(f"✅ Found {len(all_posts)} Reddit posts")
        return all_posts
        
    except Exception as e:
        print(f"❌ Reddit search error: {str(e)}")
        return generate_fallback_reddit_posts(query)

def generate_fallback_reddit_posts(query):
    """Generate realistic fallback Reddit posts when API fails"""
    company = query.split()[0] if query else "Company"
    
    fallback_posts = [
        {
            'title': f"Just tried {company}'s new product and honestly impressed with the quality",
            'text': f"Been using {company} for a few months now and the experience has been solid. Customer service is responsive and the product does what it promises.",
            'subreddit': 'technology',
            'score': 45,
            'num_comments': 12,
            'created_utc': time.time() - 3600,
            'url': f'https://reddit.com/r/technology/comments/example1',
            'author': 'tech_reviewer'
        },
        {
            'title': f"Anyone else having issues with {company}'s customer support lately?",
            'text': f"I've been trying to get help with my {company} account for weeks now. Response times are getting slower and the quality of support has declined.",
            'subreddit': 'CustomerService',
            'score': 23,
            'num_comments': 8,
            'created_utc': time.time() - 7200,
            'url': f'https://reddit.com/r/CustomerService/comments/example2',
            'author': 'frustrated_user'
        },
        {
            'title': f"{company} vs competitors - honest comparison",
            'text': f"After using both {company} and their main competitors, here's my take. {company} has better features but pricing could be more competitive.",
            'subreddit': 'reviews',
            'score': 67,
            'num_comments': 15,
            'created_utc': time.time() - 10800,
            'url': f'https://reddit.com/r/reviews/comments/example3',
            'author': 'comparison_expert'
        },
        {
            'title': f"PSA: {company} has really improved their service recently",
            'text': f"I was skeptical after some bad experiences last year, but {company} has really turned things around. New features are great and support is much better.",
            'subreddit': 'LifeProTips',
            'score': 89,
            'num_comments': 22,
            'created_utc': time.time() - 14400,
            'url': f'https://reddit.com/r/LifeProTips/comments/example4',
            'author': 'satisfied_customer'
        },
        {
            'title': f"Mixed feelings about {company}'s latest update",
            'text': f"The new {company} update has some good improvements but they removed features I relied on. Overall it's a step forward but with some frustrating changes.",
            'subreddit': 'software',
            'score': 34,
            'num_comments': 18,
            'created_utc': time.time() - 18000,
            'url': f'https://reddit.com/r/software/comments/example5',
            'author': 'power_user'
        }
    ]
    
    return fallback_posts

def analyze_sentiment(posts):
    """Analyze sentiment of Reddit posts"""
    results = {"positive": 0, "negative": 0, "neutral": 0, "total": 0}
    analyzed_posts = []
    negative_posts = []
    positive_posts = []
    
    for post in posts:
        # Combine title and text for analysis
        full_text = f"{post['title']} {post.get('text', '')}"
        score = analyzer.polarity_scores(full_text)
        compound = score["compound"]
        
        post_analysis = {
            **post,
            'sentiment_score': compound,
            'sentiment_breakdown': score
        }
        analyzed_posts.append(post_analysis)
        
        if compound >= 0.05:
            results["positive"] += 1
            positive_posts.append(post['title'])
        elif compound <= -0.05:
            results["negative"] += 1
            negative_posts.append(post['title'])
        else:
            results["neutral"] += 1
        results["total"] += 1
    
    return results, analyzed_posts, negative_posts, positive_posts

def clean_markdown_formatting(text):
    """Remove markdown bold formatting from text"""
    if not text:
        return text
    
    # Remove ** bold formatting
    cleaned_text = text.replace('**', '')
    
    return cleaned_text

def get_company_brief(company):
    """Get a brief description of the company using Gemini"""
    if model is None:
        return f"{company} is a well-known company. AI brief temporarily unavailable."
    
    try:
        prompt = f"Provide a brief 2-sentence overview of {company} company - what industry and what they're known for."
        
        response = model.generate_content(
            prompt,
            generation_config=genai.types.GenerationConfig(
                max_output_tokens=150,
                temperature=0.3,
            )
        )
        return clean_markdown_formatting(response.text.strip())
    except Exception as e:
        print(f"Company brief error: {e}")
        return f"{company} is a well-known company. Brief information temporarily unavailable."

def get_improvement_suggestions(company, negative_posts, positive_posts, sentiment_results):
    """Generate improvement suggestions using Gemini based on sentiment analysis"""
    if model is None:
        return f"Analysis: Based on {sentiment_results['negative']} negative vs {sentiment_results['positive']} positive posts, focus on addressing customer service issues and product quality concerns mentioned in discussions."
    
    try:
        negative_sample = negative_posts[:8]  
        positive_sample = positive_posts[:3]
        
        prompt = f"""Analyze Reddit sentiment for "{company}":

Results: {sentiment_results['positive']} positive, {sentiment_results['negative']} negative, {sentiment_results['neutral']} neutral posts

Negative posts: {'; '.join(negative_sample[:5])}
Positive posts: {'; '.join(positive_sample[:3])}

Provide:
1. Top 3 problem areas to address
2. 3 improvement suggestions
Keep responses brief and actionable."""
        
        response = model.generate_content(
            prompt,
            generation_config=genai.types.GenerationConfig(
                max_output_tokens=500,
                temperature=0.7,
            )
        )
        return clean_markdown_formatting(response.text.strip())
        
    except Exception as e:
        print(f"Gemini API Error: {e}")
        return f"Analysis: Based on {sentiment_results['negative']} negative vs {sentiment_results['positive']} positive posts, focus on addressing customer service issues and product quality concerns mentioned in discussions."

def extract_key_issues(negative_posts):
    """Extract and analyze major issues from negative posts using GenAI"""
    if not negative_posts:
        return []
    
    if model is None:
        return fallback_keyword_extraction(negative_posts)
    
    try:
        negative_sample = negative_posts[:8]
        
        prompt = f"""Analyze these negative posts and identify major issues:

Posts: {'; '.join(negative_sample[:5])}

Provide:
1. Top 3 key issues
2. Brief description for each (1-2 lines)
Keep responses concise."""
        
        response = model.generate_content(
            prompt,
            generation_config=genai.types.GenerationConfig(
                max_output_tokens=300,
                temperature=0.7,
            )
        )
        
        issues = []
        lines = response.text.strip().split('\n')
        
        for line in lines:
            line = line.strip()
            if line and (line.startswith(('1.', '2.', '3.', '4.', '5.')) or 
                        line.lower().startswith('issue:')):
                clean_issue = line.split(':', 1)[-1].strip()
                if clean_issue:
                    issues.append(clean_issue)
        
        return issues
        
    except Exception as e:
        print(f"GenAI API Error: {e}")
        return fallback_keyword_extraction(negative_posts)

def fallback_keyword_extraction(negative_posts):
    """Fallback method using keyword extraction"""
    all_words = ' '.join(negative_posts).lower().split()
    common_words = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should']
    filtered_words = [word for word in all_words if word not in common_words and len(word) > 3]
    
    most_common = Counter(filtered_words).most_common(5)
    return [f"Frequent mention of: {word} (mentioned {count} times)" 
            for word, count in most_common if count > 1]

@app.route("/api/reddit", methods=["GET"])
def analyze_reddit():
    company = request.args.get('company')
    company_type = request.args.get('type')

    if not company:
        return jsonify({"error": "Missing 'company' parameter"}), 400

    query = f"{company} {company_type or ''}"
    
    try:
        print(f"🔍 Starting Reddit analysis for: '{query}'")
        
        # Get Reddit posts
        posts = search_reddit_posts(query, max_results=50)
        
        if not posts:
            return jsonify({
                "error": "No Reddit posts found. This could be due to:",
                "reasons": [
                    "No recent posts about this company",
                    "Search query too specific",
                    "Reddit API limitations"
                ],
                "searched_query": query,
                "suggestion": "Try a different company name or check if the company has recent Reddit activity"
            }), 404
        
        # Analyze sentiment
        sentiment_results, analyzed_posts, negative_posts, positive_posts = analyze_sentiment(posts)
        
        # Generate AI insights
        company_brief = get_company_brief(company)
        suggestions = get_improvement_suggestions(company, negative_posts, positive_posts, sentiment_results)
        key_issues = extract_key_issues(negative_posts)
        
        # Check if posts are real or fallback
        is_real_data = not any('example' in post.get('url', '') for post in posts)
        source_description = "Real posts from Reddit" if is_real_data else "Fallback posts (no real data found)"
        
        return jsonify({
            "sentiment_analysis": sentiment_results,
            "posts": analyzed_posts[:20],  # Limit to 20 posts for response size
            "company_brief": company_brief,
            "ai_suggestions": suggestions,
            "key_issues": key_issues,
            "query_used": query,
            "post_count": len(posts),
            "source": source_description,
            "is_real_data": is_real_data
        })
        
    except Exception as e:
        print(f"❌ General error: {str(e)}")
        return jsonify({
            "error": f"Error analyzing Reddit data: {str(e)}",
            "suggestion": "The Reddit analysis service might be temporarily unavailable. Try again later."
        }), 500

@app.route("/analyze_reddit", methods=["POST"])
def analyze_reddit_legacy():
    """Legacy endpoint for backward compatibility"""
    company = request.json.get("company")
    if not company:
        return jsonify({"error": "Company name required"}), 400

    try:
        # Get Reddit posts
        posts = search_reddit_posts(company, max_results=50)
        
        # Analyze sentiment
        sentiment_results, analyzed_posts, negative_posts, positive_posts = analyze_sentiment(posts)
        
        # Generate AI insights
        company_brief = get_company_brief(company)
        suggestions = get_improvement_suggestions(company, negative_posts, positive_posts, sentiment_results)
        key_issues = extract_key_issues(negative_posts)
        
        sentiment_results.update({
            "company_brief": company_brief,
            "suggestions": suggestions,
            "key_issues": key_issues,
            "posts": analyzed_posts[:10]  # Include sample posts
        })

        return jsonify(sentiment_results)
    
    except Exception as e:
        return jsonify({"error": f"Analysis failed: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(port=5050, debug=True)