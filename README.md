# BookVerse

**Author:** Nakul S  
**Class:** MSCS — Web Development Project 3  
**Objective:** Build a full-stack CRUD web application using Node.js, Express, MongoDB, and Vanilla JavaScript to manage a personal book collection. Users can add, edit, and delete books with details like title, author, genre, and reading status.

## Features
- Two MongoDB collections:
    - books — for book details (title, author, genre, status, notes)
    - genres — for categorizing books
- RESTful API built with Express using MongoDB native driver
- Client-side rendering using Vanilla JavaScript
- Organized folder structure:
  - /db (MongoDB connection)
  - /routes (API endpoints)
- Pagination support
- Cascade operations between collections
- ESLint & Prettier configured

## Setup Instructions
1. Clone the repository
2. Install dependencies:
    ```
    npm install
    ```
3. Ensure MongoDB is running locally
4. Start the server:
    ```
    node server.js
    ```
5. Visit http://localhost:3000

## Accessibility Features
- Semantic HTML5 elements
- ARIA labels where needed
- Responsive design
- Keyboard navigation
- Form validation
- High contrast colors

## GenAI Usage & Attribution
- Tool: **ChatGPT (GPT-5 )** - used to streamline backend logic, pagination handling, and improve documentation clarity.

I used ChatGPT to assist with:
   - Implementing frontend pagination and edit/delete confirmation modals.
   - Generating the README.md, DESIGN_DOCUMENT.md, and LICENSE structure for rubric compliance.
   - Code review and removing unwanted code.

### Example Prompts
- Implement pagination component with items per page selector
- Show how to render data dynamically and cards can be added in UI with JS
- Create a rubric-ready README for a Node + Mongo full-stack app.
- Review my code and check if statisfies the rubric or not.

All AI-generated code was reviewed, tested, and manually refined before inclusion.

## License
MIT License

## Screenshots
![Homepage](./screenshots/home.png)
![Add Book](./screenshots/add-book.png)
![Manage Genres](./screenshots/genres.png)

## Demo video
Watch a short walkthrough: ![Watch the video](./Demo.mp4)

## How to Use BookVerse
1. **Add a Book**
- Click the **"+ Add Book"** button in the top navigation bar
- Fill in the book details:
  - **Title*** (required)
  - **Author*** (required)
  - Genre (optional - e.g., Fiction, Sci-Fi)
  - Rating (1-5 stars)
  - Cover Image URL (optional)
  - Description (optional)
- Click **"➕ Add Book"** to save
- The book card appears instantly in your library

2. **Browse Your Library**
- **Search**: Type in the search bar to find books by title or author
- **Filter by Genre**: Click genre buttons (All, Fiction, Sci-Fi, Mystery, History, Fantasy, Romance)
- **Sort**: Choose from Latest, Rating, or Title (A-Z) in the dropdown
- **View Stats**: See total books found and average rating at the top

3. **View Book Details**
- Click **"View Details →"** on any book card
- See complete book information including:
  - Full description
  - Cover image
  - All book metadata
  - Community reviews with ratings
- Page displays book info on the left, reviews on the right

4. **Write & Manage Reviews**
- On the book detail page, scroll to **"Community Reviews"**
- **Add Review**:
  - Click stars to rate (1-5)
  - Write your thoughts in the text box
  - Click **"+ Add Review"**
- **Edit Review**: Click **"✏️ Edit"** button, modify text/rating, click **"💾 Save"**
- **Delete Review**: Click **"🗑️ Delete"** button
- Book ratings automatically update based on all reviews

5. **Edit a Book**
- Go to the book detail page
- Click **"✏️ Edit"** button
- Modify any field (title, author, genre, rating, cover, description)
- Click **"💾 Save Changes"**
- Updates appear immediately

6. **Delete a Book**
- **From Home Page**: Click **"🗑️ Delete"** on any book card
- **From Detail Page**: Click **"🗑️ Delete"** button
- Confirm deletion in the popup
- Book and all its reviews are permanently removed

7. **Navigate Multiple Pages**
- At the bottom of the book grid, use pagination controls:
  - Select items per page: **5, 10, or 20**
  - View current range: "1-10 of 50"
  - Click **"← Prev"** or **"Next →"** to browse pages
  - Page counter shows: "Page 1 of 5"
- Changing filters/search automatically resets to page 1
- Smooth scroll to top when changing pages

8. **Responsive Design**
- **Desktop**: Side-by-side layout for book details and reviews
- **Tablet**: Stacked layout with optimized spacing
- **Mobile**: Full-width cards and buttons for easy touch navigation

Changes reflect immediately through dynamic rendering.