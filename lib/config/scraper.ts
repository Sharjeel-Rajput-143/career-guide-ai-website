export const SCRAPER_CONFIG = {
    remoteOK: {
      baseUrl: 'https://remoteok.io',
      defaultDelay: 2000,           // 2 seconds between requests
      maxJobsPerSearch: 50,         // Max jobs per search term
      maxConcurrentRequests: 1,     // Only 1 request at a time
      timeout: 10000,               // 10 second timeout
      retries: 3,                   // Retry failed requests 3 times
      userAgents: [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36...',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36...',
        // Add more user agents for rotation
      ]
    }
  };