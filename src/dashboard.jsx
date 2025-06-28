import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { 
  TrendingUp, 
  Download, 
  Copy, 
  FileText, 
  BarChart3, 
  MessageSquare, 
  Globe, 
  Star,
  ArrowUp,
  ArrowDown,
  Target,
  Users,
  Activity,
  Zap,
  Shield,
  Heart,
  Lightbulb,
  RefreshCw
} from 'lucide-react';
import './index.css';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [redditData, setRedditData] = useState(null);
  const [newsData, setNewsData] = useState(null);
  const [mastodonData, setMastodonData] = useState(null);
  const [reviewsData, setReviewsData] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const dashboardRef = useRef(null);

  // Get company data from URL params or localStorage
  const getCompanyData = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return {
      company: urlParams.get('company') || localStorage.getItem('company') || 'Sample Company',
      location: urlParams.get('location') || localStorage.getItem('location') || 'New York, USA',
      type: urlParams.get('type') || localStorage.getItem('type') || 'tech'
    };
  };

  const companyData = getCompanyData();

  // Mock data (fallback)
  const sentimentData = [
    { date: 'Jun 21', positive: 58, neutral: 44, negative: 28 },
    { date: 'Jun 22', positive: 60, neutral: 38, negative: 22 },
    { date: 'Jun 23', positive: 66, neutral: 44, negative: 20 },
    { date: 'Jun 24', positive: 54, neutral: 20, negative: 24 },
    { date: 'Jun 25', positive: 34, neutral: 40, negative: 26 },
    { date: 'Jun 26', positive: 62, neutral: 22, negative: 28 },
    { date: 'Jun 27', positive: 40, neutral: 44, negative: 18 },
  ];

  const sourceData = [
    { name: 'Reddit', value: 35, color: '#FF6B6B' },
    { name: 'Twitter', value: 25, color: '#4ECDC4' },
    { name: 'News', value: 20, color: '#45B7D1' },
    { name: 'Reviews', value: 20, color: '#96CEB4' }
  ];

  const suggestions = [
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: 'Improve Customer Service',
      description: 'Focus on response time and resolution quality',
      impact: 'High',
      priority: 'urgent'
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: 'Enhance Online Presence',
      description: 'Update website and social media engagement',
      impact: 'Medium',
      priority: 'high'
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: 'Product Quality Review',
      description: 'Address quality concerns from recent feedback',
      impact: 'High',
      priority: 'medium'
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Employee Satisfaction',
      description: 'Improve workplace culture and benefits',
      impact: 'Medium',
      priority: 'low'
    }
  ];

  const metrics = [
    { label: 'Overall Score', value: 78, change: '+5', trend: 'up', icon: <TrendingUp /> },
    { label: 'Sentiment', value: 82, change: '+8', trend: 'up', icon: <Heart /> },
    { label: 'Overall Score', value: 78, change: '+5', trend: 'up', icon: <TrendingUp /> },
    { label: 'Sentiment', value: 82, change: '+8', trend: 'up', icon: <Heart /> }
  ];

  // Fetch data from all sources
  const fetchAllData = async () => {
    setIsRefreshing(true);
    
    try {
      // Fetch Reddit data
      const redditResponse = await fetch(`http://localhost:5050/api/reddit?company=${encodeURIComponent(companyData.company)}&type=${encodeURIComponent(companyData.type)}`);
      if (redditResponse.ok) {
        const redditResult = await redditResponse.json();
        setRedditData(redditResult);
        console.log('✅ Reddit data loaded:', redditResult);
      }
    } catch (error) {
      console.log('❌ Reddit API not available:', error);
    }

    try {
      // Fetch News data
      const newsResponse = await fetch(`http://localhost:5000/api/twitter?company=${encodeURIComponent(companyData.company)}&type=${encodeURIComponent(companyData.type)}`);
      if (newsResponse.ok) {
        const newsResult = await newsResponse.json();
        setNewsData(newsResult);
        console.log('✅ News data loaded:', newsResult);
      }
    } catch (error) {
      console.log('❌ News API not available:', error);
    }

    try {
      // Fetch Mastodon data
      const mastodonResponse = await fetch(`http://localhost:5002/api/mastodon?company=${encodeURIComponent(companyData.company)}&type=${encodeURIComponent(companyData.type)}`);
      if (mastodonResponse.ok) {
        const mastodonResult = await mastodonResponse.json();
        setMastodonData(mastodonResult);
        console.log('✅ Mastodon data loaded:', mastodonResult);
      }
    } catch (error) {
      console.log('❌ Mastodon API not available:', error);
    }

    try {
      // Fetch Reviews data
      const reviewsResponse = await fetch('http://localhost:5000/get_reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          company: companyData.company,
          category: companyData.type,
          location: companyData.location
        })
      });
      if (reviewsResponse.ok) {
        const reviewsResult = await reviewsResponse.json();
        setReviewsData(reviewsResult);
        console.log('✅ Reviews data loaded:', reviewsResult);
      }
    } catch (error) {
      console.log('❌ Reviews API not available:', error);
    }

    setIsRefreshing(false);
  };

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setIsLoading(false), 1500);
    
    // Fetch real data
    fetchAllData();
  }, []);

  // Calculate dynamic metrics based on real data
  const calculateMetrics = () => {
    let overallScore = 78;
    let sentimentScore = 82;
    
    if (redditData && redditData.sentiment_analysis) {
      const { positive, negative, total } = redditData.sentiment_analysis;
      if (total > 0) {
        sentimentScore = Math.round((positive / total) * 100);
        overallScore = Math.round(((positive * 2 + (total - positive - negative)) / (total * 2)) * 100);
      }
    }
    
    return [
      { label: 'Overall Score', value: overallScore, change: '+5', trend: 'up', icon: <TrendingUp /> },
      { label: 'Sentiment', value: sentimentScore, change: '+8', trend: 'up', icon: <Heart /> }
    ];
  };

  // Generate dynamic source data
  const generateSourceData = () => {
    const sources = [];
    let total = 0;
    
    if (redditData && redditData.post_count > 0) {
      sources.push({ name: 'Reddit', value: redditData.post_count, color: '#FF6B6B' });
      total += redditData.post_count;
    }
    
    if (newsData && newsData.article_count > 0) {
      sources.push({ name: 'News', value: newsData.article_count, color: '#45B7D1' });
      total += newsData.article_count;
    }
    
    if (mastodonData && mastodonData.post_count > 0) {
      sources.push({ name: 'Mastodon', value: mastodonData.post_count, color: '#4ECDC4' });
      total += mastodonData.post_count;
    }
    
    if (reviewsData && reviewsData.reviews && reviewsData.reviews.length > 0) {
      sources.push({ name: 'Reviews', value: reviewsData.reviews.length, color: '#96CEB4' });
      total += reviewsData.reviews.length;
    }
    
    // Convert to percentages
    return sources.map(source => ({
      ...source,
      value: total > 0 ? Math.round((source.value / total) * 100) : 0
    }));
  };

  const handleExport = (type) => {
    if (type === 'csv') {
      const csvData = createCSVData();
      downloadCSV(csvData, 'company-reputation-dashboard.csv');
    } else if (type === 'pdf') {
      generatePDF();
    }
  };

  const generatePDF = async () => {
    if (!dashboardRef.current) return;
    
    try {
      const exportButton = document.querySelector('[onclick*="pdf"]');
      if (exportButton) {
        exportButton.disabled = true;
        exportButton.innerHTML = '<div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>Generating PDF...';
      }

      const canvas = await html2canvas(dashboardRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#e3f0fa',
        width: dashboardRef.current.scrollWidth,
        height: dashboardRef.current.scrollHeight
      });

      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      const pdf = new jsPDF('p', 'mm', 'a4');
      let position = 0;

      pdf.setFontSize(24);
      pdf.setTextColor(21, 81, 146);
      pdf.text('Company Reputation Dashboard', 105, 30, { align: 'center' });
      
      pdf.setFontSize(12);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`${companyData.company} - AI-powered analysis and insights`, 105, 40, { align: 'center' });
      
      pdf.setFontSize(10);
      pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 50, { align: 'center' });
      
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Add summary page with real data
      pdf.addPage();
      pdf.setFontSize(16);
      pdf.setTextColor(21, 81, 146);
      pdf.text('Executive Summary', 20, 30);
      
      pdf.setFontSize(12);
      pdf.setTextColor(0, 0, 0);
      pdf.text('Key Metrics:', 20, 50);
      pdf.setFontSize(10);
      
      const dynamicMetrics = calculateMetrics();
      pdf.text(`• Overall Score: ${dynamicMetrics[0].value} (${dynamicMetrics[0].change} from previous period)`, 25, 60);
      pdf.text(`• Sentiment Score: ${dynamicMetrics[1].value} (${dynamicMetrics[1].change} from previous period)`, 25, 70);
      
      if (redditData && redditData.sentiment_analysis) {
        pdf.text(`• Reddit Analysis: ${redditData.sentiment_analysis.positive} positive, ${redditData.sentiment_analysis.negative} negative posts`, 25, 80);
      }
      
      pdf.text('Data Sources:', 20, 100);
      const dynamicSources = generateSourceData();
      dynamicSources.forEach((source, index) => {
        pdf.text(`• ${source.name}: ${source.value}% of total mentions`, 25, 110 + (index * 10));
      });

      if (redditData && redditData.ai_suggestions) {
        pdf.text('AI Recommendations:', 20, 140);
        pdf.text(redditData.ai_suggestions.substring(0, 400) + '...', 25, 150, { maxWidth: 160 });
      }

      pdf.save(`${companyData.company}-reputation-dashboard.pdf`);

      if (exportButton) {
        exportButton.disabled = false;
        exportButton.innerHTML = '<FileText className="w-4 h-4 mr-2" />Export PDF';
      }

    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  const createCSVData = () => {
    const headers = [
      'Date',
      'Positive Sentiment',
      'Neutral Sentiment', 
      'Negative Sentiment',
      'Overall Score',
      'Sentiment Score',
      'Source',
      'Contribution %'
    ];

    const rows = [];
    
    // Add sentiment data
    sentimentData.forEach(day => {
      rows.push([
        day.date,
        day.positive,
        day.neutral,
        day.negative,
        calculateMetrics()[0].value,
        calculateMetrics()[1].value,
        'N/A',
        'N/A'
      ]);
    });

    // Add real source data
    const dynamicSources = generateSourceData();
    dynamicSources.forEach(source => {
      rows.push([
        'N/A',
        'N/A',
        'N/A',
        'N/A',
        'N/A',
        'N/A',
        source.name,
        source.value
      ]);
    });

    // Add Reddit insights if available
    if (redditData && redditData.key_issues) {
      redditData.key_issues.forEach(issue => {
        rows.push([
          'N/A',
          'N/A',
          'N/A',
          'N/A',
          'N/A',
          'N/A',
          'Reddit Issue',
          issue
        ]);
      });
    }

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    return csvContent;
  };

  const downloadCSV = (csvContent, filename) => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleCopySummary = async () => {
    try {
      const summary = createSummaryText();
      await navigator.clipboard.writeText(summary);
      
      const copyButton = document.querySelector('[onclick*="handleCopySummary"]');
      if (copyButton) {
        const originalText = copyButton.innerHTML;
        copyButton.innerHTML = '<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>Copied!';
        setTimeout(() => {
          copyButton.innerHTML = originalText;
        }, 2000);
      }
    } catch (error) {
      console.error('Error copying summary:', error);
      alert('Error copying summary. Please try again.');
    }
  };

  const createSummaryText = () => {
    const currentDate = new Date().toLocaleDateString();
    const dynamicMetrics = calculateMetrics();
    const dynamicSources = generateSourceData();
    
    let summary = `COMPANY REPUTATION DASHBOARD SUMMARY
Generated on: ${currentDate}
Company: ${companyData.company}
Location: ${companyData.location}
Industry: ${companyData.type}

OVERALL PERFORMANCE
• Overall Score: ${dynamicMetrics[0].value} (${dynamicMetrics[0].change} from previous period)
• Sentiment Score: ${dynamicMetrics[1].value} (${dynamicMetrics[1].change} from previous period)
• Trend: Positive growth in reputation metrics

DATA SOURCES BREAKDOWN`;

    dynamicSources.forEach(source => {
      summary += `\n• ${source.name}: ${source.value}% of total mentions`;
    });

    if (redditData && redditData.sentiment_analysis) {
      summary += `\n\nREDDIT SENTIMENT ANALYSIS
• Positive Posts: ${redditData.sentiment_analysis.positive}
• Negative Posts: ${redditData.sentiment_analysis.negative}
• Neutral Posts: ${redditData.sentiment_analysis.neutral}
• Total Posts Analyzed: ${redditData.sentiment_analysis.total}`;
    }

    if (redditData && redditData.company_brief) {
      summary += `\n\nCOMPANY OVERVIEW
${redditData.company_brief}`;
    }

    if (redditData && redditData.ai_suggestions) {
      summary += `\n\nAI-POWERED RECOMMENDATIONS
${redditData.ai_suggestions}`;
    }

    if (redditData && redditData.key_issues && redditData.key_issues.length > 0) {
      summary += `\n\nKEY ISSUES IDENTIFIED`;
      redditData.key_issues.forEach((issue, index) => {
        summary += `\n${index + 1}. ${issue}`;
      });
    }

    summary += `\n\nACTION ITEMS
• Monitor sentiment trends across all platforms
• Address key issues identified in Reddit discussions
• Continue engaging with customers on social media
• Focus on improving areas with negative feedback

For detailed analysis and charts, please refer to the full dashboard report.`;

    return summary;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-black/80 text-lg">Analyzing {companyData.company} reputation...</p>
          <p className="text-black/60 text-sm mt-2">Gathering data from Reddit, News, Mastodon, and Reviews...</p>
        </motion.div>
      </div>
    );
  }

  const dynamicMetrics = calculateMetrics();
  const dynamicSources = generateSourceData();

  return (
    <div className="min-h-screen" style={{ background: '#e3f0fa' }} ref={dashboardRef}>
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card m-6 p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-black mb-2">{companyData.company} - Reputation Dashboard</h1>
            <p className="text-black/80">AI-powered analysis and insights • {companyData.location} • {companyData.type}</p>
            {redditData && redditData.company_brief && (
              <p className="text-black/70 text-sm mt-2 max-w-2xl">{redditData.company_brief}</p>
            )}
          </div>
          <div className="flex space-x-3">
            <button
              onClick={fetchAllData}
              disabled={isRefreshing}
              className="glass-button flex items-center"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
            </button>
            <button
              onClick={handleCopySummary}
              className="glass-button flex items-center"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy Summary
            </button>
            <button
              onClick={() => handleExport('pdf')}
              className="glass-button flex items-center"
            >
              <FileText className="w-4 h-4 mr-2" />
              Export PDF
            </button>
            <button
              onClick={() => handleExport('csv')}
              className="glass-button flex items-center"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="px-6 pb-6 space-y-6">
        {/* Metrics Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {/* Data Status Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6 lg:col-span-2"
          >
            <h3 className="text-xl font-semibold mb-4" style={{ fontFamily: 'Freigeist', fontWeight: 400 }}>Data Sources Status</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${redditData ? 'bg-green-400' : 'bg-red-400'}`}></div>
                <span>Reddit: {redditData ? `${redditData.post_count} posts` : 'Unavailable'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${newsData ? 'bg-green-400' : 'bg-red-400'}`}></div>
                <span>News: {newsData ? `${newsData.article_count} articles` : 'Unavailable'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${mastodonData ? 'bg-green-400' : 'bg-red-400'}`}></div>
                <span>Mastodon: {mastodonData ? `${mastodonData.post_count} posts` : 'Unavailable'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${reviewsData ? 'bg-green-400' : 'bg-red-400'}`}></div>
                <span>Reviews: {reviewsData ? `${reviewsData.reviews?.length || 0} reviews` : 'Unavailable'}</span>
              </div>
            </div>
          </motion.div>

          {/* Dynamic Metrics */}
          {dynamicMetrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="glass-card p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-black/60">{metric.icon}</div>
                <div className="flex items-center text-sm text-green-400">
                  <ArrowUp className="w-4 h-4 mr-1" />
                  {metric.change}
                </div>
              </div>
              <div className="text-3xl font-bold text-black mb-1">{metric.value}</div>
              <div className="text-black/60 text-sm">{metric.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sentiment Over Time */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card px-8 py-6"
          >
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 text-primary mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
              <span className="text-lg font-semibold text-primary">Sentiment Over Time</span>
            </div>
            <div className="text-neutral-gray text-sm mb-4">Last 7 days sentiment analysis</div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={sentimentData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5b366" />
                <XAxis dataKey="date" stroke="#3c9cce" tick={{ fontSize: 14, fontWeight: 500 }} axisLine={false} tickLine={false} />
                <YAxis stroke="#3c9cce" domain={[0, 80]} tick={{ fontSize: 14, fontWeight: 500 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#fff', borderRadius: 12, border: 'none', color: '#222', fontWeight: 500 }} />
                <Line type="monotone" dataKey="positive" name="Positive" stroke="#155192" strokeWidth={3} dot={{ r: 6, fill: '#155192' }} activeDot={{ r: 8, fill: '#155192' }} />
                <Line type="monotone" dataKey="neutral" name="Neutral" stroke="#e5b366" strokeWidth={3} dot={{ r: 6, fill: '#e5b366' }} activeDot={{ r: 8, fill: '#e5b366' }} />
                <Line type="monotone" dataKey="negative" name="Negative" stroke="#da9e48" strokeWidth={3} dot={{ r: 6, fill: '#da9e48' }} activeDot={{ r: 8, fill: '#da9e48' }} />
              </LineChart>
            </ResponsiveContainer>
            <div className="flex justify-center space-x-8 mt-4">
              <div className="flex items-center space-x-2">
                <span className="w-4 h-4 rounded-full inline-block" style={{ background: '#155192' }}></span>
                <span className="text-md font-semibold" style={{ color: '#155192' }}>Positive</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-4 h-4 rounded-full inline-block" style={{ background: '#e5b366' }}></span>
                <span className="text-md font-semibold" style={{ color: '#e5b366' }}>Neutral</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-4 h-4 rounded-full inline-block" style={{ background: '#da9e48' }}></span>
                <span className="text-md font-semibold" style={{ color: '#da9e48' }}>Negative</span>
              </div>
            </div>
          </motion.div>

          {/* Source Breakdown */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card px-8 py-6 flex flex-col items-center"
          >
            <div className="flex items-center mb-1 w-full">
              <svg className="w-5 h-5 text-primary mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 3v18h18" /><path d="M9 17V9h8" /></svg>
              <span className="text-lg font-semibold text-primary">Source Breakdown</span>
            </div>
            <div className="text-neutral-gray text-sm mb-4 w-full">Data sources contribution</div>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={dynamicSources.length > 0 ? dynamicSources : [
                    { name: 'Reddit', value: 35, color: '#155192' },
                    { name: 'Twitter', value: 30, color: '#5ca4d2' },
                    { name: 'Google Reviews', value: 20, color: '#88bde1' },
                    { name: 'News Articles', value: 15, color: '#e5b366' },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                  nameKey="name"
                >
                  {(dynamicSources.length > 0 ? dynamicSources : [
                    { name: 'Reddit', value: 35, color: '#155192' },
                    { name: 'Twitter', value: 30, color: '#5ca4d2' },
                    { name: 'Google Reviews', value: 20, color: '#88bde1' },
                    { name: 'News Articles', value: 15, color: '#e5b366' },
                  ]).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`Contribution : ${value}%`, '']}
                  contentStyle={{ background: '#fff', borderRadius: 12, border: 'none', color: '#222', fontWeight: 500 }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center space-x-6 mt-6 flex-wrap">
              {(dynamicSources.length > 0 ? dynamicSources : [
                { name: 'Reddit', value: 35, color: '#155192' },
                { name: 'Twitter', value: 30, color: '#5ca4d2' },
                { name: 'Google Reviews', value: 20, color: '#88bde1' },
                { name: 'News Articles', value: 15, color: '#e5b366' },
              ]).map((source, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <span className="w-4 h-4 rounded-full inline-block" style={{ background: source.color }}></span>
                  <span className="text-sm font-medium" style={{ color: source.color }}>{source.name}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* AI Suggestions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="chart-container"
        >
          <div className="flex items-center mb-6">
            <Zap className="w-6 h-6 text-yellow-400 mr-3" />
            <h3 className="text-xl font-semibold text-black">AI-Powered Recommendations</h3>
          </div>
          
          {/* Reddit AI Suggestions */}
          {redditData && redditData.ai_suggestions && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              className="suggestion-card group mb-6"
            >
              <div className="flex items-start space-x-4">
                <div className="text-primary-400 group-hover:text-primary-300 transition-colors">
                  <Lightbulb className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h4 className="text-black font-semibold mb-2">Reddit Analysis Insights</h4>
                  <p className="text-black/70 text-sm mb-3 whitespace-pre-line">{redditData.ai_suggestions}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-black/60">Source: AI Analysis of {redditData.post_count} Reddit posts</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-400">AI Generated</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Key Issues */}
          {redditData && redditData.key_issues && redditData.key_issues.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 }}
              className="suggestion-card group mb-6"
            >
              <div className="flex items-start space-x-4">
                <div className="text-red-400 group-hover:text-red-300 transition-colors">
                  <Target className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h4 className="text-black font-semibold mb-2">Key Issues Identified</h4>
                  <ul className="text-black/70 text-sm space-y-1">
                    {redditData.key_issues.map((issue, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-red-400 mt-1">•</span>
                        <span>{issue}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-black/60">Extracted from negative sentiment analysis</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-red-500/20 text-red-400">High Priority</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Default suggestions if no Reddit data */}
          {!redditData && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {suggestions.map((suggestion, index) => (
                <motion.div
                  key={suggestion.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="suggestion-card group"
                >
                  <div className="flex items-start space-x-4">
                    <div className="text-primary-400 group-hover:text-primary-300 transition-colors">
                      {suggestion.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-black font-semibold mb-2">{suggestion.title}</h4>
                      <p className="text-black/70 text-sm mb-3">{suggestion.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-black/60">Impact: {suggestion.impact}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          suggestion.priority === 'urgent' ? 'bg-red-500/20 text-red-400' :
                          suggestion.priority === 'high' ? 'bg-orange-500/20 text-orange-400' :
                          suggestion.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-green-500/20 text-green-400'
                        }`}>
                          {suggestion.priority}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('dashboard-root'));
root.render(<Dashboard />);