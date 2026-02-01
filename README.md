# Digital Workspace

**Kanban Wabi Sabi** is a modern, minimalist Digital Workspace application for managing tasks with Kanban boards. Despite the popularity of Scrum methods and the increasing complexity of Kanban boards, we wanted to return to simple Kanban signals and use color to distinguish the priority or category of tasks.

Deployed on Vercel: [Kanban Wabi Sabi](https://kanbanwabisabi.vercel.app/)
Account to test it: 
 - email: qawithkaty@gmail.com
 - password: test123

## Table of Contents

- [What Is Digital Workspace?](#what-is-digital-workspace)
- [Key Features](#key-features)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Design Philosophy](#design-philosophy)
- [Support & Documentation](#support--documentation)
- [Contributing](#contributing)
- [Project Status](#project-status)

## What Is Digital Workspace?

Digital Workspace is a web-based application designed to help teams collaborate on task management through Scrum methodologies and Kanban boards. It features:

- **Management Board**: A shared view for task visibility and assignment across the team
- **Personal Kanban**: Individual Kanban boards where users track their assigned tasks
- **Real-time Sync**: Firebase-powered synchronization for instant updates
- **User Authentication**: Email-based authentication with Firebase Auth
- **Responsive Design**: Beautiful, accessible interface that works on all devices

The application reflects a zen approach to work organization—removing clutter, focusing attention, and allowing workflow to emerge naturally through simple, elegant tools.

## Key Features

✨ **Core Capabilities**

- **Scrum Task Management**: Organize work using Scrum methodologies with task status tracking (Pending, Assigned, Completed)
- **Kanban Boards**: Personal and shared Kanban boards for visual task workflow management
- **Real-time Collaboration**: Instant synchronization across all users thanks to Firebase integration
- **Task Filtering**: Filter tasks by status (All, Completed, Assigned, Pending) for focused work
- **User Profiles**: Store and retrieve user preferences and assigned tasks
- **Email Verification**: Secure authentication with email verification support
- **Responsive UI**: Mobile-first design using Tailwind CSS for seamless experience across devices

🎨 **Design Principles**

- Minimalist interface inspired by Zen techniques for reduced cognitive load
- Wabi-sabi aesthetic: celebrating imperfection, impermanence, and simplicity
- Intuitive navigation with visual feedback and smooth interactions
- Warm, earthy color palette promoting calm and focus

## Getting Started

### Prerequisites

- **Node.js**: v20.19.0 or >=22.12.0
- **npm**: Latest stable version
- **Firebase Account**: Set up a Firebase project for authentication and Firestore

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd Digital-Workspace
```

2. **Install dependencies**

```bash
npm install
npm install dotenv 
npm install axios
npm install firebase 
npm install --save vue-toastification@next
npm install tailwindcss @tailwindcss/vite
```

3. **Configure environment variables**

Create a `.env` file in the project root and add your Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Development

Start the development server with hot module replacement:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`


## Project Structure

```
src/
├── components/          # Reusable Vue components
│   ├── ButtonBasic.vue
│   ├── TaskCard.vue
│   └── IsVerifiedEmailMessage.vue
├── views/              # Page components
│   ├── HomeView.vue    # Management Board
│   ├── DashBoard.vue   # Personal Kanban
│   └── LoginView.vue   # Authentication
├── services/           # Business logic
│   ├── authFirebase.js      # Authentication
│   ├── workspaceData.js     # Data operations
│   └── firebaseErrors.js    # Error mapping
├── stores/             # Pinia state management
│   ├── counter.js
│   └── getDataApi.js
├── router/             # Vue Router configuration
│   └── index.js
├── database/           # Firebase configuration
│   └── databaseconfig.js
├── styles/             # Global styles
│   └── style.css
└── main.js             # Application entry point
```

## Tech Stack

**Frontend**

- [Vue 3](https://vuejs.org/) - Progressive JavaScript framework
- [Vue Router](https://router.vuejs.org/) - Client-side routing
- [Pinia](https://pinia.vuejs.org/) - State management
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Vue Toastification](https://github.com/Maronato/vue-toastification) - Library for pop-up styling

**Backend & Services**

- [Firebase](https://firebase.google.com/) - Real-time database, authentication, and hosting
- [Axios](https://axios-http.com/) - HTTP client


## Design Philosophy

### Zen for Simplicity

Digital Workspace embraces Zen principles of simplicity and focus. The interface removes unnecessary elements, guiding users' attention to what matters: their tasks. Each feature is purposefully designed to reduce cognitive load and promote mindful work habits.

- **Minimal Visual Clutter**: Only essential UI elements are displayed
- **Clear Focus**: One task, one action at a time
- **Intuitive Navigation**: Users find what they need without friction

### Wabi-Sabi Aesthetic

Rooted in Japanese philosophy, wabi-sabi celebrates impermanence and imperfection. Rather than striving for flawless design, we embrace:

- **Imperfection**: Authentic, understated elegance
- **Simplicity**: Stripped-down interfaces with no excess
- **Impermanence**: Tasks flow through states—completion is transformation, not perfection
- **Asymmetry**: Natural, organic layouts that feel balanced without being rigid

The warm, earthy color palette and subtle interactions reflect this philosophy, creating a workspace where users feel calm and focused.

## Support & Documentation

### IDE & Browser Setup

**Recommended IDE**

- [VS Code](https://code.visualstudio.com/) with [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) extension (disable Vetur if installed)

**Recommended Browser Extensions**

- Chromium-based browsers:
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)

### Configuration References

- [Vite Configuration](https://vite.dev/config/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Vue 3 Documentation](https://vuejs.org/guide/)

## Contributing

We appreciate [Japanese artists](https://experience-japan.info) for sharing Japanese iconography used in the project.

## Project Status

**Current Version**: 0.0.0 (Alpha)

**Status**: Active Development

### Roadmap

- [x] Core Kanban board functionality
- [x] Firebase authentication
- [x] Task filtering and management
- [x] Profile personalization
- [ ] Team collaboration features (comments, mentions)
- [ ] Internationalization (i18n)
- [ ] Performance optimizations and analytics

## License

This project is licensed under the MIT License - see the LICENSE file for details.

