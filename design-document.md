# Project 3: BookVerse — Design Document

**Author:** Nakul Shivaraj  
**Class:** CS 5010 — MSCS, Northeastern University, Oakland  
**Date:** November 2025  

---

## 1. Project Description
BookVerse is a full-stack web application that allows users to maintain and explore a personal digital library while sharing community reviews.  
The platform lets users catalog books, track ratings, and read or write reviews.  
It is built using **Node.js + Express** for the backend, **MongoDB Atlas** for data storage, and **React (Hooks)** for the frontend with client-side rendering and AJAX calls.

The app handles two MongoDB collections:
- **books** → stores book metadata such as title, author, genre, rating, and cover image  
- **reviews** → stores reviews linked to a specific book via `bookId`

### Key Features
- CRUD operations for both books and reviews  
- Dynamic rating updates based on community reviews  
- Responsive grid-based UI with clean visual hierarchy  
- Modal pop-ups for book creation and edit forms  
- Search, sort, and genre-based filtering  
- ESLint & Prettier configuration for consistent code quality  
- Deployed backend and frontend on public servers  

---

## 2. User Personas

- **Persona 1 — Avid Reader:**  
  Loves reading across genres and wants a personal online shelf to keep track of favorite titles and ratings.

- **Persona 2 — Casual Reviewer:**  
  Occasionally reviews books after finishing them. Prefers a simple interface without login hassles.

- **Persona 3 — Book Club Member:**  
  Uses the app to browse and share opinions on books with friends. Needs quick filters and responsive design on mobile.

---

## 3. User Stories

- As a reader, I want to **add and categorize books** so that I can build my personal library.  
- As a user, I want to **view detailed descriptions and ratings** of books before adding them to my reading list.  
- As a reviewer, I want to **write and edit reviews** for books I’ve read so others can see my feedback.  
- As a visitor, I want to **browse by genre or top ratings** to find interesting books.  
- As a user, I want **real-time updates** on book ratings after reviews are submitted.  
- As a mobile user, I want a **responsive layout** that adapts to my screen size.

---

## 4. Design Mockups

### Homepage (Book Grid)
- Navbar → Title “📚 BookVerse” + “➕ Add Book” button.  
- Search bar and genre filter.  
- Card grid displaying cover, title, author, genre, and rating stars.  
- Hover effects and clickable links to each book’s detail page.  

### Book Detail Page
- Header section → book image, title, author, genre, and rating.  
- Description and edit/delete buttons.  
- Community Reviews section:
  - Add Review form with star rating.
  - Review cards with edit/delete actions.
  - Scrollable container for large review lists.

### Responsive Layout
- Two-column layout on desktop (Book Info ↔ Reviews).  
- Single-column stacked view on tablet and mobile.  
- Sticky navbar for easy navigation.  

---

## 5. Database Schema

### Collection 1 — books
| Field | Type | Description |
|--------|------|-------------|
| `_id` | ObjectId | Unique ID |
| `title` | String | Book title |
| `author` | String | Book author |
| `genre` | String | Book category |
| `rating` | Number | Average rating (auto-updated) |
| `coverImage` | String | Optional image URL |
| `description` | String | Optional book summary |
| `createdAt` | Date | Creation timestamp |

### Collection 2 — reviews
| Field | Type | Description |
|--------|------|-------------|
| `_id` | ObjectId | Unique ID |
| `bookId` | ObjectId | Linked book’s ID |
| `rating` | Number | User’s rating |
| `content` | String | Review text |
| `createdAt` | Date | Timestamp of creation |

---

## 6. Architecture Overview
**Frontend:**
- React functional components using Hooks (`useState`, `useEffect`).  
- Components: `BookCard`, `BookDetailPage`, `BookForm`, `BookReviews`.  
- CSS modularized per component.  
- Vite for fast dev server and build optimization.

**Backend:**
- Node.js + Express server with modular routes (`books.js`, `reviews.js`).  
- MongoDB native driver (no Mongoose).  
- Separate database connection module in `/db/connect.js`.  
- RESTful API design for CRUD operations.

**Database:**
- MongoDB Atlas cluster for cloud storage.  
- Two collections (`books`, `reviews`) with interlinked relationships.  
- Review CRUD triggers rating recalculation on each change.

---

## 7. Future Improvements
- Add user authentication with JWT or OAuth for personalized libraries.  
- Implement dark/light theme toggle.  
- Integrate a recommendation system based on genres or average ratings.  
- Add pagination and review sorting (latest/top).  
- Allow image uploads for book covers.  
- Add “Favorites” and “Currently Reading” lists per user.

---

## 8. Testing & Validation
- Manual and functional testing of CRUD operations for both collections.  
- Verified responsive layout on multiple devices and browsers.  
- ESLint run with no critical warnings.  
- Code formatted with Prettier.  
- MongoDB Atlas validated to handle 1K+ records.

---

## 9. Deployment
- **Frontend:** Netlify (React + Vite build).  
- **Backend:** Render (Node + Express).  
- **Database:** MongoDB Atlas.  
- App verified for public access and proper API routing between frontend & backend.

---

## 10. GenAI Usage & Attribution
Tool: **ChatGPT (GPT-5, November 2025)**  

Used for:
- Optimizing component structure and styling responsiveness.  
- Generating documentation sections (personas, stories, schema).  
- Debugging API integration errors between Vite frontend and Express backend.  

All outputs were reviewed and manually refined before inclusion.
