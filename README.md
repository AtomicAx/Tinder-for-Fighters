# Tinder-for-Fighters

A full-stack mobile app that helps fighters connect for sparring, mentorship, and gym discovery.

---

## Project Structure Overview

```
Tinder-For-Fighters/
├── backend/                  # Django project settings & root config
│   ├── __init__.py
│   ├── settings.py           # Main Django settings
│   ├── urls.py               # Root URL config
│   ├── wsgi.py / asgi.py     # Deployment entry points
│
├── backend/fightapp/         # Main Django app
│   ├── __init__.py
│   ├── admin.py              # Admin interface setup
│   ├── apps.py
│   ├── migrations/           # Database migration files
│   ├── models.py             # Database schema
│   ├── views.py              # API views (will connect to frontend)
│   ├── tests.py
│
├── expo_tinderforfighters/   # React Native frontend (via Expo)
│   ├── App.js                # Main entry point for Expo app
│   ├── assets/               # Icons, splash screen, images, etc.
│   ├── components/           # Reusable UI components (buttons, cards, etc.)
│   ├── screens/              # Main app screens (Home, Login, Profile, etc.)
│   ├── navigation/           # React Navigation configuration (stacks/tabs)
│   ├── services/             # API utilities, auth functions
│   ├── context/              # Global app state via React Context
│   ├── constants/            # Theme colors, route names, static configs
│   ├── utils/                # Helper functions (formatters, validators)
│   ├── hooks/                # Custom React hooks (e.g., useAuth)
│   └── index.js              # Entry point used by Expo CLI
│
├── manage.py                 # Django management script
├── requirements.txt          # Python dependencies
└── README.md
```

---

## Frontend Folder Descriptions (Expo)

| Folder        | Description                                                         |
| ------------- | ------------------------------------------------------------------- |
| `assets/`     | Static assets like images and icons. Subfolders help organize them. |
| `components/` | Reusable UI components shared across screens (buttons, cards, etc.) |
| `screens/`    | Full-page screens/routes like Login, Home, Profile, etc.            |
| `navigation/` | Navigation config using React Navigation (stack/tab/drawer).        |
| `services/`   | API requests, token management, login helpers, etc.                 |
| `context/`    | Global state management using React Context API.                    |
| `constants/`  | Centralized values like color themes, spacing, route names.         |
| `utils/`      | Utility functions for formatting, validation, etc.                  |
| `hooks/`      | Custom React hooks to encapsulate reusable logic.                   |

---

## Backend Folder Descriptions (Django)

| Folder/File            | Description                                            |
| ---------------------- | ------------------------------------------------------ |
| `backend/`             | Project-level config (settings, urls, wsgi)            |
| `backend/settings.py`  | Django app configuration and installed apps            |
| `backend/urls.py`      | URL routing to different apps and APIs                 |
| `backend/fightapp/`    | Core Django app housing models, views, and logic       |
| `fightapp/models.py`   | Django models that define the database schema          |
| `fightapp/views.py`    | API endpoints and app logic (to connect with frontend) |
| `fightapp/admin.py`    | Admin panel config for managing data                   |
| `fightapp/migrations/` | Auto-generated DB schema migrations                    |

---

Keep screens, components, and services modular — this will help scale fast when we add more features like login, messaging, and maps.
