Horizon Scanning & Assessment Platform
Overview
This project is a centralized, AI-powered platform designed to help teams in the financial and property sectors manage the high volume of evolving regulations. It transforms regulatory compliance from a reactive, manual process into a proactive, strategic advantage by automating the aggregation of regulatory updates and leveraging Generative AI for accelerated analysis and insights.

Key Features
Automated Content Ingestion: The system automatically scans a pre-configured list of sources daily to identify new regulatory content. Users can also manually add items via URL.

AI-Powered Assessment: A "Generate AI Assessment" button uses the Gemini API to automatically populate detailed summaries and impact assessments of regulatory changes.

Interactive AI Chat: An "Ask AI" feature opens a chat modal that is context-aware of the selected regulatory update, allowing for interactive querying.

Intuitive Workflow Management: The main dashboard is organized into status-based tabs ("New & Unvalidated," "Validated," "Requires Further Review," "Not Applicable") to easily track the assessment status of each item.

Horizon Scanning with Gantt Chart: A Gantt chart visualizes all items in the horizon scanner, with filtering by event type, impacted business area, and date period.

Comprehensive Search and Filtering: A global search bar and quick filters on each tab allow for efficient searching and filtering of regulatory items.

Collaboration and Reporting: Features a "Share" button to copy a pre-formatted summary of an assessment and the ability to generate consolidated PDF reports from selected items.

Tech Stack
Frontend: React 18, Vite, TypeScript, Tailwind CSS

Backend & Database: Google Firebase (BaaS), Cloud Firestore

Authentication: Firebase Authentication

AI Integration: Google Gemini API (gemini-2.0-flash model)

UI Components: Lucide-React for icons

PDF Generation: jsPDF, html2canvas

Getting Started
Prerequisites
Node.js (version >=18.0.0)

npm or yarn

Installation & Setup
Clone the repository:

Bash

git clone https://github.com/arsenal86/fcp_prototype.git
cd fcp_prototype/app
Install dependencies:

Bash

npm install
Set up environment variables:
Create a .env.local file in the app directory and add your Firebase project configuration:

VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
Run the development server:

Bash

npm run dev
Project Structure
The application is a Single Page Application (SPA) built with a modern, component-based architecture.

app/: Contains the main application source code.

src/: The main source directory.

App.tsx: The main application component.

firebase.ts: Firebase configuration and initialization.

types.ts: TypeScript type definitions.

public/: Static assets.

PRD.txt: Product Requirements Document.

TRD.txt: Technical Requirements Document.

Deployment
The application is a static React build and can be deployed to any modern static hosting provider such as Firebase Hosting, Vercel, or Netlify.

Scalability Notes
The current client-side implementation for search and filtering will become a performance bottleneck as the number of documents increases. For production, it is recommended to migrate to a dedicated search service like Algolia or Elasticsearch. This would involve creating a search index from the updates collection in Firestore and using a Cloud Function to keep the index synchronized.
