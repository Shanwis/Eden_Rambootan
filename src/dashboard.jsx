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
  Lightbulb
} from 'lucide-react';
import './index.css';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const dashboardRef = useRef(null);

  // Mock data
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

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setIsLoading(false), 1500);
  }, []);

  const handleExport = (type) => {
    if (type === 'csv') {
      // Create CSV data from dashboard information
      const csvData = createCSVData();
      downloadCSV(csvData, 'company-reputation-dashboard.csv');
    } else if (type === 'pdf') {
      generatePDF();
    }
  };

  const generatePDF = async () => {
    if (!dashboardRef.current) return;
    
    try {
      // Show loading state
      const exportButton = document.querySelector('[onclick*="pdf"]');
      if (exportButton) {
        exportButton.disabled = true;
        exportButton.innerHTML = '<div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>Generating PDF...';
      }

      // Capture the dashboard content
      const canvas = await html2canvas(dashboardRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#e3f0fa',
        width: dashboardRef.current.scrollWidth,
        height: dashboardRef.current.scrollHeight
      });

      const imgData = canvas.toDataURL('image/png');
      
      // Calculate PDF dimensions
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      const pdf = new jsPDF('p', 'mm', 'a4');
      let position = 0;

      // Add title page
      pdf.setFontSize(24);
      pdf.setTextColor(21, 81, 146); // Primary color
      pdf.text('Company Reputation Dashboard', 105, 30, { align: 'center' });
      
      pdf.setFontSize(12);
      pdf.setTextColor(100, 100, 100);
      pdf.text('AI-powered analysis and insights', 105, 40, { align: 'center' });
      
      pdf.setFontSize(10);
      pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 50, { align: 'center' });
      
      pdf.addPage();

      // Add the dashboard image
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if content is longer than one page
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Add summary page
      pdf.addPage();
      pdf.setFontSize(16);
      pdf.setTextColor(21, 81, 146);
      pdf.text('Executive Summary', 20, 30);
      
      pdf.setFontSize(12);
      pdf.setTextColor(0, 0, 0);
      pdf.text('Key Metrics:', 20, 50);
      pdf.setFontSize(10);
      pdf.text(`• Overall Score: 78 (+5 from previous period)`, 25, 60);
      pdf.text(`• Sentiment Score: 82 (+8 from previous period)`, 25, 70);
      pdf.text(`• Positive sentiment trend over the last 7 days`, 25, 80);
      
      pdf.text('Top Recommendations:', 20, 100);
      pdf.text(`• Improve Customer Service (High Impact, Urgent Priority)`, 25, 110);
      pdf.text(`• Enhance Online Presence (Medium Impact, High Priority)`, 25, 120);
      pdf.text(`• Product Quality Review (High Impact, Medium Priority)`, 25, 130);

      // Save the PDF
      pdf.save('company-reputation-dashboard.pdf');

      // Reset button state
      if (exportButton) {
        exportButton.disabled = false;
        exportButton.innerHTML = '<FileText className="w-4 h-4 mr-2" />Export PDF';
      }

    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
      
      // Reset button state on error
      const exportButton = document.querySelector('[onclick*="pdf"]');
      if (exportButton) {
        exportButton.disabled = false;
        exportButton.innerHTML = '<FileText className="w-4 h-4 mr-2" />Export PDF';
      }
    }
  };

  const createCSVData = () => {
    // Create CSV content with all dashboard data
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
        '78', // Overall score
        '82', // Sentiment score
        'N/A',
        'N/A'
      ]);
    });

    // Add source breakdown data
    const sourceBreakdown = [
      { name: 'Reddit', value: 35 },
      { name: 'Twitter', value: 30 },
      { name: 'Google Reviews', value: 20 },
      { name: 'News Articles', value: 15 }
    ];

    sourceBreakdown.forEach(source => {
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

    // Add suggestions data
    suggestions.forEach(suggestion => {
      rows.push([
        'N/A',
        'N/A',
        'N/A',
        'N/A',
        'N/A',
        'N/A',
        `Suggestion: ${suggestion.title}`,
        `Priority: ${suggestion.priority}, Impact: ${suggestion.impact}`
      ]);
    });

    // Convert to CSV format
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
      // Create a comprehensive summary
      const summary = createSummaryText();
      
      // Copy to clipboard
      await navigator.clipboard.writeText(summary);
      
      // Show success feedback
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
    
    // Calculate average sentiment
    const avgPositive = Math.round(sentimentData.reduce((sum, day) => sum + day.positive, 0) / sentimentData.length);
    const avgNeutral = Math.round(sentimentData.reduce((sum, day) => sum + day.neutral, 0) / sentimentData.length);
    const avgNegative = Math.round(sentimentData.reduce((sum, day) => sum + day.negative, 0) / sentimentData.length);
    
    // Get top sources
    const topSources = [
      { name: 'Reddit', value: 35 },
      { name: 'Twitter', value: 30 },
      { name: 'Google Reviews', value: 20 },
      { name: 'News Articles', value: 15 }
    ].sort((a, b) => b.value - a.value);

    // Get urgent/high priority suggestions
    const urgentSuggestions = suggestions.filter(s => s.priority === 'urgent' || s.priority === 'high');

    const summary = `COMPANY REPUTATION DASHBOARD SUMMARY
Generated on: ${currentDate}

OVERALL PERFORMANCE
• Overall Score: 78 (+5 from previous period)
• Sentiment Score: 82 (+8 from previous period)
• Trend: Positive growth in reputation metrics

SENTIMENT ANALYSIS (Last 7 Days)
• Average Positive Sentiment: ${avgPositive}%
• Average Neutral Sentiment: ${avgNeutral}%
• Average Negative Sentiment: ${avgNegative}%
• Overall Trend: Positive sentiment showing consistent improvement

DATA SOURCES BREAKDOWN
• ${topSources[0].name}: ${topSources[0].value}% of total mentions
• ${topSources[1].name}: ${topSources[1].value}% of total mentions
• ${topSources[2].name}: ${topSources[2].value}% of total mentions
• ${topSources[3].name}: ${topSources[3].value}% of total mentions

KEY INSIGHTS
• Customer satisfaction is trending upward with positive sentiment growth
• Social media presence (Reddit & Twitter) accounts for 65% of reputation data
• Recent improvements in customer service are reflected in sentiment scores

TOP RECOMMENDATIONS
${urgentSuggestions.map((suggestion, index) => 
  `${index + 1}. ${suggestion.title} (${suggestion.priority.toUpperCase()} priority, ${suggestion.impact} impact)
   - ${suggestion.description}`
).join('\n')}

COMPANY DESCRIPTION
This company has demonstrated strong market presence with consistent growth in customer satisfaction and brand recognition. Recent analysis shows positive sentiment trends across multiple platforms, indicating a healthy reputation in the industry.

ACTION ITEMS
• Prioritize customer service improvements (urgent)
• Enhance online presence and social media engagement (high)
• Continue monitoring sentiment trends for early warning signs
• Focus on Reddit and Twitter as primary reputation channels

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
          <p className="text-black/80 text-lg">Analyzing company reputation...</p>
        </motion.div>
      </div>
    );
  }

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
            <h1 className="text-3xl font-bold text-black mb-2">Company Reputation Dashboard</h1>
            <p className="text-black/80">AI-powered analysis and insights</p>
          </div>
          <div className="flex space-x-3">
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
          {/* Company Description - Double Size */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6 lg:col-span-2"
          >
            <h3 className="text-xl font-semibold mb-4" style={{ fontFamily: 'Freigeist', fontWeight: 400 }}>Company Description</h3>
            <p className="text-black/80 text-sm leading-relaxed">
              This company has demonstrated strong market presence with consistent growth in customer satisfaction and brand recognition. 
              Recent analysis shows positive sentiment trends across multiple platforms, indicating a healthy reputation in the industry.
            </p>
          </motion.div>

          {/* Third Box - Overall Score */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-black/60"><TrendingUp /></div>
              <div className="flex items-center text-sm text-green-400">
                <ArrowUp className="w-4 h-4 mr-1" />
                +5
              </div>
            </div>
            <div className="text-3xl font-bold text-black mb-1">78</div>
            <div className="text-black/60 text-sm">Overall Score</div>
          </motion.div>

          {/* Fourth Box - Sentiment */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-black/60"><Heart /></div>
              <div className="flex items-center text-sm text-green-400">
                <ArrowUp className="w-4 h-4 mr-1" />
                +8
              </div>
            </div>
            <div className="text-3xl font-bold text-black mb-1">82</div>
            <div className="text-black/60 text-sm">Sentiment</div>
          </motion.div>
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
            {/* Custom Legend */}
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
                  data={[
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
                  {[
                    { name: 'Reddit', value: 35, color: '#155192' },
                    { name: 'Twitter', value: 30, color: '#5ca4d2' },
                    { name: 'Google Reviews', value: 20, color: '#88bde1' },
                    { name: 'News Articles', value: 15, color: '#e5b366' },
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`Contribution : ${value}%`, '']}
                  contentStyle={{ background: '#fff', borderRadius: 12, border: 'none', color: '#222', fontWeight: 500 }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Legend */}
            <div className="flex justify-center space-x-6 mt-6">
              <div className="flex items-center space-x-2">
                <span className="w-4 h-4 rounded-full inline-block" style={{ background: '#155192' }}></span>
                <span className="text-sm font-medium" style={{ color: '#155192' }}>Reddit</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-4 h-4 rounded-full inline-block" style={{ background: '#5ca4d2' }}></span>
                <span className="text-sm font-medium" style={{ color: '#5ca4d2' }}>Twitter</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-4 h-4 rounded-full inline-block" style={{ background: '#88bde1' }}></span>
                <span className="text-sm font-medium" style={{ color: '#88bde1' }}>Google Reviews</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-4 h-4 rounded-full inline-block" style={{ background: '#e5b366' }}></span>
                <span className="text-sm font-medium" style={{ color: '#e5b366' }}>News Articles</span>
              </div>
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
            <h3 className="text-xl font-semibold text-black mb-4">Sentiment Trend (Last 7 Days)</h3>
          </div>
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
        </motion.div>
      </div>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('dashboard-root'));
root.render(<Dashboard />); 