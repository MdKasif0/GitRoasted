<div align="center">

# 🔥 GitRoasted

### Analyze, Roast & Rank Your GitHub Profile

*Get your GitHub developer score out of 1000 with a savage AI roast*

[![Live Demo](https://img.shields.io/badge/demo-live-success?style=for-the-badge&logo=netlify)](https://gitroasted.netlify.app)
[![Product Hunt](https://img.shields.io/badge/Product%20Hunt-%23%20Product%20of%20the%20Day-orange?style=for-the-badge&logo=producthunt)](https://www.producthunt.com/posts/gitroasted)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore-orange?style=flat-square&logo=firebase)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

[🚀 Live Demo](https://gitroasted.netlify.app) • 
Made by- https://x.com/md_kasif_uddin
[📖 Documentation](#features) • 
[🐛 Report Bug](https://github.com/MdKasif0/GitRoasted/issues) • 
[✨ Request Feature](https://github.com/MdKasif0/GitRoasted/issues)

</div>

---

## ✨ What is GitRoasted?

GitRoasted is a **free, open-source developer tool** that analyzes your GitHub profile and gives you:

- 📊 **Comprehensive Score** - Out of 1000 based on 8 key metrics
- 🔥 **AI-Generated Roast** - Savage but funny feedback on your coding habits
- 🏆 **Global Leaderboard** - Compete with developers worldwide
- 💡 **Improvement Tips** - Actionable advice to boost your score
- ⚔️ **Profile Comparison** - Battle other developers head-to-head
- 📤 **Shareable Cards** - Beautiful cards for social media

> "GitRoasted turned my GitHub profile analysis into an addictive game!" - *Developer*

---

## 🎥 Demo

### Try it now:
1. Visit [gitroasted.netlify.app](https://gitroasted.netlify.app)
2. Enter any GitHub username
3. Get instant analysis + roast!

**Features in Action:**
- 🎯 Real-time GitHub profile analysis
- 🤖 AI-powered personalized roasts
- 📊 Interactive score breakdowns
- 🏆 Live leaderboard rankings
- 🎨 Customizable share cards

---

## 🚀 Features

### Core Features
- ✅ **GitHub Profile Analysis** - Analyzes 100+ data points from GitHub API
- ✅ **8-Metric Scoring System** - Comprehensive evaluation (Impact, Consistency, Quality, Community, Diversity, Experience, Activity, Bonuses)
- ✅ **AI-Powered Roasts** - Personalized 2-3 line roasts that are savage yet appreciative
- ✅ **Global Leaderboard** - Real-time ranking with pagination and search
- ✅ **Profile Comparison** - Head-to-head battles with detailed breakdowns
- ✅ **Quick Wins** - Personalized improvement roadmap with actionable tips
- ✅ **Shareable Cards** - Generate cards for Instagram, Twitter, or 3:4 format
- ✅ **Dark/Light Themes** - Seamless theme switching with system preference detection
- ✅ **Fully Responsive** - Optimized for mobile, tablet, and desktop
- ✅ **PWA Support** - Installable progressive web app with offline support

### Advanced Features
- 🎯 **Category Breakdown** - Detailed scoring across all 8 categories
- 📈 **Trend Analysis** - Track score improvements over time
- 🗺️ **Improvement Roadmap** - 3-phase plan to boost your score
- 💡 **Project Recommendations** - Specific project ideas based on your gaps
- 📊 **Radar Chart Visualization** - Visual comparison of your strengths
- 🔔 **Real-time Updates** - Live leaderboard with Firebase sync
- 🎨 **Card Customization** - Multiple themes and layouts for sharing
- 🌐 **Multi-language Support** - Support for 10+ programming languages

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, TypeScript)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + Custom animations
- **UI Components**: Custom components with glass-morphism design
- **Charts**: [Recharts](https://recharts.org/) for data visualization
- **Icons**: [React Icons](https://react-icons.github.io/react-icons/)
- **State Management**: React Context + Hooks

### Backend & Database
- **Database**: [Firebase Firestore](https://firebase.google.com/docs/firestore)
- **Authentication**: None (public access)
- **API**: GitHub REST API v3
- **Caching**: localStorage + sessionStorage for performance

### Deployment & Infrastructure
- **Hosting**: [Netlify](https://www.netlify.com/)
- **CDN**: Netlify Edge Network
- **SSL**: Auto-managed by Netlify
- **Analytics**: Google Analytics 4

### Development Tools
- **Language**: TypeScript 5.0
- **Package Manager**: npm
- **Linting**: ESLint + Prettier
- **Version Control**: Git + GitHub

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Client Browser                       │
│  (Next.js 14 App + React Components + Tailwind CSS)     │
└────────────────┬────────────────────────────────────────┘
                 │
                 ├─ GitHub API (REST v3)
                 │  └─ User data, repos, contributions
                 │
                 ├─ Firebase Firestore
                 │  └─ Leaderboard storage
                 │  └─ User scores cache
                 │
                 └─ localStorage
                    └─ Client-side caching
                    └─ User preferences

Data Flow:
1. User enters GitHub username
2. Fetch data from GitHub API (parallel requests)
3. Calculate score using 8-metric algorithm
4. Generate AI roast based on profile data
5. Store result in Firestore (if new/improved score)
6. Display results with animations
7. Cache in localStorage for 24h
```

---

## 📊 Scoring Algorithm

GitRoasted evaluates profiles across **8 key dimensions** (total 1000 points):

| Category | Points | Description |
|----------|--------|-------------|
| 💫 **Impact** | 250 | Stars received, repo quality, fork impact |
| 🔥 **Consistency** | 200 | Contribution frequency, streaks, commitment |
| ✨ **Quality** | 150 | Code reviews, documentation, testing |
| 👥 **Community** | 150 | Followers, collaboration, social engagement |
| 🌈 **Diversity** | 100 | Programming languages, tech stack variety |
| 📅 **Experience** | 75 | Account age, profile completeness |
| ⚡ **Activity** | 50 | Recent contributions (last 30-90 days) |
| 🏆 **Bonus** | 25 | Exceptional achievements (viral repos, year streaks) |

### Score Ranges
- **🏆 Elite (900-1000)**: Top 1% - GitHub Legend
- **⭐ Exceptional (800-899)**: Top 5% - Star Developer  
- **💪 Excellent (700-799)**: Top 10% - Highly Skilled
- **👍 Above Average (600-699)**: Top 25% - Solid Developer
- **📈 Average (400-599)**: Top 50% - Keep Building
- **🌱 Developing (0-399)**: Room for Growth

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have:
- **Node.js** 18.0+ installed ([Download](https://nodejs.org/))
- **npm** 9.0+ (comes with Node.js)
- **Git** installed ([Download](https://git-scm.com/))
- **Firebase account** ([Sign up free](https://firebase.google.com/))
- **GitHub account** (for testing)

---

### 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/MdKasif0/GitRoasted.git
   cd GitRoasted
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   
   # GitHub API (Optional - for higher rate limits)
   GITHUB_TOKEN=your_github_personal_access_token
   
   # Analytics (Optional)
   NEXT_PUBLIC_GA_MEASUREMENT_ID=your_ga_id
   ```

4. **Set up Firebase Firestore**
   
   a. Create a new Firebase project  
   b. Enable Firestore Database  
   c. Create a collection named `leaderboard`  
   d. Set up Firestore rules:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /leaderboard/{document} {
         allow read: if true;
         allow write: if true;
       }
     }
   }
   ```
   
   e. Create composite index:
   - Collection: `leaderboard`
   - Fields: `score` (Descending)

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

---

### 🔨 Build for Production

```bash
# Build the application
npm run build

# Start production server
npm start

# Or build and export static files
npm run build && npm run export
```

---

### 🚢 Deployment

#### Deploy to Netlify (Recommended)

1. **Connect your repository**
   - Sign up at [Netlify](https://www.netlify.com/)
   - Click "New site from Git"
   - Connect your GitHub repository

2. **Configure build settings**
   ```
   Build command: npm run build
   Publish directory: .next
   ```

3. **Add environment variables**
   - Go to Site settings → Environment variables
   - Add all variables from `.env.local`

4. **Deploy**
   - Click "Deploy site"
   - Your site will be live at `yoursite.netlify.app`

#### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow the prompts to deploy
```

---

## 📖 Usage

### Analyze a Profile

```typescript
// Visit the homepage
https://gitroasted.netlify.app

// Enter any GitHub username
"torvalds", "gaearon", "your-username"

// Get instant results!
```

### Using the API (Self-hosted)

```bash
# Fetch user score
GET /api/score?username=torvalds

# Response
{
  "username": "torvalds",
  "score": 892,
  "breakdown": {
    "impact": 230,
    "consistency": 180,
    "quality": 145,
    ...
  },
  "roast": "Your commit history..."
}
```

### Embedding the Badge

Add your GitRoasted score to your GitHub README:

```markdown
[![GitRoasted Score](https://gitroasted.netlify.app/api/badge/yourusername)](https://gitroasted.netlify.app/profile/yourusername)
```

### GitHub Action Integration

Add to `.github/workflows/update-score.yml`:

```yaml
name: Update GitRoasted Score

on:
  schedule:
    - cron: '0 0 * * 0' # Weekly
  workflow_dispatch:

jobs:
  update-score:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Update Score
        run: |
          curl -X POST https://gitroasted.netlify.app/api/refresh/${{ github.repository_owner }}
```

---

## 🤝 Contributing

We love contributions! GitRoasted is open-source and welcomes contributions from developers of all skill levels.

### How to Contribute

1. **Fork the repository**
   
   Click the "Fork" button at the top right of this page

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/GitRoasted.git
   cd GitRoasted
   ```

3. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

4. **Make your changes**
   
   Follow our [coding standards](#coding-standards)

5. **Commit your changes**
   ```bash
   git commit -m "Add: amazing new feature"
   ```
   
   Use conventional commits:
   - `feat:` - New feature
   - `fix:` - Bug fix
   - `docs:` - Documentation
   - `style:` - Formatting
   - `refactor:` - Code restructuring
   - `test:` - Adding tests
   - `chore:` - Maintenance

6. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```

7. **Open a Pull Request**
   
   Go to the original repository and click "New Pull Request"

### Coding Standards

- Use **TypeScript** for type safety
- Follow **ESLint** rules (run `npm run lint`)
- Write **meaningful commit messages**
- Add **comments** for complex logic
- Update **documentation** for new features
- Write **tests** for new functionality (when applicable)

### Areas We Need Help

- 🐛 **Bug fixes** - Check [open issues](https://github.com/MdKasif0/GitRoasted/issues)
- ✨ **New features** - See [roadmap](#roadmap)
- 📝 **Documentation** - Improve guides and examples
- 🌐 **Translations** - Add support for more languages
- 🎨 **Design** - UI/UX improvements
- ⚡ **Performance** - Optimization opportunities

---

## 🗺️ Roadmap

### ✅ Completed
- [x] Core scoring algorithm (8 metrics)
- [x] AI-powered roast generation
- [x] Global leaderboard with pagination
- [x] Profile comparison feature
- [x] Quick wins improvement tips
- [x] Shareable social cards
- [x] PWA support
- [x] Dark/light themes
- [x] Mobile responsive design

### 🚧 In Progress
- [ ] Team/Organization leaderboards
- [ ] Historical score tracking (graph over time)
- [ ] Achievement badge system
- [ ] API rate limit optimization

### 🔮 Planned
- [ ] Native mobile apps (iOS & Android)
- [ ] VS Code extension
- [ ] GitHub Action for README badges
- [ ] Email notifications for score changes
- [ ] Premium features (advanced analytics)
- [ ] Integration with LinkedIn
- [ ] Multi-user comparison (up to 5 users)
- [ ] Custom scoring weights
- [ ] Private leaderboards
- [ ] Internationalization (i18n)

**Vote on features**: [GitHub Discussions](https://github.com/MdKasif0/GitRoasted/discussions)

---

## 🐛 Bug Reports & Feature Requests

Found a bug? Have an idea? We'd love to hear from you!

**Bug Report**: [Open an issue](https://github.com/MdKasif0/GitRoasted/issues/new?template=bug_report.md)

**Feature Request**: [Open an issue](https://github.com/MdKasif0/GitRoasted/issues/new?template=feature_request.md)

**General Discussion**: [GitHub Discussions](https://github.com/MdKasif0/GitRoasted/discussions)

---

## 💬 Community & Support

Join our community of developers!

- 💬 **Discord**: [Join our server](https://discord.gg/gitroasted)
- 🐦 **Twitter**: [@gitroasted](https://twitter.com/gitroasted)
- 📧 **Email**: contact@gitroasted.com
- 📱 **Instagram**: [@gitroasted](https://instagram.com/gitroasted)

### FAQ

**Q: Is GitRoasted free?**  
A: Yes! GitRoasted is 100% free and open-source.

**Q: How often does my score update?**  
A: Scores are cached for 24 hours. You can force refresh by searching again.

**Q: Why is my score lower than expected?**  
A: Check the [Quick Wins](https://gitroasted.netlify.app/quick-wins) page for improvement tips!

**Q: Can I use this for my company?**  
A: Absolutely! It's open-source under MIT license.

**Q: Does GitRoasted collect my data?**  
A: We only store your public GitHub data (username, avatar, score). See [Privacy Policy](./PRIVACY.md).

**More questions?** Check our [full FAQ](https://gitroasted.netlify.app/faq)

---

## 🙏 Acknowledgments

### Built With Love By
- [Md Kasif](https://github.com/MdKasif0) - Creator & Maintainer

### Special Thanks
- [GitHub](https://github.com) - For the incredible API
- [Next.js Team](https://nextjs.org) - For the amazing framework
- [Vercel](https://vercel.com) - For inspiration
- [All Contributors](https://github.com/MdKasif0/GitRoasted/graphs/contributors) - For making this project better

### Inspired By
- GitHub's contribution graph
- [GitHub Profile Summary Cards](https://github.com/vn7n24fzkq/github-profile-summary-cards)
- Developer communities on Twitter

### Resources
- Icons from [React Icons](https://react-icons.github.io/)
- Illustrations from [Undraw](https://undraw.co/)
- Fonts from [Google Fonts](https://fonts.google.com/)

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### MIT License Summary

```
MIT License

Copyright (c) 2024 GitRoasted

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

**What this means:**
- ✅ Commercial use allowed
- ✅ Modification allowed
- ✅ Distribution allowed
- ✅ Private use allowed
- ⚠️ No warranty provided
- ⚠️ No liability accepted

---

## ⚖️ Legal & Privacy

- **Privacy Policy**: [Read here](./PRIVACY.md)
- **Terms of Service**: [Read here](./TERMS.md)
- **Code of Conduct**: [Read here](./CODE_OF_CONDUCT.md)

### Data Usage
GitRoasted only uses **publicly available GitHub data**:
- ✅ Public profile information
- ✅ Public repositories
- ✅ Public contributions
- ❌ No private data accessed
- ❌ No authentication required
- ❌ No personal data collected

We respect the [GitHub Terms of Service](https://docs.github.com/en/github/site-policy/github-terms-of-service) and [API Terms](https://docs.github.com/en/github/site-policy/github-terms-of-service#h-api-terms).

---

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=MdKasif0/GitRoasted&type=Date)](https://star-history.com/#MdKasif0/GitRoasted&Date)

---

## 📊 Project Stats

![GitHub Repo stars](https://img.shields.io/github/stars/MdKasif0/GitRoasted?style=social)
![GitHub forks](https://img.shields.io/github/forks/MdKasif0/GitRoasted?style=social)
![GitHub issues](https://img.shields.io/github/issues/MdKasif0/GitRoasted)
![GitHub pull requests](https://img.shields.io/github/issues-pr/MdKasif0/GitRoasted)
![GitHub contributors](https://img.shields.io/github/contributors/MdKasif0/GitRoasted)
![GitHub last commit](https://img.shields.io/github/last-commit/MdKasif0/GitRoasted)
![GitHub code size](https://img.shields.io/github/languages/code-size/MdKasif0/GitRoasted)

---

## 🔗 Related Projects

- [GitHub Profile README Generator](https://github.com/rahuldkjain/github-profile-readme-generator)
- [GitHub Stats Visualization](https://github.com/anuraghazra/github-readme-stats)
- [GitHub Profile Trophy](https://github.com/ryo-ma/github-profile-trophy)
- [GitHub Activity Graph](https://github.com/Ashutosh00710/github-readme-activity-graph)

---

## 💖 Support the Project

If you find GitRoasted useful, consider supporting it:

- ⭐ **Star this repo** - It helps us grow!
- 🐦 **Share on Twitter** - Spread the word
- 💝 **Sponsor**: [Buy me a coffee](https://buymeacoffee.com/gitroasted)
- 🐛 **Report bugs** - Help us improve
- 💡 **Suggest features** - Shape the future

---

<div align="center">

### Made with 🔥 by developers, for developers

**[gitroasted.netlify.app](https://gitroasted.netlify.app)**

[![Twitter Follow](https://img.shields.io/twitter/follow/gitroasted?style=social)](https://twitter.com/gitroasted)
[![GitHub followers](https://img.shields.io/github/followers/MdKasif0?style=social)](https://github.com/MdKasif0)

---

**© 2024 GitRoasted. All rights reserved.**

[Website](https://gitroasted.netlify.app) • 
[Twitter](https://twitter.com/gitroasted) • 
[Discord](https://discord.gg/gitroasted) • 
[Contact](mailto:contact@gitroasted.com)

</div>
