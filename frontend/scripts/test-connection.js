#!/usr/bin/env node

const axios = require('axios');

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

async function testConnection() {
  console.log('🔍 Testing AniStand Backend Connection...\n');
  
  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get(`${BACKEND_URL}/health`);
    console.log('✅ Health check:', healthResponse.data);
    
    // Test API endpoints
    console.log('\n2. Testing API endpoints...');
    
    // Test anime list
    try {
      const animeResponse = await axios.get(`${BACKEND_URL}/api/v1/anime/`);
      console.log('✅ Anime API:', `Found ${animeResponse.data.items?.length || 0} anime`);
    } catch (error) {
      console.log('⚠️  Anime API:', error.response?.status || 'Connection failed');
    }
    
    // Test genres
    try {
      const genresResponse = await axios.get(`${BACKEND_URL}/api/v1/anime/genres`);
      console.log('✅ Genres API:', `Found ${genresResponse.data?.length || 0} genres`);
    } catch (error) {
      console.log('⚠️  Genres API:', error.response?.status || 'Connection failed');
    }
    
    console.log('\n🎉 Backend connection test completed!');
    console.log(`📡 Backend URL: ${BACKEND_URL}`);
    console.log('🚀 You can now run: npm run dev');
    
  } catch (error) {
    console.error('\n❌ Backend connection failed!');
    console.error('Error:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure backend is running on port 8000');
    console.log('2. Check NEXT_PUBLIC_API_URL in .env.local');
    console.log('3. Run: cd ../backend && ./scripts/start_dev.sh');
    process.exit(1);
  }
}

testConnection();
