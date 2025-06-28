#!/usr/bin/env python3
"""
Simple script to update Gemini API key in all scraper files
"""

import os
import re

def update_api_key_in_file(filename, new_api_key):
    """Update the API key in a Python file"""
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Replace the placeholder with the new API key
        updated_content = content.replace(
            '"YOUR_NEW_GEMINI_API_KEY_HERE"',
            f'"{new_api_key}"'
        )
        
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(updated_content)
        
        print(f"✅ Updated {filename}")
        return True
    except Exception as e:
        print(f"❌ Error updating {filename}: {e}")
        return False

def main():
    print("🔑 Gemini API Key Updater")
    print("=" * 40)
    
    # Get new API key from user
    new_api_key = input("Enter your new Gemini API key: ").strip()
    
    if not new_api_key:
        print("❌ No API key provided. Exiting.")
        return
    
    # Files to update
    files_to_update = [
        'reddit_scraper.py',
        'news_scraper.py', 
        'reviews_scraper.py',
        'unified_analyzer.py'
    ]
    
    print(f"\n🔄 Updating API key in {len(files_to_update)} files...")
    
    success_count = 0
    for filename in files_to_update:
        if os.path.exists(filename):
            if update_api_key_in_file(filename, new_api_key):
                success_count += 1
        else:
            print(f"⚠️  File {filename} not found, skipping...")
    
    print(f"\n✅ Successfully updated {success_count}/{len(files_to_update)} files!")
    print("\n🔄 Now restart your servers to use the new API key:")
    print("   python reddit_scraper.py")
    print("   python news_scraper.py") 
    print("   python reviews_scraper.py")
    print("   python unified_analyzer.py")

if __name__ == "__main__":
    main() 