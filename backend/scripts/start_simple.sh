#!/bin/bash

# Simple startup script using system packages
echo "🎌 Starting AniStand Backend (Simple Mode)..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from example..."
    cp .env.example .env
    echo "✅ Please edit .env file with your settings"
fi

# Create minimal .env if it doesn't exist
if [ ! -f .env ]; then
    cat > .env << EOF
DEBUG=True
DATABASE_URL=sqlite:///./anistand.db
REDIS_URL=redis://localhost:6379/0
JWT_SECRET_KEY=your-secret-key-change-in-production
ALLOWED_ORIGINS=["http://localhost:3000"]
EOF
    echo "✅ Created basic .env file"
fi

echo "🚀 Starting FastAPI development server..."
echo "📖 API Documentation will be available at:"
echo "   - Swagger UI: http://localhost:8000/docs"
echo "   - ReDoc: http://localhost:8000/redoc"
echo "   - Health Check: http://localhost:8000/health"
echo ""
echo "🛑 Press Ctrl+C to stop the server"
echo ""

# Start the server using system Python with simple main
python3 -m uvicorn app.main_simple:app --host 0.0.0.0 --port 8000 --reload
