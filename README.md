# HabitLQ 🧠⚡

> **HabitLQ** is a full-stack gamified habit tracking application that combines daily habit management with RPG-style progression, AI coaching, social features, and deep analytics — all powered by a production-grade Node.js/Express REST API.

---

## 🚀 Features

### 🔐 Authentication System
- JWT-based stateless authentication with secure token generation
- Password hashing with **bcrypt**
- Register, Login, Logout, and protected route middleware
- Role-based payload in JWT (`id`, `role`) for future admin support

### ✅ Habit CRUD
- Create habits with `name`, `category`, `reminderTime`, and `repeatDays`
- Full CRUD: get all habits, get single habit, update, delete
- Cascade delete — removing a habit also deletes all its associated logs
- Ownership enforcement: users can only access/modify their own habits

### 🔥 Streak Logic
- Auto-tracks `currentStreak`, `longestStreak`, and `totalCompletions`
- Validates habit completion against scheduled `repeatDays` (Mon–Sun)
- Time-window enforcement: habits can only be completed after their `reminderTime`
- Duplicate completion guard: prevents marking the same habit twice in a day
- `missHabit` endpoint resets streak to `0`
- `autoMiss` middleware runs automatically on every habit request

### 🎮 XP Engine
- Awards **+10 XP** on every habit completion via `addXP()` service
- Streak bonuses via `checkStreakBonus()` — bonus XP at milestone streaks
- XP and level data stored on the user model, surfaced on the leaderboard

### 🏅 Badge System
- Badges awarded automatically via `checkBadges()` on every completion
- `getAllBadges` returns all badges with an `unlocked: true/false` flag per user
- Badges stored in a dedicated `badgeModel` and referenced via populate on the user document

### 📣 Social Feed
- Users can create posts with `content` and `type`
- Paginated feed with `page` & `limit` query params
- Toggle **likes** (like/unlike in a single endpoint)
- Nested **comments** with author population (`name`)
- Post ownership enforced on delete (403 if not owner)
- Admin `verifyPost` endpoint for content moderation

### 📊 Analytics (MongoDB Aggregation Pipelines)
- **Weekly Stats** — completions grouped by day-of-week for the last 7 days (`$dayOfWeek`)
- **Monthly Stats** — completions grouped by calendar date for the last 30 days (`$dateToString`)
- **Heatmap** — all-time daily completion counts formatted as `YYYY-MM-DD` for frontend rendering
- All pipelines use `$match`, `$group`, `$sort` stages with proper `ObjectId` casting

### 🤖 AI Coach
- Integrated with **OpenAI API** via the `openai` npm package
- `askCoach()` service injects the user's real habit list and logs as context
- Personalized coaching based on actual user data, not generic responses
- `POST /api/ai/ask` with a `message` body

### 📜 AI Chat History
- Every AI conversation is persisted to `aichatModel`
- `GET /api/ai/history` returns the last 20 messages sorted newest-first
- Fully protected by JWT auth middleware

### 🏆 Leaderboard
- Top 10 users ranked by `level` then `xp` (descending)
- Returns only `name`, `level`, `xp` — no sensitive data exposed
- Profile stats endpoint with full badge population

### 🛡️ Clean Error Handling
- Global `AppError` class for operational errors with `statusCode` and `message`
- `catchAsync` wrapper eliminates repetitive try/catch across all controllers
- Consistent JSON error shape: `{ status, message }`
- 400 bad input · 401 unauthorized · 403 forbidden · 404 not found

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js (ESM modules) |
| Framework | Express.js v5 |
| Database | MongoDB + Mongoose v9 |
| Auth | JWT (`jsonwebtoken`) + `bcrypt` |
| AI | OpenAI API (`openai` v6) |
| Middleware | `cors`, `cookie-parser`, `dotenv` |
| Dev Tools | `nodemon` |

---

## 📁 Project Structure

