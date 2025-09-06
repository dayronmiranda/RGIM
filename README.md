# RGIM Website

RGIM USA & Panamá - E-commerce website with shipping services from Panama to Latin America and the Caribbean.

## Features

- 🛒 Shopping cart functionality
- 🌐 Bilingual support (Spanish/English)
- 📱 Responsive design with mobile optimization
- 🚢 Maritime and air shipping options
- 📋 Admin panel for order management
- 💬 WhatsApp integration for customer contact

## Prerequisites

- Node.js (version 14 or higher)
- npm (comes with Node.js)

## Installation

1. Navigate to the project directory:
   ```bash
   cd RGIM.com
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Server

### Development Mode
```bash
npm run dev
```
This will start the server with nodemon for automatic restarts on file changes.

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:3000` by default.

## Environment Variables

You can set the following environment variables:

- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment mode (development/production)

Example:
```bash
PORT=8080 npm start
```

## Project Structure

```
RGIM.com/
├── assets/
│   ├── app.js          # Main JavaScript application
│   └── mobile.css      # Mobile-specific styles
├── index.html          # Main HTML file
├── products.json       # Product catalog
├── categories.json     # Product categories
├── translations.json   # Language translations
├── server.js          # Express server
├── package.json       # Node.js dependencies
└── README.md          # This file
```

## API Endpoints

- `GET /api/products` - Get all products
- `GET /api/categories` - Get all categories
- `GET /api/translations` - Get translations

## Technologies Used

- **Backend**: Node.js, Express.js
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Styling**: Tailwind CSS
- **Security**: Helmet.js, CORS
- **Performance**: Compression middleware

## Admin Access

The admin panel is available at `/#/admin` with the following default credentials:
- Username: admin
- Password: rgim2024

## Deployment

For production deployment:

1. Set environment variables
2. Install dependencies: `npm install --production`
3. Start the server: `npm start`

## Support

For support or questions, contact RGIM through the website's contact form or WhatsApp integration.

---

© 2024 RGIM - RG IM USA & PANAMA MULTISERVICES