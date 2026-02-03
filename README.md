# IntelliSchedule AI 🤖

An intelligent scheduling assistant powered by AI that helps you manage meetings, check availability, and send automatic email confirmations. Built with FastMCP, Cal.com integration, and multi-user authentication.

![IntelliSchedule AI](https://img.shields.io/badge/AI-Powered-blue) ![Cal.com](https://img.shields.io/badge/Cal.com-Integrated-green) ![MongoDB](https://img.shields.io/badge/MongoDB-Database-brightgreen)

---

## ✨ Features

### 🤖 **Conversational AI**
- Natural language understanding
- Casual conversation support (greetings, thanks, help)
- Smart context detection
- Friendly personality with emojis

### 📅 **Meeting Scheduling**
- Schedule meetings with Cal.com
- Automatic date/time parsing
- Past-time detection (auto-schedules for tomorrow)
- Custom meeting titles
- Direct Cal.com booking links

### 🕐 **Availability Checking**
- View free time slots for the next 7 days
- Respects Cal.com working hours
- Shows busy/available times
- Timezone-aware

### 🔔 **Smart Reminders**
- Set reminders before meetings
- Flexible time formats (5m, 10 minutes, etc.)
- Automatic reminder integration

### 📧 **Email Confirmations**
- Automatic email notifications
- Professional HTML formatting
- Meeting details + booking links
- Sent from your Gmail account

### 👥 **Multi-User Authentication**
- JWT-based authentication
- Each user has their own Cal.com account
- Secure credential storage in MongoDB
- Personal settings management

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)
- Cal.com account
- Gmail account (for email notifications)

### Installation

1. **Clone the repository:**
```bash
git clone <your-repo-url>
cd MCP
```

2. **Install backend dependencies:**
```bash
cd backend
npm install
```

3. **Install frontend dependencies:**
```bash
cd ../frontend
npm install
```

4. **Setup environment variables:**

Create `backend/.env`:
```env
# Cal.com (Admin/Default - Optional)
CAL_API_KEY=cal_live_your_key_here
CAL_USERNAME=your-username
CAL_EVENT_SLUG=meet
CAL_EVENT_TYPE_ID=1234567
TIMEZONE=Asia/Kolkata

# Email Settings (Admin/Default - Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your@gmail.com
SMTP_PASS=your_app_password
USER_EMAIL=your@gmail.com

# Database
MONGO_URI=mongodb://localhost:27017/intellischedule

# Security
JWT_SECRET=your-secret-key-here
```

5. **Start MongoDB:**
```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas and update MONGO_URI
```

6. **Start the backend:**
```bash
cd backend
npm run dev
```

7. **Start the frontend:**
```bash
cd frontend
npm start
```

8. **Open your browser:**
```
http://localhost:3000
```

---

## 📖 Usage Guide

### 1. **Create an Account**
- Go to `http://localhost:3000/register`
- Enter your email and password
- Click "Sign Up"

