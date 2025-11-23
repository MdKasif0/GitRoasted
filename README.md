
# GitRoasted: Savage AI Roasts for Your GitHub Profile

<div align="center">
  <img src="https://storage.googleapis.com/a-studio-images/public/sample-apps/gitroasted/og-image.png" alt="GitRoasted banner showing an example roast card" width="800">
</div>

<div align="center">

**[View Live Demo](https://gitroasted.app)** • **[How It Works](#how-it-works)** • **[Tech Stack](#tech-stack)**

</div>

**GitRoasted** is a fun, interactive web application that uses AI to "roast" a GitHub user based on their public activity. It performs a comprehensive analysis of contribution stats, repository data, and profile information to generate a humorous roast, a detailed score breakdown, and a developer archetype.

It's a unique way to get a new perspective on your GitHub history and share it with the community.

## ✨ Features

-   **🤖 AI-Powered Roasts**: Uses Google's Gemini model via Genkit to generate unique, savage, but friendly multi-line roasts.
-   **📊 Comprehensive GitHub Analysis**: Fetches a wide range of data including user profiles, commit history, repository stats (stars, languages), and contribution frequency.
-   **⚖️ Sophisticated Scoring System**: A balanced, multi-dimensional algorithm calculates a "Seriousness Score" (out of 1000) across 8 different categories, designed to be fair to both new and veteran developers.
-   **💡 Detailed Score Breakdown**: Get a transparent look at how your score was calculated, with detailed sub-category scores and explanations.
_   **🎭 Developer Archetypes**: Identifies your developer profile type (e.g., "Project Maintainer," "Technology Explorer," "Consistent Builder") based on your unique activity patterns.
-   **🏆 Dynamic Profile Cards**: Displays results in beautifully designed, animated cards with progress gauges and typewriter effects.
-   **🖼️ Shareable Image Generation**: Customize and download your roast results as a shareable image card for social media.
-   **🔥 "Hall of Flame" Leaderboard**: A real-time leaderboard showcases the top-roasted users with the highest seriousness scores.
-   **🚀 Modern UI/UX**: Built with Next.js and ShadCN UI, featuring a responsive design, glassmorphism effects, and smooth animations.

## How It Works

1.  **Enter a Username**: The user provides a public GitHub username.
2.  **Fetch Data**: The backend calls the GitHub API to fetch the user's profile, repositories, and public events.
3.  **Calculate Score**: The multi-dimensional algorithm processes the data to calculate a "Seriousness Score" out of 1000.
4.  **Generate Roast**: The profile data and score are sent to a Genkit flow, which uses a Gemini model to generate a humorous roast.
5.  **Display Results**: The score, roast, and detailed breakdown are displayed in a dynamic, animated card.
6.  **Share**: The user can customize and share their results as a downloadable image.

## 📸 Screenshots

<table>
  <tr>
    <td><img src="https://storage.googleapis.com/a-studio-images/public/sample-apps/gitroasted/screenshot-main.png" alt="Main interface of GitRoasted"></td>
    <td><img src="https://storage.googleapis.com/a-studio-images/public/sample-apps/gitroasted/screenshot-card.png" alt="Example of a generated profile card"></td>
  </tr>
  <tr>
    <td><img src="https://storage.googleapis.com/a-studio-images/public/sample-apps/gitroasted/screenshot-leaderboard.png" alt="The Hall of Flame leaderboard"></td>
    <td><img src="https://storage.googleapis.com/a-studio-images/public/sample-apps/gitroasted/screenshot-share.png" alt="Shareable card customization dialog"></td>
  </tr>
</table>

## 🛠️ Tech Stack

-   **Framework**: [Next.js](https://nextjs.org/) (App Router)
-   **AI/Generative**: [Firebase Genkit](https://firebase.google.com/docs/genkit) with [Google AI (Gemini)](https://ai.google.dev/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
-   **Database**: [Cloud Firestore](https://firebase.google.com/docs/firestore) for the leaderboard
-   **Image Generation**: [html-to-image](https://www.npmjs.com/package/html-to-image)
-   **Deployment**: Vercel / Firebase Hosting

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

-   Node.js (v18 or later)
-   npm, pnpm, or yarn

### Installation

1.  **Clone the repo**
    ```sh
    git clone https://github.com/firebase/studio-extra-large.git
    cd studio-extra-large/apps/gitroasted
    ```
2.  **Install NPM packages**
    ```sh
    npm install
    ```
3.  **Set up environment variables**
    -   Create a `.env.local` file in the root of your project.
    -   Add your GitHub Personal Access Token. This is required to make authenticated requests to the GitHub API and avoid strict rate limits.
        ```
        GITHUB_TOKEN=your_github_personal_access_token
        ```
    -   You will also need to configure your Google AI API key for Genkit.
        ```
        GEMINI_API_KEY=your_google_ai_api_key
        ```
    -   You will need to create a Firebase Project and update the configuration object in `src/firebase/config.ts`.

4.  **Run the development server**
    ```sh
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/firebase/studio-extra-large/issues).

## 📄 License

This project is licensed under the Apache-2.0 License - see the [LICENSE](LICENSE) file for details.
