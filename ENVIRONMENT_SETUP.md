# Environment Variables Setup

Create a `.env.local` file in the root directory with the following variables:

```env
# OpenWeatherMap API Key (Required for weather forecasts)
# Get your free API key at: https://openweathermap.org/api
NEXT_PUBLIC_OPENWEATHER_API_KEY=your_openweather_api_key_here

# Google Places API Key (Optional - for enhanced location data)
# Get your API key at: https://console.cloud.google.com/
NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=your_google_places_api_key_here

# Unsplash API Key (Optional - for destination images)
# Get your access key at: https://unsplash.com/developers
NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=your_unsplash_access_key_here
```

## API Key Setup Instructions

### 1. OpenWeatherMap API (Required)
- Sign up at [OpenWeatherMap](https://openweathermap.org/api)
- Go to your API keys section
- Copy your API key
- Add it to `.env.local` as `NEXT_PUBLIC_OPENWEATHER_API_KEY`

### 2. Google Places API (Optional)
- Go to [Google Cloud Console](https://console.cloud.google.com/)
- Create a new project or select existing one
- Enable Places API
- Create credentials (API Key)
- Copy your API key
- Add it to `.env.local` as `NEXT_PUBLIC_GOOGLE_PLACES_API_KEY`

### 3. Unsplash API (Optional)
- Sign up at [Unsplash Developers](https://unsplash.com/developers)
- Create a new application
- Get your access key
- Add it to `.env.local` as `NEXT_PUBLIC_UNSPLASH_ACCESS_KEY`

## For Vercel Deployment

Add these same environment variables in your Vercel project settings:
1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings > Environment Variables
4. Add each variable with the same names and values