### 2. **Configure Your Settings**
- After registration, you'll be redirected to Settings
- Add your Cal.com credentials:
  - **API Key:** Get from [cal.com/settings/developer](https://cal.com/settings/developer)
  - **Event Type ID:** Find in your Cal.com event URL
  - **Username:** Your Cal.com username
- Add your Gmail credentials:
  - **Gmail Address:** Your Gmail email
  - **App Password:** Get from [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
- Click "Save Settings"

### 3. **Start Scheduling!**
Go to the Chat page and try:

```
"Hi"
"When am I free this week?"
"Schedule a meeting tomorrow at 3pm"
"Thank you!"
```

See [PROMPTS.md](./PROMPTS.md) for more examples.

---

## 🎯 Example Conversations

### Casual Chat
```
User: "Hello!"
AI: "Hi there! Ready to organize your calendar?"

User: "How are you?"
AI: "Fantastic! What can I help you schedule?"
```

### Scheduling
```
User: "Schedule a meeting tomorrow at 3pm and remind me 10m before"
AI: "✅ Meeting scheduled for 2026-02-04 at 15:00.
     🔗 Link: https://cal.com/booking/xyz123
     📨 Confirmation email sent to you@email.com
     🔔 Reminder set for 10 minutes before."
```

### Availability
```
User: "When am I free this week?"
AI: "📅 Available time slots:

     Monday, Feb 3: 09:00, 10:00, 11:00, 14:00, 15:00
     Tuesday, Feb 4: 09:00, 10:00, 13:00, 14:00, 16:00
     Wednesday, Feb 5: 10:00, 11:00, 15:00, 16:00, 17:00"
```

---

## 🛠️ Tech Stack

### Backend
- **Node.js** + **Express** - Server framework
- **MongoDB** + **Mongoose** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **nodemailer** - Email sending
- **axios** - HTTP requests
- **TinyLlama** - Local LLM for intent detection

### Frontend
- **React** - UI framework
- **React Router** - Navigation
- **Framer Motion** - Animations
- **Lucide React** - Icons
- **Axios** - API calls

### Integrations
- **Cal.com API** - Meeting scheduling
- **Gmail SMTP** - Email notifications

---

## 📁 Project Structure

```
MCP/
├── backend/
│   ├── agent/
│   │   └── aiAgent.js          # AI conversation logic
│   ├── middleware/
│   │   └── auth.js             # JWT authentication
│   ├── models/
│   │   └── User.js             # User schema
│   ├── mcp/
│   │   └── toolExecutor.js     # Tool execution router
│   ├── routes/
│   │   ├── auth.route.js       # Auth endpoints
│   │   ├── chat.route.js       # Chat endpoint
│   │   └── settings.route.js   # Settings endpoints
│   ├── tools/
│   │   ├── availability.tool.js # Check Cal.com availability
│   │   ├── calendar.tool.js     # Schedule meetings
│   │   ├── email.tool.js        # Send emails
│   │   └── reminder.tool.js     # Set reminders
│   ├── utils/
│   │   └── llm.js              # TinyLlama integration
│   ├── .env                    # Environment variables
│   ├── index.js                # Server entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Chat.js         # Main chat interface
│   │   │   ├── Login.js        # Login page
│   │   │   ├── Register.js     # Registration page
│   │   │   └── Settings.js     # User settings
│   │   ├── App.css             # Styles
│   │   ├── AppRouter.js        # Route configuration
│   │   └── index.js            # Entry point
│   └── package.json
│
├── PROMPTS.md                  # Example prompts guide
└── README.md                   # This file
```

---

## 🔧 Configuration

### Cal.com Setup

1. **Get API Key:**
   - Go to [cal.com/settings/developer](https://cal.com/settings/developer)
   - Create a new API key
   - Copy the key (starts with `cal_live_`)

2. **Get Event Type ID:**
   - Go to your Cal.com event types
   - Click on an event (e.g., "30 Minute Meeting")
   - Look at the URL: `app.cal.com/event-types/1234567`
   - `1234567` is your Event Type ID

3. **Set Working Hours:**
   - Go to [cal.com/availability](https://cal.com/availability)
   - Set your working hours
   - This determines when meetings can be scheduled

### Gmail Setup

1. **Enable 2-Step Verification:**
   - Go to [myaccount.google.com/security](https://myaccount.google.com/security)
   - Enable 2-Step Verification

2. **Create App Password:**
   - Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
   - Select "Mail" and generate
   - Copy the 16-character password
   - Use this in your settings (format: `xxxx xxxx xxxx xxxx`)

---

## 🎨 Features in Detail

### Conversational AI
The AI can detect and respond to:
- Greetings: "Hi", "Hello", "Hey"
- Thanks: "Thank you", "Thanks"
- Goodbyes: "Bye", "See you"
- Help requests: "Help", "What can you do?"
- How are you: "How are you?"

### Smart Scheduling
- **Auto-date detection:** "tomorrow", "next Monday", "Feb 5th"
- **Time parsing:** "3pm", "14:00", "2:30pm"
- **Past-time prevention:** Automatically schedules for tomorrow if time has passed
- **Timezone handling:** Respects your Cal.com timezone

### Multi-User System
- Each user has their own account
- Personal Cal.com credentials
- Isolated meeting data
- Secure password storage

---

## 🐛 Troubleshooting

### "No available users found" Error
- Check your Cal.com working hours
- Ensure the time is in the future
- Verify your Event Type ID is correct
- Try scheduling during business hours

### Email Not Sending
- Verify Gmail App Password is correct
- Check SMTP settings in `.env`
- Ensure 2-Step Verification is enabled

### MongoDB Connection Error
- Make sure MongoDB is running (`mongod`)
- Check `MONGO_URI` in `.env`
- Try using MongoDB Atlas for cloud database

### Authentication Issues
- Clear browser localStorage
- Check `JWT_SECRET` in `.env`
- Re-login to get a new token

---

## 📚 API Documentation

### Authentication Endpoints

**POST** `/auth/register`
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**POST** `/auth/login`
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Settings Endpoints

**GET** `/settings`
- Headers: `Authorization: Bearer <token>`
- Returns user settings

**PUT** `/settings`
```json
{
  "calApiKey": "cal_live_...",
  "calEventTypeId": "1234567",
  "calUsername": "username",
  "smtpUser": "user@gmail.com",
  "smtpPass": "app_password"
}
```

### Chat Endpoint

**POST** `/chat`
```json
{
  "message": "Schedule a meeting tomorrow at 3pm"
}
```
- Headers: `Authorization: Bearer <token>`

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- [Cal.com](https://cal.com) - Meeting scheduling platform
- [FastMCP](https://github.com/jlowin/fastmcp) - MCP server framework
- [TinyLlama](https://huggingface.co/TinyLlama) - Local LLM

---

## 📞 Support

For issues and questions:
- Check [PROMPTS.md](./PROMPTS.md) for usage examples
- Review the troubleshooting section above
- Open an issue on GitHub

---

**Built with ❤️ using AI and modern web technologies**
