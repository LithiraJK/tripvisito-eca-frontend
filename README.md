# Tripvisito - Web Frontend Application

## Mandatory Student & GCP Information
- **Student Name:** Lithira Jayanaka
- **Student Number:** 241722002
- **GCP Project ID:** project-a4f7bad0-3923-4cdb-b9b

---

## Project Description
This is the client-side web application for **Tripvisito**, a cloud-native, AI-powered travel planning platform. It allows users to register, log in, generate custom travel itineraries using Gemini AI, edit trips, upload trip cover images, make secure test payments via Stripe, and write reviews for their trips.

The frontend is built as a single-page application (SPA) and is designed to consume microservices APIs routed through the API Gateway.

## Technology Stack
- **Library:** React (v18+)
- **Build Tool:** Vite
- **Styling:** Tailwind CSS & Lucide React Icons
- **OAuth:** Google Identity Services (Google login integration)
- **HTTP Client:** Axios (for consuming backend APIs)

## Setup / Getting Started Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager

### Installation
1. Clone the repository:
   ```bash
   git clone git@github.com:LithiraJK/tripvisito-eca-frontend.git
   cd tripvisito-eca-frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables. Create a `.env` file in the root directory:
   ```env
   VITE_API_BASE_URL=http://<YOUR_API_GATEWAY_IP_OR_DOMAIN>:8080/api/v1
   VITE_GOOGLE_CLIENT_ID=your-google-oauth-client-id
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
   The application will be accessible at `http://localhost:5173`.

### Production Build & GCP Deployment (PaaS/Serverless)
To build the application for deployment:
```bash
npm run build
```
The output files will be generated in the `/dist` directory, which can be deployed to static hosting platforms such as Firebase Hosting, GCP App Engine, or Google Cloud Storage bucket (PaaS/Serverless model).
