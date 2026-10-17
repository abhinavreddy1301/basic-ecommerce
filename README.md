# Basic E-commerce Website

A small starter project with separate `frontend` and `backend` folders.

## Requirements
- Node.js 18+
- npm

## 1. Start the backend
```bash
cd backend
npm install
npm run dev
```
API runs at `http://localhost:5000`.

## 2. Start the frontend
Open a second terminal:
```bash
cd frontend
npm install
npm run dev
```
Open the Vite URL shown in the terminal (usually `http://localhost:5173`).

## Included
- Product listing from the Express API
- Add/remove items in a shopping cart
- Cart quantity and subtotal
- Demo checkout confirmation (does not process payments or save orders)
- Responsive styling

The backend uses an in-memory product list for simplicity. Products reset when the server restarts. Add a database such as MongoDB or MySQL for persistence before production use.
