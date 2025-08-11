## Getting Started

Node >= v18

1. Add `.env` file to root folder (sample file `.env.example`)
2. Install dependencies — `npm install`
3. docker postgre = ` docker compose -f docker-compose.postgres.yml up -d`
4. Reset database (optional) — `npm run reset-db`
5. Seed database — `npx prisma db seed`
6. Start dev server — `npm run dev`
