# CineMatch Pro

A movie discovery app with TMDB integration, built with a Spring Boot backend and a React frontend.

## Features

- Search movies by title
- Smart genre-based search
- Telugu / Hindi quick filters
- Movie details with director, cast, reviews, and streaming providers
- Recommended movies based on selected movie genres and language
- Login flow with client-side authentication

## Backend

- Java Spring Boot
- Uses TMDB WebClient to fetch movie data
- Endpoints:
  - `/api/movies/search?query=...`
  - `/api/movies/india`
  - `/api/movies/language?lang=...`
  - `/api/movies/filter?genre=...&lang=...`
  - `/api/movies/recommend?lang=...&genre=...`
  - `/api/movies/{id}`

## Frontend

- React + Vite
- Tailwind CSS styling
- React Router for login and movie detail pages

## Run locally

### Backend

```bash
cd backend
mvn spring-boot:run
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```
