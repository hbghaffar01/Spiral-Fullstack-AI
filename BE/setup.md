# Environment Setup

## Backend (BE)

1. Create a `.env` file in the BE folder:
```bash
cd BE
cp env.example .env
```

2. Edit `.env` with your values:
```env
# Backend server port
PORT=4000

# ChromaDB URL (for vector search)
CHROMA_URL=http://localhost:8000

# Optional: OpenAI API key for better embeddings
OPENAI_API_KEY=

# CORS allowed origins
CLIENT_URL=http://localhost:3000
```

## Frontend (FE/my-app)

1. Create a `.env.local` file in the FE/my-app folder:
```bash
cd FE/my-app
cp env.example .env.local
```

2. Edit `.env.local` with your values:
```env
# Backend API URL
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Running the Application

### Backend
```bash
cd BE
npm install
npm run dev
```

### Frontend
```bash
cd FE/my-app
npm install
npm run dev
```

### With Docker (includes ChromaDB)
```bash
cd BE
npm run docker:up
```
