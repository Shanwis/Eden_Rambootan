import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Building2, TrendingUp, Sparkles } from 'lucide-react';
import './index.css';

const Popup = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    location: '',
    companyType: ''
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showScore, setShowScore] = useState(false);
  const [reputationScore, setReputationScore] = useState(0);

  const companyTypes = [
    { value: 'tech', label: 'Technology', icon: '💻' },
    { value: 'retail', label: 'Retail', icon: '🛍️' },
    { value: 'healthcare', label: 'Healthcare', icon: '🏥' },
    { value: 'finance', label: 'Finance', icon: '💰' },
    { value: 'education', label: 'Education', icon: '🎓' },
    { value: 'manufacturing', label: 'Manufacturing', icon: '🏭' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAnalyze = async () => {
    if (!formData.companyName || !formData.location || !formData.companyType) {
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate API call
    setTimeout(() => {
      const mockScore = Math.floor(Math.random() * 100);
      setReputationScore(mockScore);
      setIsAnalyzing(false);
      setShowScore(true);
      
      // Navigate to dashboard after showing score
      setTimeout(() => {
        chrome.tabs.create({ url: chrome.runtime.getURL('dashboard.html') });
      }, 2000);
    }, 2000);
  };

  const getScoreEmoji = (score) => {
    if (score >= 70) return '😊';
    if (score >= 40) return '😐';
    return '😞';
  };

  const getScoreColor = (score) => {
    if (score >= 70) return 'text-green-400';
    if (score >= 40) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="w-full h-full p-6" style={{ background: 'none' }}>
      <AnimatePresence mode="wait">
        {!showScore ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              <div className="flex items-center justify-center mb-3">
                <Sparkles className="w-8 h-8" style={{ color: '#dff46b' }} />
                <h1 className="text-2xl font-bold" style={{ color: '#dff46b' }}>Reputation Analyzer</h1>
              </div>
              <p className="text-sm" style={{ color: '#133830' }}>AI-powered company reputation analysis</p>
            </motion.div>

            {/* Company Name Input */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label className="block text-white/90 text-[17px] font-normal mb-2" style={{ fontFamily: 'Raleway', fontWeight: 400 }}>
                Company Name
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  placeholder="Enter company name..."
                  className="glass-input w-full pl-10 appearance-none cursor-pointer"
                  style={{ background: '#133830', color: '#fff', borderColor: '#dff46b' }}
                />
              </div>
            </motion.div>

            {/* Location Input */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label className="block text-white/90 text-[17px] font-normal mb-2" style={{ fontFamily: 'Raleway', fontWeight: 400 }}>
                Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="City, Country..."
                  className="glass-input w-full pl-10 appearance-none cursor-pointer"
                  style={{ background: '#133830', color: '#fff', borderColor: '#dff46b' }}
                />
              </div>
            </motion.div>

            {/* Company Type Dropdown */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label className="block text-white/90 text-[17px] font-normal mb-2" style={{ fontFamily: 'Raleway', fontWeight: 400 }}>
                Company Type
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                <select
                  value={formData.companyType}
                  onChange={(e) => handleInputChange('companyType', e.target.value)}
                  className="glass-input w-full pl-10 appearance-none cursor-pointer"
                  style={{ background: '#133830', color: '#fff', borderColor: '#dff46b' }}
                >
                  <option value="">Select company type...</option>
                  {companyTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.icon} {type.label}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </motion.div>

            {/* Analyze Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="pt-4"
            >
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !formData.companyName || !formData.location || !formData.companyType}
                className="glass-button w-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: '#dff46b', color: '#133830', border: 'none' }}
                onMouseOver={e => { e.currentTarget.style.background = '#dd8a97'; e.currentTarget.style.color = '#133830'; }}
                onMouseOut={e => { e.currentTarget.style.background = '#dff46b'; e.currentTarget.style.color = '#133830'; }}
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Analyze Reputation
                  </>
                )}
              </button>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="score"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center h-full space-y-6"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="score-card w-full max-w-xs"
            >
              <div className="text-6xl mb-4">{getScoreEmoji(reputationScore)}</div>
              <div className={`text-4xl font-bold mb-2 ${getScoreColor(reputationScore)}`}>
                {reputationScore}/100
              </div>
              <div className="text-white/80 text-sm">
                {reputationScore >= 70 ? 'Excellent Reputation' : 
                 reputationScore >= 40 ? 'Average Reputation' : 'Poor Reputation'}
              </div>
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-white/80 text-center text-sm"
            >
              Opening detailed dashboard...
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('popup-root'));
root.render(<Popup />); 