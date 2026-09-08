website link:- https://remix-remix-trustscore-alternative-credit-scoring-8429.ai.studio

# TrustScore — AI-Powered Alternative Credit Scoring

> Alternative credit scoring engine tailored for first-time borrowers, gig workers, small business owners, and underserved individuals by evaluating 10 comprehensive data signals beyond traditional CIBIL/bureau scores.

---

## 🚀 Key Features

- **10 Multi-Dimensional Alternative Data Signals**: Evaluates Utility Bill Timeliness, UPI Transaction Velocity, Monthly Inflow-to-Outflow Ratio, Average Daily Balance Stability, Gig/Freelance Platform Inflows, Rent & Micro-subscription Timeliness, Zero-Cheque Bounce History, Social/Community Micro-vouching, Device Stability & Tenure, and Educational/Vocational Certification.
- **Dynamic Risk Categorization & Decision Engine**: Instant categorization into *Prime Alt-Credit*, *Near-Prime*, *Moderate Risk*, and *High Risk* with recommended sanction limits, interest rates, and loan tenures.
- **Interactive What-If Simulator**: Real-time slider simulator showing borrowers how improving key behaviors directly improves their TrustScore and unlock better loan terms.
- **Official Sanction Letter Generation**: Instant printable and downloadable formal loan sanction letter with verifiable reference ID and terms.
- **Preset Persona Profiles**: Switch between real-world personas (Delivery Fleet Partner, Kirana Store Merchant, Freelance Designer, Fresh Graduate).

---

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4 + Space Grotesk / Plus Jakarta Sans Typography
- **Icons**: Lucide React
- **Animations & FX**: Motion (Framer Motion) + Canvas Confetti
- **Backend & Integrations**: Express + Google GenAI SDK

---

## 💻 Getting Started Locally

### 1. Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm** or **bun** or **yarn**

### 2. Installation
```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/trustscore-alternative-credit.git

# Navigate into project directory
cd trustscore-alternative-credit

# Install dependencies
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env` if using Gemini API or server features:
```bash
cp .env.example .env
```

### 4. Running the Development Server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:3000`.

### 5. Building for Production
```bash
npm run build
npm run preview
```

---

## 📂 Project Structure

```text
├── index.html                    # HTML entry point with web fonts
├── package.json                  # Dependencies and build scripts
├── vite.config.ts                # Vite build and Tailwind configuration
├── tsconfig.json                 # TypeScript configuration
├── src/
│   ├── main.tsx                  # React root mount
│   ├── App.tsx                   # Main application controller and routing
│   ├── index.css                 # Tailwind CSS styles & print media rules
│   ├── types.ts                  # TypeScript interfaces and scoring types
│   ├── data/
│   │   └── profiles.ts           # Demo persona profiles and initial data
│   ├── utils/
│   │   └── scoringEngine.ts      # 10-signal credit scoring logic and calculations
│   └── components/
│       ├── AuthScreen.tsx        # Authentication & persona selection screen
│       ├── Navbar.tsx            # Header navigation & persona switcher
│       ├── DataSignalsForm.tsx   # Interactive input form for 10 credit signals
│       ├── TrustScoreDashboard.tsx # Comprehensive score cards, breakdown & recommendations
│       ├── WhatIfSimulator.tsx   # Interactive what-if scenario calculator modal
│       ├── SanctionLetterModal.tsx # Printable formal loan sanction letter
│       └── ProblemStatementModal.tsx # Problem statement slide deck
```

---

## 📄 License

Apache-2.0
