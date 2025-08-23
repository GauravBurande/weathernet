# DePIN WeatherNet - Weather Data Management System

A modern, production-ready weather data management system built with Next.js, featuring real-time data polling, global state management, and AI-powered analysis.

## 🚀 Features

- **Global State Management**: Centralized weather data store using Zustand
- **Real-time Polling**: Configurable 15-second data updates
- **AI Analysis**: Intelligent weather insights and predictions
- **Production Ready**: Easy transition from development to production
- **Optimized Frontend**: Efficient data rendering and updates
- **Simplified Forms**: Streamlined application process

## 🏗️ Architecture

### Core Components

1. **Weather Store** (`lib/weather-store.ts`)

   - Global state management using Zustand
   - Computed statistics and data utilities
   - Type-safe weather data interface

2. **Weather Service** (`lib/weather-service.ts`)

   - API communication layer
   - Configurable polling mechanism
   - Error handling and retry logic

3. **Configuration** (`lib/config.ts`)

   - Environment-based configuration
   - Easy switching between dev/prod modes
   - Centralized settings management

4. **AI Analysis** (`components/weather-ai-analysis.tsx`)
   - Real-time weather insights
   - Trend detection and predictions
   - Automated recommendations

## 🔧 Development vs Production

### Development Mode

- **Data Appending**: Simulates real-time updates by appending new data
- **15-second Polling**: Continuous data collection for testing
- **Debug Logging**: Enhanced console output for development

### Production Mode

- **Data Replacement**: Replaces existing data with fresh API responses
- **Configurable Polling**: Adjustable update intervals
- **Error Monitoring**: Retry logic and error reporting
- **Performance Optimized**: Memory management and efficient updates

## 📊 Data Flow

```
API Endpoint (/api/getdata)
    ↓
Weather Service (fetch & process)
    ↓
Global Store (Zustand)
    ↓
UI Components (Charts, Tables, AI Analysis)
```

## 🚀 Getting Started

### Installation

```bash
npm install
# or
pnpm install
```

### Development

```bash
npm run dev
# or
pnpm dev
```

The system will automatically start polling weather data every 15 seconds in development mode.

### Production Build

```bash
npm run build
npm start
```

## ⚙️ Configuration

### Environment Variables

```bash
NODE_ENV=production  # Switch to production mode
```

### Customizing Polling Intervals

Edit `lib/config.ts`:

```typescript
export const config = {
  weather: {
    pollInterval: 15000, // 15 seconds
    // ... other settings
  },
};
```

### API Endpoints

Configure endpoints in `lib/config.ts`:

```typescript
endpoints: {
  getData: '/api/getdata',
  storeData: '/api/storedata',
  apply: '/api/apply'
}
```

## 🔄 Transitioning to Production

### 1. Remove Development Polling

The system automatically detects the environment. In production:

- Data appending is disabled
- Real API data replaces existing data
- Enhanced error handling is enabled

### 2. Update API Endpoints

Ensure your production API endpoints are correctly configured in the config file.

### 3. Adjust Polling Intervals

Modify the `pollInterval` in production to match your API's update frequency.

### 4. Monitor Performance

The system includes built-in monitoring for:

- API response times
- Error rates
- Data freshness

## 📱 Components

### Dashboard Stats

- Real-time network statistics
- Active node count
- Data point totals
- Network health monitoring

### Weather Charts

- Temperature and humidity trends
- Air quality measurements
- Node activity visualization

### AI Analysis

- Automated weather insights
- Trend detection
- Predictive analytics
- Actionable recommendations

### Weather Data Table

- Live sensor readings
- Real-time updates
- Sortable data columns
- Status indicators

## 🛠️ Customization

### Adding New Weather Metrics

1. Update the `WeatherDataPoint` interface in `lib/weather-store.ts`
2. Modify the AI analysis logic in `components/weather-ai-analysis.tsx`
3. Update chart configurations in `components/weather-charts.tsx`

### Custom Polling Logic

Extend the `WeatherDataService` class:

```typescript
class CustomWeatherService extends WeatherDataService {
  async customFetchLogic() {
    // Your custom implementation
  }
}
```

### Adding New AI Insights

Enhance the analysis in `components/weather-ai-analysis.tsx`:

```typescript
const customAnalysis = useMemo(() => {
  // Your custom analysis logic
}, [weatherData]);
```

## 🧪 Testing

### Development Testing

- Use the 15-second polling to simulate real-time data
- Test AI analysis with various data scenarios
- Verify chart responsiveness with live updates

### Production Testing

- Test API endpoint connectivity
- Verify error handling and retry logic
- Monitor memory usage with large datasets

## 📈 Performance

### Optimizations

- **Efficient Rendering**: React.memo and useMemo for expensive calculations
- **Memory Management**: Configurable data point limits
- **Debounced Updates**: Smooth UI updates without overwhelming the system
- **Lazy Loading**: Components load data only when needed

### Monitoring

- Real-time performance metrics
- API response time tracking
- Memory usage monitoring
- Error rate analysis

## 🔒 Security

- Environment-based configuration
- Secure API communication
- Input validation and sanitization
- Error message sanitization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:

- Check the configuration documentation
- Review the component examples
- Examine the TypeScript interfaces
- Test with different data scenarios

---

**Built with ❤️ using Next.js, Zustand, and modern React patterns**
