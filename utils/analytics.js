/**
 * Analytics System for RGIM Store
 * Tracks visitor information and provides insights for administrators
 */

class AnalyticsTracker {
  constructor() {
    this.config = {
      enabled: true,
      trackVisitors: true,
      trackCountries: true,
      retentionDays: 30,
      excludeAdmin: true,
      excludeLocalhost: true
    };

    this.storageKey = 'rgim_analytics';
    this.sessionKey = 'rgim_session';
    this.visitorId = this.getVisitorId();
    this.sessionId = this.getSessionId();
  }

  /**
   * Initialize analytics tracking
   */
  init() {
    if (!this.config.enabled) return;

    // Track page view
    this.trackPageView();

    // Track visitor information
    this.trackVisitor();

    // Clean old data periodically
    this.cleanOldData();
  }

  /**
   * Get or create visitor ID
   */
  getVisitorId() {
    let visitorId = localStorage.getItem('rgim_visitor_id');
    if (!visitorId) {
      visitorId = 'visitor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('rgim_visitor_id', visitorId);
    }
    return visitorId;
  }

  /**
   * Get or create session ID
   */
  getSessionId() {
    let sessionId = sessionStorage.getItem(this.sessionKey);
    if (!sessionId) {
      sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem(this.sessionKey, sessionId);
    }
    return sessionId;
  }

  /**
   * Track page view
   */
  trackPageView() {
    const pageView = {
      visitorId: this.visitorId,
      sessionId: this.sessionId,
      timestamp: new Date().toISOString(),
      page: window.location.pathname,
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      language: navigator.language,
      screenResolution: `${screen.width}x${screen.height}`,
      viewport: `${window.innerWidth}x${window.innerHeight}`
    };

    this.savePageView(pageView);
  }

  /**
   * Track visitor information
   */
  async trackVisitor() {
    try {
      // Get country information
      const country = await this.getCountryInfo();

      const visitor = {
        visitorId: this.visitorId,
        sessionId: this.sessionId,
        timestamp: new Date().toISOString(),
        country: country,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        firstVisit: this.isFirstVisit(),
        returningVisitor: this.isReturningVisitor(),
        deviceType: this.getDeviceType(),
        browser: this.getBrowserInfo(),
        ip: await this.getIPAddress()
      };

      this.saveVisitor(visitor);
    } catch (error) {
      console.warn('Analytics tracking error:', error);
    }
  }

  /**
   * Get country information using IP geolocation
   */
  async getCountryInfo() {
    try {
      // Use a free IP geolocation service
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      return {
        name: data.country_name || 'Unknown',
        code: data.country_code || 'XX',
        city: data.city || 'Unknown',
        region: data.region || 'Unknown'
      };
    } catch (error) {
      console.warn('Could not get country info:', error);
      return {
        name: 'Unknown',
        code: 'XX',
        city: 'Unknown',
        region: 'Unknown'
      };
    }
  }

