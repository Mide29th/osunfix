# OsunFix 🌍🛠️

> **Resilient Infrastructure & Civic Accountability for Osun State**

OsunFix is a modern, AI-powered civic technology platform designed to crowdsource infrastructure reporting, streamline maintenance dispatching, and foster civic accountability in Osun State. Built for the Osun Civic Hackathon, it bridges the gap between citizens and the government by ensuring every reported fault is tracked, analyzed, and repaired with maximum efficiency and environmental consciousness.

---

## 🌟 Key Features

### 1. 📸 Smart Issue Reporting
Citizens can easily snap a photo, tag their location, and report infrastructure issues (potholes, fallen poles, blocked drainages) in seconds. 
* **AI Analysis:** Powered by **Gemini AI**, every report is automatically analyzed to extract a concise title, assess the urgency (1-10 scale), and determine if it poses an immediate hazard.

### 2. 🗺️ Live Fault Map
An interactive, public-facing map built with Leaflet that provides a real-time visual distribution of infrastructure issues across Osun State.
* **Color-coded Urgency:** Faults are visually categorized by their AI-assigned urgency score.
* **Transparency:** Citizens can see where their tax money is working effectively.

### 3. 🧠 Civic Hub & Imole AI
A dedicated accountability and learning hub for citizens.
* **Imole AI Chat:** A bilingual (English/Yoruba) AI assistant that answers questions about Osun State governance, civic rights, and reporting procedures.
* **Civic Flashcards:** Interactive 3D flip cards to educate citizens on their rights and the government budget.
* **Project Tracker:** Live progress tracking on constituency projects.

### 4. 👷 Artisan Routing & Dispatch (Admin)
A secure Government Dashboard that enables state officials to manage infrastructure repairs efficiently.
* **Smart Dispatch:** Vetted artisans are routed to priority faults based on the AI urgency score.
* **Evidence Tracking:** View the original photo attachment and AI hazard analysis before dispatching a team.

### 5. 🍃 Green Impact Tracker
OsunFix isn't just about fixing roads; it's about sustainability. The platform tracks the **CO2 emissions saved** (in kg) by prioritizing proactive repairs (e.g., clearing drainages to prevent flooding, repairing roads to reduce vehicle wear).

---

## 💻 Tech Stack

* **Frontend Framework:** Next.js 14+ (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS + shadcn/ui
* **Mapping:** Leaflet (`react-leaflet`)
* **Icons:** Lucide React
* **Backend & Database:** Firebase (Firestore)
* **Authentication:** Firebase Auth
* **Storage:** Firebase Cloud Storage (for report images)
* **AI Integration:** Google Gemini AI
* **Hosting:** Firebase Hosting (Web Frameworks)

---

## 🚀 Getting Started (Local Development)

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed, along with a Firebase project.

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/osunfix.git
cd osunfix
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment Variables
Create a `.env` file in the root of the project and add your Firebase and Gemini credentials:

```env
GEMINI_API_KEY="your_gemini_api_key_here"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your_project_id"
NEXT_PUBLIC_FIREBASE_API_KEY="your_api_key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your_auth_domain"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your_storage_bucket"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your_sender_id"
NEXT_PUBLIC_FIREBASE_APP_ID="your_app_id"
```

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## ☁️ Deployment

This project is configured for seamless deployment to **Firebase Hosting** using their experimental Next.js Web Frameworks support.

1. Ensure you have the Firebase CLI installed and are logged in:
```bash
npm install -g firebase-tools
firebase login
```

2. Deploy the application:
```bash
npx firebase-tools deploy --only hosting
```

---

## 🔐 Admin Access

The `/admin` dashboard is strictly protected. To access it:
1. Go to your Firebase Console -> Authentication.
2. Manually create a user with an official email and password.
3. Use those credentials on the `osunfix.web.app/login` page.
*(Note: Public "Sign Up" has been disabled to prevent unauthorized access to the routing dashboard).*

---

## 📜 License

© 2026 OsunFix. Sustainability First. Designed for the Osun Civic Hackathon.