```
server/
└── src/
    ├── app.js                          # Entry point, middleware setup
    ├── controllers/
    │   ├── user.controller.js          # Register, Login, Logout, Profile
    │   ├── habit.controller.js         # Full habit CRUD + complete/miss/logs
    │   ├── analytics.controller.js     # Weekly, Monthly, Heatmap aggregations
    │   ├── gamification.controller.js  # XP, Badges, Leaderboard
    │   ├── post.controller.js          # Social feed CRUD + likes/comments
    │   └── ai.controller.js            # AI Coach + Chat History
    ├── routes/
    │   ├── user.routes.js
    │   ├── habit.routes.js
    │   ├── analysis.routes.js
    │   ├── gamification.routes.js
    │   ├── post.routes.js
    │   └── ai.routes.js
    ├── model/
    │   ├── user.model.js               # name, email, password, xp, level, badges, streak
    │   ├── habit.model.js              # name, category, repeatDays, reminderTime, streaks
    │   ├── habitLog.model.js           # habitId, userId, date, status
    │   ├── badge.model.js              # badge definitions
    │   ├── post.model.js               # content, likes[], comments[], isVerified
    │   └── aichat.model.js             # userId, message, reply, createdAt
    ├── middleware/
    │   ├── auth.middleware.js          # JWT verification (Protected)
    │   └── autoMiss.middleware.js      # Auto-resets missed habits on each request
    ├── service/
    │   ├── gamification.service.js     # addXP, checkBadges, checkStreakBonus
    │   ├── ai.service.js               # askCoach (OpenAI integration)
    │   ├── password.service.js         # HashPassword, ComparePassword
    │   ├── token.service.js            # GenerateToken
    │   └── User.service.js             # createUser
    └── utils/
        ├── AppError.js                 # Custom operational error class
        └── catchAsync.js              # Async error wrapper for controllers
```

---

## 📡 API Reference

### Auth — `/api/users`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/register` | ❌ | Register new user |
| POST | `/login` | ❌ | Login, returns JWT |
| POST | `/logout` | ❌ | Logout |
| GET | `/profile` | ✅ | Get current user (with badges populated) |
| POST | `/update-profile` | ✅ | Update name / email |

### Habits — `/api/habits`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/` | ✅ | Create habit |
| GET | `/` | ✅ | Get all user habits |
| GET | `/:id` | ✅ | Get single habit |
| PATCH | `/:id` | ✅ | Update habit |
| DELETE | `/:id` | ✅ | Delete habit + cascade delete logs |
| POST | `/:habitId/completed` | ✅ | Mark complete → awards XP, streak, badges |
| POST | `/:habitId/miss` | ✅ | Mark missed → resets streak |
| GET | `/:habitId/logs` | ✅ | Get all logs for a habit |

### Analytics — `/api/analytics`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/weekly` | ✅ | Last 7 days grouped by day-of-week |
| GET | `/monthly` | ✅ | Last 30 days grouped by date |
| GET | `/heatmap` | ✅ | All-time daily completion heatmap |

### Gamification — `/api/gamification`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/profile` | ✅ | XP, level, streak, badges (populated) |
| GET | `/badges` | ✅ | All badges with per-user unlocked status |
| GET | `/leaderboard` | ✅ | Top 10 users by level + XP |

### Social Feed — `/api/posts`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/` | ✅ | Create post |
| GET | `/?page=1&limit=10` | ✅ | Paginated feed with user + comment population |
| POST | `/:id/like` | ✅ | Toggle like on/off |
| POST | `/:id/comment` | ✅ | Add comment |
| DELETE | `/:id` | ✅ | Delete own post (ownership enforced) |

### AI Coach — `/api/ai`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/ask` | ✅ | Ask AI coach (receives habit + log context) |
| GET | `/history` | ✅ | Last 20 AI conversations |

---

## ⚙️ Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- OpenAI API key

### Installation

```bash
# Clone the repository
git clone https://github.com/satish-sharma360/HabitLQ.git
cd HabitLQ/server

# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file inside `/server`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_api_key
```

### Run

```bash
# Development (with hot reload)
npm run dev

```

---

## 👨‍💻 Author

**Satish Sharma**  
[GitHub](https://github.com/satish-sharma360)
