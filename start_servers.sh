#!/bin/bash
# PitchGuard Lite - Start both frontend and backend servers

echo "🚀 Starting PitchGuard Lite servers..."

# Check if Python is available
if ! command -v python &> /dev/null; then
    echo "❌ Python is not installed or not in PATH"
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "README.md" ] || [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo "❌ Please run this script from the PitchGuard root directory"
    exit 1
fi

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
python -m pip install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "❌ Failed to install backend dependencies"
    exit 1
fi

# Start backend server in background
echo "🔧 Starting backend server on port 8000..."
python app.py &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 3

# Start frontend server
echo "🌐 Starting frontend server on port 3000..."
cd frontend
python -m http.server 3000 &
FRONTEND_PID=$!
cd ..

# Wait a moment for servers to start
sleep 2

echo ""
echo "✅ PitchGuard Lite is now running!"
echo ""
echo "🔗 Frontend: http://localhost:3000"
echo "🔗 Backend API: http://localhost:8000"
echo "🔗 API Health: http://localhost:8000/health"
echo ""
echo "📝 To stop the servers, press Ctrl+C or run:"
echo "   kill $BACKEND_PID $FRONTEND_PID"
echo ""
echo "💡 Tip: Set OPENROUTER_API_KEY environment variable for real AI scoring"
echo "   export OPENROUTER_API_KEY=your_key_here"
echo ""

# Keep script running and handle Ctrl+C
trap "echo ''; echo '🛑 Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0" INT

echo "Press Ctrl+C to stop both servers..."
wait
