#!/bin/bash

# Advanced startup script with parsers and real API
echo "🚀 Starting AniStand Backend (Advanced Mode)..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from example..."
    cat > .env << EOF
DEBUG=True
DATABASE_URL=sqlite:///./anistand.db
REDIS_URL=redis://localhost:6379/0
JWT_SECRET_KEY=your-secret-key-change-in-production
ALLOWED_ORIGINS=["http://localhost:3000","http://localhost:3001"]
EOF
    echo "✅ Created basic .env file"
fi

echo "🔧 Installing additional dependencies..."
pip3 install --user aiohttp beautifulsoup4 lxml

echo "🌐 Testing AniList API connection..."
python3 -c "
import asyncio
import aiohttp

async def test_anilist():
    query = '''
    {
        Media(id: 16498, type: ANIME) {
            title {
                romaji
                english
            }
        }
    }
    '''
    async with aiohttp.ClientSession() as session:
        async with session.post('https://graphql.anilist.co', json={'query': query}) as resp:
            if resp.status == 200:
                data = await resp.json()
                print('✅ AniList API connection successful')
                print(f'   Test anime: {data[\"data\"][\"Media\"][\"title\"][\"romaji\"]}')
            else:
                print('❌ AniList API connection failed')

asyncio.run(test_anilist())
"

echo ""
echo "🚀 Starting FastAPI Advanced server..."
echo "📖 API Documentation will be available at:"
echo "   - Swagger UI: http://localhost:8000/docs"
echo "   - ReDoc: http://localhost:8000/redoc"
echo "   - Health Check: http://localhost:8000/health"
echo ""
echo "🎌 Features enabled:"
echo "   - AniList integration ✅"
echo "   - Real anime search ✅"
echo "   - Advanced API endpoints ✅"
echo ""
echo "🛑 Press Ctrl+C to stop the server"
echo ""

# Start the server using advanced main
python3 -m uvicorn app.main_advanced:app --host 0.0.0.0 --port 8000 --reload
