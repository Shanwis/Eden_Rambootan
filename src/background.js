// Background service worker for the Chrome extension
chrome.runtime.onInstalled.addListener(() => {
  console.log('Company Reputation Analyzer extension installed');
});

// Handle messages from popup or content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'analyzeCompany') {
    // Mock API call - replace with actual API endpoint
    console.log('Analyzing company:', request.data);
    
    // Simulate API response
    setTimeout(() => {
      sendResponse({
        success: true,
        data: {
          score: Math.floor(Math.random() * 100),
          sentiment: 'positive',
          sources: ['Reddit', 'Twitter', 'News', 'Reviews']
        }
      });
    }, 1000);
    
    return true; // Keep message channel open for async response
  }
});

// Handle extension icon click
chrome.action.onClicked.addListener((tab) => {
  // This will open the popup automatically due to manifest configuration
  console.log('Extension icon clicked');
}); 