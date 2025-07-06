# Project: Horizon Scanning & Assessment Platform

## 1. Overview & Vision

[cite_start]This project aims to build a "Horizon Scanning & Assessment Platform," a centralized, AI-powered Single Page Application (SPA) designed for the financial and property sectors[cite: 2, 41]. [cite_start]The core problem is that teams in these sectors struggle with the time-consuming, inefficient, and error-prone process of manually tracking evolving regulations, which creates a significant risk of non-compliance[cite: 3, 4, 5].

[cite_start]The vision is to transform regulatory compliance from a reactive chore into a proactive, strategic advantage[cite: 6]. [cite_start]The platform will automate the collection of regulatory updates, use the Gemini AI to speed up analysis, and provide clear, actionable insights through intuitive workflows and visualizations[cite: 7].

## 2. User Personas

* **P1: Compliance Analyst (Primary):** Responsible for daily monitoring and initial analysis. [cite_start]Wants to quickly find relevant updates and reduce manual work[cite: 8, 9, 10].
* **P2: Compliance Manager (Secondary):** Oversees the compliance function. [cite_start]Needs a high-level view of all assessments, team workload, and key deadlines[cite: 11, 12, 13].
* **P3: Business Stakeholder:** Leads a business unit. [cite_start]Needs clear, concise summaries of how regulatory changes will impact their specific operations[cite: 14, 15, 16].

## 3. Core Features & Requirements (MVP)

### 3.1. Content & Workflow
* [cite_start]**Dashboard:** The main view will be organized into status-based tabs: "New & Unvalidated," "Validated," "Requires Further Review," and "Not Applicable".
* [cite_start]**Ingestion:** Automatically scan pre-configured sources daily[cite: 18]. [cite_start]Also, allow users to manually add an item by providing a URL[cite: 19].
* [cite_start]**Metadata:** Item cards must display the source, publication date, and the date it was added.
* [cite_start]**Assessment Panel:** A panel will contain fields for: Event Type, Detailed Summary, Impact Assessment, Timescales, Impacted Business Areas, and Internal Notes. [cite_start]Items will move between tabs when their status is updated[cite: 22].
* [cite_start]**Search & Filter:** A global search bar will search titles and summaries[cite: 26]. [cite_start]Each status tab will have quick filters for "Event Type" and "Impacted Business Area"[cite: 27].

### 3.2. AI-Powered Assistance
* [cite_start]**AI Assessment:** An on-demand "Generate AI Assessment" button will use the Gemini API to populate the Detailed Summary and Impact Assessment fields.
* [cite_start]**AI Chat:** An "Ask AI" button will open a context-aware chat modal for the selected regulatory update.

### 3.3. Visualization & Reporting
* [cite_start]**Gantt Chart:** A separate view will provide a Gantt chart to visualize all horizon scanner items [cite: 31][cite_start], filterable by Event Type, Impacted Business Area, and Date Period.
* [cite_start]**Reporting:** In the "Validated" tab, users can select multiple items via checkboxes  [cite_start]to generate a consolidated PDF report[cite: 36, 37].
* [cite_start]**Sharing:** A "Share" button on each item will copy a pre-formatted summary to the clipboard.

## 4. Technical Stack

* [cite_start]**Frontend Framework:** React 18 (SPA using functional components and Hooks)[cite: 41, 43, 44].
* [cite_start]**Backend Services:** Google Firebase (BaaS model)[cite: 42, 45].
* [cite_start]**Database:** Cloud Firestore (NoSQL, document-based)[cite: 46].
* [cite_start]**Authentication:** Firebase Authentication (supporting anonymous sign-in for the prototype)[cite: 47, 48].
* [cite_start]**AI/LLM Integration:** Google Gemini API (`gemini-2.0-flash` model)[cite: 49, 50].
* [cite_start]**Styling & UI:** Tailwind CSS for styling, Lucide-React for icons[cite: 51].
* [cite_start]**PDF Generation:** jsPDF and html2canvas (loaded via CDN)[cite: 52].
* [cite_start]**Deployment:** Static React build, deployable to any static hosting provider[cite: 66].

## 5. Data Models (Firestore)

**1. `updates` Collection**
* [cite_start]**Path:** `/artifacts/{appId}/public/data/updates/{updateId}` [cite: 54]
* **Purpose:** Stores each regulatory item.
* **Schema:**
    ```json
    {
      "title": "string",
      "url": "string",
      "source": "string",
      "summary": "string",
      "detailedSummary": "string",
      "impactAssessment": "string",
      "publicationDate": "string (YYYY-MM-DD)",
      "type": "string",
      "status": "string",
      "impactedAreas": ["string"],
      "createdAt": "timestamp"
    }
    ```

**2. `horizon_events` Collection**
* **Path:** `/artifacts/{appId}/public/data/horizon_events/{eventId}` [cite: 56]
* [cite_start]**Purpose:** Stores items for the Gantt chart view[cite: 55].
* **Schema:**
    ```json
    {
      "updateId": "string",
      "title": "string",
      "start": "string (YYYY-MM-DD)",
      "end": "string (YYYY-MM-DD)",
      "type": "string"
    }
    ```
## 6. Implementation Notes
* [cite_start]**Data Fetching:** Use Firestore's `onSnapshot` real-time listeners to keep the UI in sync with the database.
* **Filtering/Search:** For the prototype, all filtering and searching will be performed client-side on the full dataset fetched from Firestore[cite: 58].
* [cite_start]**Data Writing:** Use `addDoc` for new entries and `setDoc` with `{ merge: true }` for updates to avoid data loss[cite: 59, 60].
* **Scalability:** The client-side search/filter approach is a known bottleneck. [cite_start]In production, this should be replaced with a dedicated search service like Algolia or Elasticsearch, indexed via a Cloud Function trigger[cite: 67, 69, 70].