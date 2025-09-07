# Wanderer - Travel Planner

A modern, responsive travel planning web application built with Next.js 14, TypeScript, and Tailwind CSS. Plan your perfect trip with weather forecasts, outfit recommendations, and local insights.

## Features

### ✅ Implemented
- **Trip Management**: Create and manage multiple trips with destinations
- **Destination Planning**: Add destinations with dates and manage your itinerary
- **Weather Integration**: 7-day weather forecast for each destination (with OpenWeatherMap API)
- **Attractions & Landmarks**: Curated list of top attractions with detailed information
- **Restaurant Recommendations**: Local cuisine recommendations with filtering options
- **Responsive Design**: Mobile-first design that works on all devices
- **Data Persistence**: All data saved to localStorage
- **Modern UI/UX**: Clean, intuitive interface with smooth animations

### 🚧 Coming Soon
- **Outfit Recommendations**: Smart outfit suggestions based on weather
- **Transportation Information**: Public transport guides for each city
- **Custom Excursions**: Personal activity planning and management
- **Export Features**: PDF itinerary export and sharing

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Icons**: Lucide React
- **Storage**: localStorage
- **Deployment**: Vercel-ready

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd wanderer-travel-planner
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_OPENWEATHER_API_KEY=your_openweather_api_key_here
   NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=your_google_places_api_key_here
   NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=your_unsplash_access_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## API Keys Setup

### OpenWeatherMap API (Required for Weather)
1. Sign up at [OpenWeatherMap](https://openweathermap.org/api)
2. Get your free API key
3. Add it to your `.env.local` file as `NEXT_PUBLIC_OPENWEATHER_API_KEY`

### Google Places API (Optional)
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Places API
3. Create credentials and get your API key
4. Add it to your `.env.local` file as `NEXT_PUBLIC_GOOGLE_PLACES_API_KEY`

### Unsplash API (Optional)
1. Sign up at [Unsplash Developers](https://unsplash.com/developers)
2. Create a new application
3. Get your access key
4. Add it to your `.env.local` file as `NEXT_PUBLIC_UNSPLASH_ACCESS_KEY`

## Deployment

### Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [Vercel](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables in Vercel dashboard
   - Deploy!

### Environment Variables in Vercel
Add these environment variables in your Vercel project settings:
- `NEXT_PUBLIC_OPENWEATHER_API_KEY`
- `NEXT_PUBLIC_GOOGLE_PLACES_API_KEY`
- `NEXT_PUBLIC_UNSPLASH_ACCESS_KEY`

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page
├── components/            # React components
│   ├── forms/            # Form components
│   ├── layout/           # Layout components
│   ├── pages/            # Page components
│   └── ui/               # Reusable UI components
├── context/              # React Context for state management
├── data/                 # Static data files
├── lib/                  # Utility functions
├── services/             # API services
└── types/                # TypeScript type definitions
```

## Usage

1. **Create a Trip**: Click "New Trip" and enter a trip name
2. **Add Destinations**: Add cities with start and end dates
3. **Check Weather**: View 7-day forecasts for each destination
4. **Explore Attractions**: Browse curated attractions and mark them as planned/visited
5. **Find Restaurants**: Discover local cuisine with filtering options
6. **Plan Your Itinerary**: Use the dashboard to get an overview of your trip

## Features in Detail

### Weather Integration
- Real-time weather data from OpenWeatherMap API
- 7-day forecast with temperature, conditions, and precipitation
- Fallback to mock data when API key is not available
- Weather icons and color-coded conditions

### Attractions System
- Curated attractions for major cities (Paris, London, Tokyo, New York)
- Detailed information including hours, costs, and directions
- Mark attractions as planned or completed
- Filter by destination

### Restaurant Recommendations
- Local cuisine recommendations with ratings
- Price range indicators ($ to $$$$)
- Must-try dishes and contact information
- Filter by cuisine type, price range, and ratings
- Bookmark favorite restaurants

### Responsive Design
- Mobile-first approach
- Optimized for all screen sizes
- Touch-friendly interface
- Fast loading and smooth animations

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

Built with ❤️ using Next.js, TypeScript, and Tailwind CSS
