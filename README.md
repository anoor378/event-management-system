# EventHub - Event Management System

A React-based event management application built for Web Programming Assignment 2. Users can explore events from the Ticketmaster Discovery API, register for events and manage their registrations.

## Features

- User registration, login and logout (frontend simulation using Redux Toolkit and Local Storage)
- Persistent login across page refresh
- Browse upcoming events from the Ticketmaster Discovery API
- Search events (debounced), filter by category, city and date
- Category chips and pagination
- Event details: name, date and time, venue, location, category, image, price, info, ticket link
- Register for events with duplicate prevention and toast feedback
- Cancel registration
- My Events page with Upcoming and Completed tabs
- Protected routes (My Events requires login)
- Loading, error and empty states, form validation
- Responsive UI

## Tech Stack

- React (Vite)
- Redux Toolkit and React-Redux
- React Router
- Ticketmaster Discovery API

## Project Structure

```
src/
  app/            Redux store
  features/       auth, events, registrations slices
  components/     Navbar, EventCard, SearchBar, Filters, Pagination, Loader, ErrorMessage, Toast, ProtectedRoute
  pages/          Login, Register, Events, EventDetails, MyEvents
  services/       Ticketmaster API calls
  hooks/          useDebounce
  utils/          storage, validators, event helpers
```

## Setup

1. Clone the repository
```
   git clone https://github.com/anoor378/event-management-system.git
   cd event-management-system
```
2. Install dependencies
```
   npm install
```
3. Get a free API key from https://developer.ticketmaster.com/ (use the Consumer Key).
4. Create a `.env` file in the project root (copy `.env.example`):
```
   VITE_TM_API_KEY=your_consumer_key_here
```
5. Start the development server
```
   npm run dev
```
6. Open the URL shown in the terminal (usually http://localhost:5173).

## Notes

- Authentication is a frontend simulation only. Users and passwords are stored in Local Storage in plain text for demo purposes. A real application would use a backend and hashed passwords.
- The Completed tab in My Events stays empty until a registered event's date has passed, because the API only returns upcoming events.
- The `.env` file is not committed to GitHub. Never share your API key.
- Ticketmaster API limits: 5,000 requests/day and 2 requests/second.

## Author

Areeba Noor