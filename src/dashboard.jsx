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
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import './index.css';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [unifiedData, setUnifiedData] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [dataStatus, setDataStatus] = useState({
    reddit: false,
    news: false,
    mastodon: false,
    reviews: false
  });
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

  // Fetch unified analysis data
  const fetchUnifiedData = async () => {
    setIsRefreshing(true);
    
    try {
      console.log('🔍 Fetching unified analysis...');
      const response = await fetch(`http://localhost:5004/api/unified-analysis?company=${encodeURIComponent(companyData.company)}&type=${encodeURIComponent(companyData.type)}&location=${encodeURIComponent(companyData.location)}`);
      
      if (response.ok) {
        const data = await response.json();
        setUnifiedData(data);
        console.log('✅ Unified data loaded:', data);
        
        // Update data status
        setDataStatus({
          reddit: data.data_sources?.reddit?.is_real_data || false,
          news: data.data_sources?.news?.is_real_data || false,
          mastodon: data.data_sources?.mastodon?.is_real_data || false,
          reviews: data.data_sources?.reviews?.is_real_data || false
        });
      } else {
        console.log('❌ Unified analysis API not available');
        // Fallback to individual API calls
        await fetchIndividualData();
      }
    } catch (error) {
      console.log('❌ Unified analysis failed, trying individual APIs:', error);
      await fetchIndividualData();
    }

    setIsRefreshing(false);
  };

  // Fallback to individual API calls
  const fetchIndividualData = async () => {
    const fallbackData = {
      company: companyData.company,
      reputation_score: 75,
      unified_insights: "Analysis based on available data sources. Focus on improving customer engagement and addressing service quality concerns.",
      trend_data: [
        { date: 'Day 1', positive: 45, neutral: 35, negative: 20 },
        { date: 'Day 2', positive: 50, neutral: 30, negative: 20 },
        { date: 'Day 3', positive: 55, neutral: 25, negative: 20 },
        { date: 'Day 4', positive: 48, neutral: 32, negative: 20 },
        { date: 'Day 5', positive: 52, neutral: 28, negative: 20 },
        { date: 'Day 6', positive: 58, neutral: 22, negative: 20 },
        { date: 'Day 7', positive: 60, neutral: 25, negative: 15 }
      ],
      source_breakdown: [
        { name: 'Reddit', value: 35, percentage: 35, color: '#FF6B6B' },
        { name: 'News', value: 25, percentage: 25, color: '#45B7D1' },
        { name: 'Mastodon', value: 20, percentage: 20, color: '#4ECDC4' },
        { name: 'Reviews', value: 20, percentage: 20, color: '#96CEB4' }
      ],
      total_mentions: 100
    };

    // Try to fetch individual data sources
    try {
      const redditResponse = await fetch(`http://localhost:5050/api/reddit?company=${encodeURIComponent(companyData.company)}&type=${encodeURIComponent(companyData.type)}`);
      if (redditResponse.ok) {
        const redditData = await redditResponse.json();
        fallbackData.data_sources = { reddit: redditData };
        setDataStatus(prev => ({ ...prev, reddit: redditData.is_real_data || false }));
      }
    } catch (error) {
      console.log('❌ Reddit API not available');
    }

    setUnifiedData(fallbackData);
  };

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setIsLoading(false), 1500);
    
    // Fetch unified data
    fetchUnifiedData();
  }, []);

  // Calculate dynamic metrics
  const calculateMetrics = () => {
    if (!unifiedData) {
      return [
        { label: 'Overall Score', value: 75, change: '+5', trend: 'up', icon: <TrendingUp /> },
        { label: 'Sentiment', value: 80, change: '+8', trend: 'up', icon: <Heart /> },
        { label: 'Mentions', value: 150, change: '+12', trend: 'up', icon: <MessageSquare /> },
        { label: 'Sources', value: 4, change: '0', trend: 'neutral', icon: <Globe /> }
      ];
    }

    const reputationScore = unifiedData.reputation_score || 75;
    const totalMentions = unifiedData.total_mentions || 0;
    const activeSources = unifiedData.source_breakdown?.length || 0;
    
    // Calculate sentiment score from trend data
    const latestTrend = unifiedData.trend_data?.[unifiedData.trend_data.length - 1];
    const sentimentScore = latestTrend ? latestTrend.positive : 80;

    return [
      { label: 'Overall Score', value: reputationScore, change: '+5', trend: 'up', icon: <TrendingUp /> },
      { label: 'Sentiment', value: sentimentScore, change: '+8', trend: 'up', icon: <Heart /> },
      { label: 'Mentions', value: totalMentions, change: '+12', trend: 'up', icon: <MessageSquare /> },
      { label: 'Sources', value: activeSources, change: '0', trend: 'neutral', icon: <Globe /> }
    ];
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

      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // Add title page
      pdf.setFontSize(24);
      pdf.setTextColor(21, 81, 146);
      pdf.text('Company Reputation Dashboard', 105, 30, { align: 'center' });
      
      pdf.setFontSize(12);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`${companyData.company} - Comprehensive AI Analysis`, 105, 40, { align: 'center' });
      
      pdf.setFontSize(10);
      pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 50, { align: 'center' });
      
      if (unifiedData) {
        pdf.text(`Overall Reputation Score: ${unifiedData.reputation_score}/100`, 105, 60, { align: 'center' });
      }
      
      // Add dashboard image
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

      // Add summary page
      pdf.addPage();
      pdf.setFontSize(16);
      pdf.setTextColor(21, 81, 146);
      pdf.text('Executive Summary', 20, 30);
      
      if (unifiedData) {
        pdf.setFontSize(12);
        pdf.setTextColor(0, 0, 0);
        pdf.text('Key Metrics:', 20, 50);
        pdf.setFontSize(10);
        
        const metrics = calculateMetrics();
        metrics.forEach((metric, index) => {
          pdf.text(`• ${metric.label}: ${metric.value} (${metric.change} from previous period)`, 25, 60 + (index * 10));
        });
        
        pdf.text('AI Insights:', 20, 110);
        const insights = unifiedData.unified_insights || 'No insights available';
        pdf.text(insights.substring(0, 500) + '...', 25, 120, { maxWidth: 160 });
      }

      pdf.save(`${companyData.company}-reputation-dashboard.pdf`);

    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  const createCSVData = () => {
    const headers = ['Metric', 'Value', 'Source', 'Date'];
    const rows = [];
    
    if (unifiedData) {
      // Add reputation score
      rows.push(['Reputation Score', unifiedData.reputation_score, 'Unified Analysis', new Date().toLocaleDateString()]);
      
      // Add source breakdown
      unifiedData.source_breakdown?.forEach(source => {
        rows.push([`${source.name} Mentions`, source.value, source.name, new Date().toLocaleDateString()]);
      });
      
      // Add trend data
      unifiedData.trend_data?.forEach(day => {
        rows.push(['Positive Sentiment', day.positive, 'Trend Analysis', day.date]);
        rows.push(['Negative Sentiment', day.negative, 'Trend Analysis', day.date]);
        rows.push(['Neutral Sentiment', day.neutral, 'Trend Analysis', day.date]);
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
      
      // Visual feedback
      const copyButton = document.querySelector('[data-copy-button]');
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
    
    let summary = `COMPREHENSIVE REPUTATION DASHBOARD SUMMARY
Generated on: ${currentDate}
Company: ${companyData.company}
Location: ${companyData.location}
Industry: ${companyData.type}

`;

    if (unifiedData) {
      summary += `OVERALL PERFORMANCE
• Reputation Score: ${unifiedData.reputation_score}/100
• Total Mentions: ${unifiedData.total_mentions}
• Active Data Sources: ${unifiedData.source_breakdown?.length || 0}

DATA SOURCES BREAKDOWN`;

      unifiedData.source_breakdown?.forEach(source => {
        summary += `\n• ${source.name}: ${source.value} mentions (${source.percentage}%)`;
      });

      if (unifiedData.unified_insights) {
        summary += `\n\nAI-POWERED INSIGHTS
${unifiedData.unified_insights}`;
      }

      // Add individual source insights
      const dataSources = unifiedData.data_sources || {};
      
      if (dataSources.reddit?.ai_suggestions) {
        summary += `\n\nREDDIT ANALYSIS
${dataSources.reddit.ai_suggestions}`;
      }
      
      if (dataSources.news?.ai_insights) {
        summary += `\n\nNEWS ANALYSIS
${dataSources.news.ai_insights}`;
      }
      
      if (dataSources.reviews?.ai_insights) {
        summary += `\n\nREVIEWS ANALYSIS
${dataSources.reviews.ai_insights}`;
      }
    }

    summary += `\n\nRECOMMENDED ACTIONS
• Monitor sentiment trends across all platforms
• Address key issues identified in analysis
• Engage proactively with customers on social media
• Focus on improving areas with negative feedback
• Implement reputation management strategies

For detailed analysis and interactive charts, please refer to the full dashboard report.`;

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
          <p className="text-black/60 text-sm mt-1">Performing AI-powered sentiment analysis...</p>
        </motion.div>
      </div>
    );
  }

  const dynamicMetrics = calculateMetrics();

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
            <p className="text-black/80">AI-powered comprehensive analysis • {companyData.location} • {companyData.type}</p>
            {unifiedData && (
              <div className="mt-3 flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="text-2xl font-bold text-primary">
                    {unifiedData.reputation_score}/100
                  </div>
                  <span className="text-black/70">Overall Reputation Score</span>
                </div>
                <div className="text-black/60">
                  • {unifiedData.total_mentions} total mentions analyzed
                </div>
              </div>
            )}
          </div>
          <div className="flex space-x-3">
            <button
              onClick={fetchUnifiedData}
              disabled={isRefreshing}
              className="glass-button flex items-center"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
            </button>
            <button
              onClick={handleCopySummary}
              data-copy-button
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
            className="glass-card p-6 lg:col-span-4"
          >
            <h3 className="text-xl font-semibold mb-4" style={{ fontFamily: 'Freigeist', fontWeight: 400 }}>Data Sources Status</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${dataStatus.reddit ? 'bg-green-400' : 'bg-red-400'}`}></div>
                <span>Reddit: {dataStatus.reddit ? 'Live Data' : 'Fallback Data'}</span>
                {dataStatus.reddit ? <CheckCircle className="w-4 h-4 text-green-400" /> : <XCircle className="w-4 h-4 text-red-400" />}
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${dataStatus.news ? 'bg-green-400' : 'bg-red-400'}`}></div>
                <span>News: {dataStatus.news ? 'Live Data' : 'Fallback Data'}</span>
                {dataStatus.news ? <CheckCircle className="w-4 h-4 text-green-400" /> : <XCircle className="w-4 h-4 text-red-400" />}
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${dataStatus.mastodon ? 'bg-green-400' : 'bg-red-400'}`}></div>
                <span>Mastodon: {dataStatus.mastodon ? 'Live Data' : 'Fallback Data'}</span>
                {dataStatus.mastodon ? <CheckCircle className="w-4 h-4 text-green-400" /> : <XCircle className="w-4 h-4 text-red-400" />}
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${dataStatus.reviews ? 'bg-green-400' : 'bg-red-400'}`}></div>
                <span>Reviews: {dataStatus.reviews ? 'Live Data' : 'Fallback Data'}</span>
                {dataStatus.reviews ? <CheckCircle className="w-4 h-4 text-green-400" /> : <XCircle className="w-4 h-4 text-red-400" />}
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
              <TrendingUp className="w-5 h-5 text-primary mr-2" />
              <span className="text-lg font-semibold text-primary">Sentiment Trends</span>
            </div>
            <div className="text-neutral-gray text-sm mb-4">AI-powered sentiment analysis over time</div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={unifiedData?.trend_data || []} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
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
              <BarChart3 className="w-5 h-5 text-primary mr-2" />
              <span className="text-lg font-semibold text-primary">Source Distribution</span>
            </div>
            <div className="text-neutral-gray text-sm mb-4 w-full">Data sources contribution analysis</div>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={unifiedData?.source_breakdown || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                  nameKey="name"
                >
                  {(unifiedData?.source_breakdown || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [`${value} mentions (${unifiedData?.source_breakdown?.find(s => s.name === name)?.percentage || 0}%)`, name]}
                  contentStyle={{ background: '#fff', borderRadius: 12, border: 'none', color: '#222', fontWeight: 500 }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center space-x-6 mt-6 flex-wrap">
              {(unifiedData?.source_breakdown || []).map((source, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <span className="w-4 h-4 rounded-full inline-block" style={{ background: source.color }}></span>
                  <span className="text-sm font-medium" style={{ color: source.color }}>
                    {source.name} ({source.percentage}%)
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* AI Insights Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="chart-container"
        >
          <div className="flex items-center mb-6">
            <Zap className="w-6 h-6 text-yellow-400 mr-3" />
            <h3 className="text-xl font-semibold text-black">AI-Powered Comprehensive Analysis</h3>
          </div>
          
          {/* Unified AI Insights */}
          {unifiedData?.unified_insights && (
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
                  <h4 className="text-black font-semibold mb-2">Comprehensive Reputation Analysis</h4>
                  <p className="text-black/70 text-sm mb-3 whitespace-pre-line">{unifiedData.unified_insights}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-black/60">
                      Source: AI Analysis of {unifiedData.total_mentions} mentions across {unifiedData.source_breakdown?.length || 0} platforms
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-400">AI Generated</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Individual Source Insights */}
          {unifiedData?.data_sources && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Reddit Insights */}
              {unifiedData.data_sources.reddit?.ai_suggestions && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 }}
                  className="suggestion-card group"
                >
                  <div className="flex items-start space-x-4">
                    <div className="text-red-400 group-hover:text-red-300 transition-colors">
                      <MessageSquare className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-black font-semibold mb-2">Reddit Community Insights</h4>
                      <p className="text-black/70 text-sm mb-3 whitespace-pre-line">
                        {unifiedData.data_sources.reddit.ai_suggestions.substring(0, 200)}...
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-black/60">
                          From {unifiedData.data_sources.reddit.post_count || 0} Reddit posts
                        </span>
                        <span className="text-xs px-2 py-1 rounded-full bg-red-500/20 text-red-400">Reddit Analysis</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* News Insights */}
              {unifiedData.data_sources.news?.ai_insights && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 }}
                  className="suggestion-card group"
                >
                  <div className="flex items-start space-x-4">
                    <div className="text-blue-400 group-hover:text-blue-300 transition-colors">
                      <Globe className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-black font-semibold mb-2">Media Coverage Analysis</h4>
                      <p className="text-black/70 text-sm mb-3 whitespace-pre-line">
                        {unifiedData.data_sources.news.ai_insights.substring(0, 200)}...
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-black/60">
                          From {unifiedData.data_sources.news.article_count || 0} news articles
                        </span>
                        <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-400">News Analysis</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Reviews Insights */}
              {unifiedData.data_sources.reviews?.ai_insights && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9 }}
                  className="suggestion-card group"
                >
                  <div className="flex items-start space-x-4">
                    <div className="text-green-400 group-hover:text-green-300 transition-colors">
                      <Star className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-black font-semibold mb-2">Customer Reviews Analysis</h4>
                      <p className="text-black/70 text-sm mb-3 whitespace-pre-line">
                        {unifiedData.data_sources.reviews.ai_insights.substring(0, 200)}...
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-black/60">
                          From {unifiedData.data_sources.reviews.review_count || 0} customer reviews
                        </span>
                        <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400">Reviews Analysis</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Mastodon Insights */}
              {unifiedData.data_sources.mastodon && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.0 }}
                  className="suggestion-card group"
                >
                  <div className="flex items-start space-x-4">
                    <div className="text-purple-400 group-hover:text-purple-300 transition-colors">
                      <Users className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-black font-semibold mb-2">Social Media Sentiment</h4>
                      <p className="text-black/70 text-sm mb-3">
                        Mastodon community discussions show varied engagement patterns. Monitor social sentiment trends for reputation insights.
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-black/60">
                          From {unifiedData.data_sources.mastodon.post_count || 0} social media posts
                        </span>
                        <span className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-400">Social Analysis</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('dashboard-root'));
root.render(<Dashboard />);