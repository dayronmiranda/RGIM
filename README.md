# RGIM Store Hybrid

A modern e-commerce platform for RGIM USA & Panama, specializing in international product shipping to Latin America and the Caribbean.

## 🌟 Features

- **Modern UI/UX** - Built with Tailwind CSS UI blocks for professional appearance
- **AI-Powered Search** - Intelligent product search functionality
- **Multi-language Support** - Spanish interface optimized for Latin American customers
- **Dual Shipping Options** - Maritime (free) and Air (+10%) shipping methods
- **Admin Dashboard** - Comprehensive order management system
- **WhatsApp Integration** - Direct customer communication
- **Responsive Design** - Works perfectly on all devices

## 🚀 Quick Start

### Prerequisites
- Node.js 14+ installed
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/rgim/store-hybrid.git
   cd store-hybrid
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start the server**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

5. **Access the application**
   - Local: http://localhost:3000
   - Production: http://www.rgimusa.com

## 📁 Project Structure

```
StoreHybrid/
├── assets/           # Static assets (images, data)
├── pages/           # Page components
│   ├── home.js      # Homepage with hero and features
│   ├── store.js     # Product catalog with AI search
│   ├── about.js     # Company information
│   ├── faq.js       # Frequently asked questions
│   └── admin.js     # Admin dashboard
├── utils/           # Utility functions
├── server.js        # Express server
├── index.html       # Main HTML file
├── index.js         # Client-side router
└── package.json     # Dependencies and scripts
```

## 🛍️ Pages Overview

### **Home Page**
- Modern hero section with gradient backgrounds
- Company features and benefits
- Statistics showcase
- Call-to-action buttons

### **Store Page**
- AI-powered product search
- Professional product grid
- Shopping cart sidebar with trust elements
- Real-time inventory management

### **About Page**
- Company timeline with visual milestones
- Office locations (USA & Panama)
- Mission and values presentation
- Professional statistics display

### **FAQ Page**
- Interactive accordion interface
- Rich content formatting
- Visual icons and illustrations
- Comprehensive shipping and payment info

### **Admin Dashboard**
- Secure login system
- Order management interface
- Sales statistics and analytics
- CSV export functionality

## 🔧 API Endpoints

- `POST /api/orders` - Submit new customer orders
- `GET /api/orders` - Retrieve orders (admin only)
- `GET /api/health` - Server health check

## 🌐 Deployment

### Production Deployment

1. **Set environment variables**
   ```bash
   export PORT=3000
   export NODE_ENV=production
   export DOMAIN=http://www.rgimusa.com
   ```

2. **Start the server**
   ```bash
   npm start
   ```

### Docker Deployment (Optional)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 🛡️ Security Features

- CORS enabled for cross-origin requests
- Input validation and sanitization
- Secure admin authentication
- Environment variable configuration
- Graceful error handling

## 📱 Mobile Optimization

- Fully responsive design
- Touch-friendly interfaces
- Optimized loading times
- Mobile-first approach

## 🌍 International Features

- Spanish language interface
- Latin American currency formatting
- Regional shipping calculations
- WhatsApp integration for customer support

## 🔄 Development

### Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with auto-reload
- `npm test` - Run tests (to be implemented)

### Adding New Features

1. Create new page components in `/pages`
2. Add utility functions in `/utils`
3. Update routing in `index.js`
4. Add API endpoints in `server.js`

## 📞 Support

For technical support or business inquiries:

- **Website**: http://www.rgimusa.com
- **WhatsApp**: Contact through the website
- **Email**: Available through contact form

## 📄 License

MIT License - see LICENSE file for details

## 🏢 Company Information

**RGIM USA & Panama** - Connecting international products with Latin American customers through reliable logistics and exceptional service.

- **USA Office**: RG IM USA MULTISERVICES LLC, Miami, FL
- **Panama Office**: RG IM PANAMA MULTISERVICES SA, Panama City, Panama