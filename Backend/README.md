Backend for Milestone 1

Simple Node.js + Express server with endpoints:
- POST /register { email, password } -> { token }
- POST /login { email, password } -> { token }
- GET /transactions (auth) -> list
- POST /transactions (auth) -> create

Data is stored in JSON files under `data/` inside backend.

Run:
1. cd backend
2. npm install
3. npm run dev
