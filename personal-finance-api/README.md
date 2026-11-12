# Personal Finance Tracker API

REST API for income, expenses, categories, monthly summaries, profile-picture uploads and admin analytics.

## 1. Requirements
- Node.js 20+
- MongoDB local or MongoDB Atlas
- Cloudinary account for profile image uploads

## 2. Install
```bash
npm install
```
Copy `.env.example` to `.env` and fill in your values. Do not commit `.env`.

```bash
npm run dev
```

API: `http://localhost:3000`  
Swagger: `http://localhost:3000/docs`  
Health: `http://localhost:3000/api/health`

Seed predefined categories in another terminal:
```bash
npm run seed:categories
```

## 3. Authentication
Register: `POST /api/auth/register`
```json
{ "name": "Ayaan", "email": "ayaan@example.com", "password": "securePass123" }
```
Login: `POST /api/auth/login`
```json
{ "email": "ayaan@example.com", "password": "securePass123" }
```
Copy the returned token. In Swagger click **Authorize** and enter the token (without writing `Bearer ` if Swagger adds it automatically; the scheme is HTTP bearer).

Public registration always assigns role `user`. To create an admin locally, use MongoDB Compass or mongosh to update a trusted account:
```js
db.users.updateOne({ email: "ayaan@example.com" }, { $set: { role: "admin" } })
```
Never expose a public endpoint that lets a user assign themselves the admin role.

## 4. Endpoints

| Method | Endpoint | Purpose | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Create account | No |
| POST | `/api/auth/login` | Login | No |
| GET | `/api/auth/profile` | Current profile | Yes |
| PATCH | `/api/auth/profile` | Update name | Yes |
| GET | `/api/categories` | List default + own categories | Yes |
| POST | `/api/categories` | Create own category | Yes |
| GET | `/api/transactions` | List/filter/paginate own transactions | Yes |
| POST | `/api/transactions` | Create transaction | Yes |
| GET | `/api/transactions/summary/monthly` | Monthly summary | Yes |
| GET | `/api/transactions/:id` | Read own transaction | Yes |
| PATCH | `/api/transactions/:id` | Update own transaction | Yes |
| DELETE | `/api/transactions/:id` | Delete own transaction | Yes |
| POST | `/api/upload/profile-picture` | Upload image (`image` field) | Yes |
| GET | `/api/admin/overview` | Platform analytics | Admin |
| GET | `/api/health` | Health check | No |

## 5. Create a transaction
First get category IDs from `GET /api/categories`, then:
```json
{
  "type": "expense",
  "amount": 18.5,
  "category": "PASTE_CATEGORY_OBJECT_ID",
  "description": "Lunch",
  "date": "2026-11-11T10:00:00.000Z"
}
```
The category type must match the transaction type.

## 6. Monthly summary
`GET /api/transactions/summary/monthly?year=2026&month=11`

Returns income, expenses, balance, counts and top spending categories for the authenticated user.

## 7. Profile picture
Send `multipart/form-data` to `/api/upload/profile-picture` with file field name `image`. Allowed: JPG, PNG, WEBP; max 5 MB. Add Cloudinary credentials to `.env`.

## 8. Deploy to Render
1. Push the project to GitHub.
2. Create a Render **Web Service** from the repository.
3. Build command: `npm install`
4. Start command: `npm start`
5. Add environment variables in Render Dashboard: `NODE_ENV=production`, `MONGODB_URI`, `JWT_SECRET` (32+ random characters), `JWT_EXPIRES_IN=7d`, `CLIENT_URL`, and Cloudinary credentials.
6. Set `API_URL` to your deployed base URL, e.g. `https://your-service.onrender.com`.
7. Redeploy and verify `/api/health` and `/docs`.

## Security notes
- Never commit `.env` or share JWT/Cloudinary secrets.
- Every transaction query is scoped to the authenticated user.
- Admin route requires both a valid JWT and `role=admin`.
- For production, use HTTPS and a strong unique JWT secret.