  /**
   * Get IP address
   */
  async getIPAddress() {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      return 'Unknown';
    }
  }

  /**
   * Check if this is the first visit
   */
  isFirstVisit() {
    const analytics = this.getAnalyticsData();
    return analytics.visitors.filter(v => v.visitorId === this.visitorId).length === 0;
  }

  /**
   * Check if this is a returning visitor
   */
  isReturningVisitor() {
    const analytics = this.getAnalyticsData();
    const visitorVisits = analytics.visitors.filter(v => v.visitorId === this.visitorId);
    return visitorVisits.length > 1;
  }

  /**
   * Get device type
   */
  getDeviceType() {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
      return 'tablet';
    }
    if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
      return 'mobile';
    }
    return 'desktop';
  }

  /**
   * Get browser information
   */
  getBrowserInfo() {
    const ua = navigator.userAgent;
    let browser = 'Unknown';

    if (ua.includes('Chrome')) browser = 'Chrome';
    else if (ua.includes('Firefox')) browser = 'Firefox';
    else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari';
    else if (ua.includes('Edge')) browser = 'Edge';
    else if (ua.includes('Opera')) browser = 'Opera';

    return browser;
  }

  /**
   * Save page view data
   */
  savePageView(pageView) {
    const analytics = this.getAnalyticsData();
    analytics.pageViews.push(pageView);
    this.saveAnalyticsData(analytics);
  }

  /**
   * Save visitor data
   */
  saveVisitor(visitor) {
    const analytics = this.getAnalyticsData();
    analytics.visitors.push(visitor);
    this.saveAnalyticsData(analytics);
  }

  /**
   * Get analytics data from localStorage
   */
  getAnalyticsData() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : {
        pageViews: [],
        visitors: [],
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.warn('Error reading analytics data:', error);
      return {
        pageViews: [],
        visitors: [],
        lastUpdated: new Date().toISOString()
      };
    }
  }

  /**
   * Save analytics data to localStorage
   */
  saveAnalyticsData(data) {
    try {
      data.lastUpdated = new Date().toISOString();
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (error) {
      console.warn('Error saving analytics data:', error);
    }
  }

  /**
   * Clean old analytics data
   */
  cleanOldData() {
    const analytics = this.getAnalyticsData();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - this.config.retentionDays);

    analytics.pageViews = analytics.pageViews.filter(pv =>
      new Date(pv.timestamp) > cutoffDate
    );

    analytics.visitors = analytics.visitors.filter(v =>
      new Date(v.timestamp) > cutoffDate
    );

    this.saveAnalyticsData(analytics);
  }

  /**
   * Get analytics statistics for admin dashboard
   */
  getAnalyticsStats() {
    const analytics = this.getAnalyticsData();
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisWeek = new Date(today);
    thisWeek.setDate(today.getDate() - 7);
    const thisMonth = new Date(today);
    thisMonth.setDate(today.getDate() - 30);

    // Filter data
    const todayViews = analytics.pageViews.filter(pv => new Date(pv.timestamp) >= today);
    const weekViews = analytics.pageViews.filter(pv => new Date(pv.timestamp) >= thisWeek);
    const monthViews = analytics.pageViews.filter(pv => new Date(pv.timestamp) >= thisMonth);

    const todayVisitors = analytics.visitors.filter(v => new Date(v.timestamp) >= today);
    const weekVisitors = analytics.visitors.filter(v => new Date(v.timestamp) >= thisWeek);
    const monthVisitors = analytics.visitors.filter(v => new Date(v.timestamp) >= thisMonth);

    // Unique visitors
    const uniqueToday = new Set(todayVisitors.map(v => v.visitorId)).size;
    const uniqueWeek = new Set(weekVisitors.map(v => v.visitorId)).size;
    const uniqueMonth = new Set(monthVisitors.map(v => v.visitorId)).size;

    // Country stats
    const countryStats = {};
    analytics.visitors.forEach(visitor => {
      const country = visitor.country?.name || 'Unknown';
      countryStats[country] = (countryStats[country] || 0) + 1;
    });

    // Device stats
    const deviceStats = {};
    analytics.visitors.forEach(visitor => {
      const device = visitor.deviceType || 'Unknown';
      deviceStats[device] = (deviceStats[device] || 0) + 1;
    });

    return {
      summary: {
        totalPageViews: analytics.pageViews.length,
        totalVisitors: new Set(analytics.visitors.map(v => v.visitorId)).size,
        todayViews: todayViews.length,
        todayVisitors: uniqueToday,
        weekViews: weekViews.length,
        weekVisitors: uniqueWeek,
        monthViews: monthViews.length,
        monthVisitors: uniqueMonth
      },
      countries: Object.entries(countryStats)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10), // Top 10 countries
      devices: deviceStats,
      recentActivity: analytics.pageViews
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 20) // Last 20 activities
    };
  }

  /**
   * Export analytics data
   */
  exportData() {
    return this.getAnalyticsData();
  }

  /**
   * Clear all analytics data
   */
  clearData() {
    localStorage.removeItem(this.storageKey);
    localStorage.removeItem('rgim_visitor_id');
    sessionStorage.removeItem(this.sessionKey);
  }
}

// Create singleton instance
const analyticsTracker = new AnalyticsTracker();

// Auto-initialize when DOM is ready
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    analyticsTracker.init();
  });
}

// Export for use in other modules
export { AnalyticsTracker, analyticsTracker };

// Utility functions
export const getAnalyticsStats = () => analyticsTracker.getAnalyticsStats();
export const exportAnalyticsData = () => analyticsTracker.exportData();
export const clearAnalyticsData = () => analyticsTracker.clearData();