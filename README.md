# EventHub - Event Management System

EventHub is a single-page event management application built with **React**, **Redux Toolkit** and **React Router**. It lets users discover live events from the **Ticketmaster Discovery API**, view detailed event information, register for events and manage their registrations from a personal dashboard.

This project was developed for **Web Programming - Assignment 2**.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Screenshots](#screenshots)
- [Project Structure](#project-structure)
- [Redux Architecture](#redux-architecture)
- [Routes](#routes)
- [Ticketmaster API Usage](#ticketmaster-api-usage)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Design Decisions](#design-decisions)
- [Known Limitations](#known-limitations)
- [Author](#author)

## Overview

Users can browse upcoming concerts, sports, theatre and other events, filter them by category, city and date, and open a details page for each event. After creating an account and logging in, a user can register for events, avoid duplicate registrations, and track their upcoming and completed events in the My Events page.

## Features

### Authentication
- Register with name, email and password, with inline form validation
- Login and logout
- Login state persists after page refresh (Local Storage)
- Duplicate email detection and clear error messages
- Protected routes: My Events redirects to Login for logged-out users, and returns the user to the page they wanted after login

### Event Exploration
- Browse upcoming events fetched live from Ticketmaster
- Debounced keyword search (no request on every keystroke)
- Category chips (Music, Sports, Arts & Theatre, Film, Miscellaneous)
- Filter by city and date, with a quick "Today" button
- Pagination
- Loading spinner, error message with retry, and empty state

### Event Details
- Event name, image, date and time
- Venue and full location
- Category and genre
- Price range, additional info and notes (when available)
- Direct link to buy tickets on Ticketmaster

### Event Registration
- Register for an event while logged in (guests are sent to Login first)
- Duplicate registration is prevented
- Toast notifications for success and error feedback
- Cancel registration from the details page or My Events
- Each registration is linked to the logged-in user, so different accounts see different registrations

### My Events
- Lists only the current user's registrations
- Upcoming and Completed tabs with counts
- Cancel option for upcoming events, with a confirmation prompt
- Works from a saved snapshot of the event, so it loads without extra API calls

### UI
- Responsive layout for desktop, tablet and mobile
- Reusable components and consistent design

## Tech Stack

| Technology | Purpose |
|---|---|
| React (Vite) | UI library and build tool |
| Redux Toolkit | Global state management |
| React-Redux | `useSelector` and `useDispatch` hooks |
| React Router | Client-side routing |
| Ticketmaster Discovery API | Event data |
| Local Storage | Persisting users, login session and registrations |
| CSS | Custom responsive styling |

## Screenshots

> Add screenshots in a `screenshots/` folder and link them here, for example:

```
![Events page](screenshots/events.png)
![Event details](screenshots/details.png)
![My Events](screenshots/my-events.png)
```

## Project Structure

```
src/
  app/
    store.js                  Redux store (configureStore)
  features/
    auth/authSlice.js         Users, login session, errors
    events/eventsSlice.js     Event list, details, categories (async thunks)
    registrations/
      registrationsSlice.js   Registrations per user
  components/
    Navbar, EventCard, SearchBar, Filters, Pagination,
    Loader, ErrorMessage, Toast, ProtectedRoute
  pages/
    Login, Register, Events, EventDetails, MyEvents
  services/
    ticketmaster.js           API calls to Ticketmaster
  hooks/
    useDebounce.js
  utils/
    storage.js                Local Storage helpers
    validators.js             Form validation
    eventHelpers.js           Image, date, venue, price helpers
```

## Redux Architecture

The store is created with `configureStore` and contains three slices created with `createSlice`.

| Slice | State | Main actions |
|---|---|---|
| `auth` | `user`, `users`, `isAuthenticated`, `error` | `register`, `login`, `logout`, `clearError` |
| `events` | `items`, `page`, `totalPages`, `loading`, `error`, `selected`, `categories` | `fetchEvents`, `fetchEventById`, `fetchCategories` (async thunks) |
| `registrations` | `items` (userId, eventId, registeredAt, eventSnapshot) | `registerForEvent`, `cancelRegistration` |

Components read state with `useSelector` and trigger changes with `useDispatch`. Authentication and registrations are mirrored to Local Storage so they survive a page refresh.

## Routes

| Path | Page | Access |
|---|---|---|
| `/` | Redirects to `/events` | Public |
| `/events` | Event listing with search and filters | Public |
| `/events/:id` | Event details and registration | Public (login needed to register) |
| `/login` | Login | Public |
| `/register` | Register | Public |
| `/my-events` | My registered events | Protected |

## Ticketmaster API Usage

| Purpose | Endpoint |
|---|---|
| Event list, search and filters | `/discovery/v2/events.json` (`keyword`, `classificationName`, `city`, `startDateTime`, `localStartDateTime`, `page`, `size`, `sort`) |
| Event details | `/discovery/v2/events/{id}.json` |
| Categories | `/discovery/v2/classifications.json` |

Requests are made with the `apikey` query parameter. The API allows 5,000 requests per day and 2 requests per second, which is why search input is debounced.

## Getting Started

### Prerequisites
- Node.js 18 or later
- A free Ticketmaster developer account

### Installation

1. Clone the repository
```bash
   git clone https://github.com/anoor378/event-management-system.git
   cd event-management-system
```
2. Install dependencies
```bash
   npm install
```
3. Create your `.env` file (see below)
4. Start the development server
```bash
   npm run dev
```
5. Open the URL shown in the terminal (usually http://localhost:5173)

### Build for production
```bash
npm run build
npm run preview
```

## Environment Variables

1. Register at https://developer.ticketmaster.com/ and create an app.
2. Copy the **Consumer Key**.
3. Copy `.env.example` to `.env` in the project root and add your key:

```
VITE_TM_API_KEY=your_consumer_key_here
```

The `.env` file is listed in `.gitignore` and must never be committed.

## Design Decisions

- **Registration snapshot:** each registration stores the event name, image, date and venue. My Events therefore renders instantly and still shows events that may later disappear from the API.
- **Debounced search:** search and city inputs wait 500 ms after typing stops, to stay within the API rate limit.
- **Safe user object:** the logged-in user stored in state and Local Storage does not contain the password.
- **Upcoming safety filter:** events whose date has already passed are filtered out on the client in addition to the API date query.
- **Feature branches and pull requests:** every feature was developed in its own branch and merged through a pull request.

## Known Limitations

- Authentication is a **frontend simulation only**. Users and passwords are stored in Local Storage in plain text for demo purposes. A real application would use a backend and hashed passwords.
- The Completed tab stays empty until a registered event's date has passed, because the API returns upcoming events.
- Data is stored per browser, so accounts and registrations do not sync across devices.

## Author

**Areeba Noor**
GitHub: [@anoor378](https://github.com/anoor378)