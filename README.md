# GitRoasted

GitRoasted is a fun, interactive web application that uses AI to generate a humorous "roast" of a GitHub user's profile based on their public activity, contribution stats, and repository data. It provides a unique way to look at your GitHub history and share it with others.

## Features

-   **AI-Powered Roasts**: Utilizes Genkit and Google's Gemini models to generate unique, savage, but friendly roasts.
-   **Comprehensive GitHub Analysis**: Fetches a wide range of data including user profiles, commit history, repository stats (stars, languages), and contribution frequency.
-   **Weighted Scoring System**: A sophisticated algorithm calculates a "Roast Score" based on multiple factors like star count, follower ratio, account age, and contribution consistency.
-   **Dynamic Profile Cards**: Displays the results in a beautifully designed, animated card complete with a circular progress gauge for the score and a typewriter effect for the roast.
-   **Shareable Image Generation**: Users can customize and download their roast results as a shareable image card for social media (Twitter, Instagram, etc.).
-   **Leaderboard**: A "Hall of Flame" showcases the top-roasted users.
-   **Modern UI/UX**: Built with Next.js and ShadCN UI, featuring a responsive design, glassmorphism effects, and smooth animations.

## Tech Stack

-   **Framework**: [Next.js](https://nextjs.org/) (App Router)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/) with [ShadCN UI](https://ui.shadcn.com/) components.
-   **AI/Generative**: [Firebase Genkit](https://firebase.google.com/docs/genkit) with [Google AI (Gemini)](https://ai.google.dev/).
-   **Image Generation**: [html-to-image](https://www.npmjs.com/package/html-to-image) library.
-   **Deployment**: Ready for Vercel or Firebase Hosting.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

-   Node.js (v18 or later)
-   npm, pnpm, or yarn

### Installation

1.  **Clone the repo**
    ```sh
    git clone https://github.com/your-username/gitroasted.git
    cd gitroasted
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
4.  **Run the development server**
    ```sh
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## How It Works

1.  **Enter a Username**: The user provides a public GitHub username.
2.  **Fetch Data**: The backend calls the GitHub API to fetch the user's profile, repositories, and public events.
3.  **Calculate Score**: A weighted algorithm processes the data to calculate a "Roast Score" out of 1000.
4.  **Generate Roast**: The profile data and score are sent to a Genkit flow, which uses a Gemini model to generate a humorous, multi-line roast.
5.  **Display Results**: The score and roast are displayed in a dynamic, animated card.
6.  **Share**: The user can customize and share their results as a downloadable image.
