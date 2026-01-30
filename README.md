# Todo App

Simple MERN stack todo app with boards.

## Usage

1. **Back-end**
   Open a terminal in the `server` folder.
   ```bash
   npm install
   node index.js
   ```
   (Make sure MongoDB is running)

2. **Front-end**
   Open another terminal in `client`.
   ```bash
   npm install
   npm run dev
   ```

Go to `http://localhost:5173`.

## Project Structure

```bash
todo-web-app/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # AuthForm, Dashboard, BoardDetails
│   │   ├── api.js          # Axios config
│   │   └── App.jsx         # Routes
├── server/                 # Node Backend
│   ├── controllers/        # Logic (Auth, Board, Todo)
│   ├── models/             # DB Schemas
│   ├── routes/             # API Endpoints
│   ├── middleware/         # Auth Check
│   └── index.js            # Entry Point
└── README.md
```

## API

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/boards`
- `GET /api/boards/:id`
- `GET /api/boards/:id/todos`

Uses JWT for auth. Token is stored in localStorage.
