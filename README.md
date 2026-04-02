# InfraAI

InfraAI is a modern AI-powered chat application that enables users to have intelligent conversations with AI models. It combines real-time messaging with internet search capabilities, allowing the AI to provide up-to-date responses based on the latest information from the web.

🚀 **Live Demo:** [https://infra-ai-psi.vercel.app](https://infra-ai-psi.vercel.app)

---

## Features

✨ **Core Features:**
- **AI Chat Interface** - Real-time chat with streaming responses
- **User Authentication** - Secure registration, login, and email verification
- **Multiple AI Models** - Integration with Google Gemini and Mistral AI
- **Internet Search** - AI can search the web to provide current information
- **Save Prompts** - Users can save and reuse their favorite prompts
- **Chat History** - All conversations are saved and can be accessed later
- **Real-time Updates** - Socket.io enables live messaging features
- **Password Recovery** - Secure password reset via email

---

## Tech Stack

### Frontend
- **Framework:** React with Redux state management
- **Build Tool:** Vite
- **Styling:** SCSS
- **HTTP Client:** Axios
- **Real-time:** Socket.io Client
- **UI Icons:** Remix Icon
- **Validation:** Zod schema validation

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB
- **Real-time:** Socket.io
- **Authentication:** JWT (JSON Web Tokens)
- **Email:** Nodemailer with Gmail OAuth2
- **Token Blacklisting:** Redis

### AI & Services
- **AI Models:** 
  - Google Generative AI (Gemini)
  - Mistral AI
- **AI Framework:** LangChain
- **Web Search:** Tavily API

---

## Project Structure

\`\`\`
InfraAI/
├── Backend/                    # Node.js Express server
│   ├── src/
│   │   ├── controllers/        # API logic handlers
│   │   ├── models/             # MongoDB schemas
│   │   ├── routes/             # API endpoints
│   │   ├── services/           # External services (AI, email, search)
│   │   ├── middleware/         # Authentication & error handling
│   │   ├── validators/         # Input validation
│   │   ├── config/             # Database & cache setup
│   │   ├── sockets/            # Real-time socket handlers
│   │   └── utils/              # Helper functions
│   ├── server.js               # Main server file
│   └── package.json
│
├── Frontend/                   # React + Vite application
│   ├── src/
│   │   ├── app/                # App setup & routing
│   │   ├── features/
│   │   │   ├── auth/           # Authentication module
│   │   │   ├── chat/           # Chat module
│   │   │   └── shared/         # Shared components
│   │   └── main.jsx
│   ├── vite.config.js
│   └── package.json
│
└── README.md
\`\`\`

---

## How It Works

### User Journey

1. **Sign Up**
   - User creates an account with username, email, and password
   - Account is activated automatically in production

2. **Login**
   - User logs in with email and password
   - JWT token is stored in cookies for authentication

3. **Chat**
   - User writes a message and sends it
   - Message is saved to database
   - Backend processes the message using AI model + internet search (if needed)
   - Response is streamed back to frontend with typewriter effect
   - Chat history is maintained and can be accessed later

4. **Save Prompts**
   - Users can save useful prompts for later reuse
   - Saved prompts appear in the "Personal Vault" section

---

## Key Technologies Explained

### Real-time Streaming
The backend uses **Server-Sent Events (SSE)** to stream AI responses. This allows the frontend to display each word as it arrives, creating a smooth typewriter effect.

### Authentication Security
- Passwords are hashed before storage
- JWT tokens are used for stateless authentication
- Logout tokens are blacklisted in Redis to prevent reuse
- Email verification ensures valid user accounts

### AI Integration
LangChain framework is used to connect with multiple AI models and tools. The AI can:
- Generate responses based on conversation history
- Search the internet for current information
- Generate titles for new chats automatically

---

## Architecture & Code Quality

### 4-Layer React Architecture for Scalability

The frontend is built using a **4-layer architecture** to ensure scalability, maintainability, and feature-based development:

#### **Layer 1: Presentation Layer (Components)**
- Pure, reusable UI components
- Handles only UI rendering and user interactions
- No business logic or API calls

#### **Layer 2: Container/Smart Layer (Pages & Hooks)**
- Page components that orchestrate data flow
- Custom React hooks that manage component logic
- Connects Redux state to UI components

#### **Layer 3: State Management Layer (Redux)**
- Redux slices for centralized state management
- Global state for authentication, chat, and saved prompts
- Predictable state updates through actions and reducers

#### **Layer 4: Services & Business Logic Layer**
- API services for backend communication
- Real-time socket services
- Input validators and schemas
- Separates data fetching from UI logic

---

## ⚠️ Known Limitations

- Email verification is disabled in production due to SMTP ports being blocked on Render's free hosting plan. Users are automatically verified upon registration.
- In local development, email verification works normally via Nodemailer.

---

## Future Improvements

- [ ] Custom domain setup for email verification
- [ ] User profile customization
- [ ] Chat export (PDF, TXT)
- [ ] Conversation sharing with others
- [ ] Different chat themes
- [ ] Mobile app version
- [ ] Advanced search filters
- [ ] User analytics dashboard
- [ ] Integration with more AI models