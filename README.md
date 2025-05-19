# ReelBoxd

### Tech Stack

- **Frontend:** ReactJS, TailwindCSS, DaisyUI
- **Backend:** ExpressJS
- **Database:** PostgreSQL
- **Third party APIs:** TMDb API

---

---

### Fonts

- **Poppins** - Primary UI font
- **Cinzel** - Headings/Titles

---

---

### Database Schema

#### Users:

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(30) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  avatar TEXT DEFAULT NULL,
  bio TEXT DEFAULT '',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

#### Movies:

```sql
CREATE TABLE movies (
  id SERIAL PRIMARY KEY,
  tmdb_id INTEGER UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  overview TEXT,
  poster_path TEXT,
  backdrop_path TEXT,
  release_date DATE,
  runtime INTEGER,
  status TEXT
);
```

---

### Reviews

```sql
CREATE TABLE reviews (
id SERIAL PRIMARY KEY,
user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
tmdb_id INTEGER NOT NULL,
rating INTEGER CHECK (rating BETWEEN 0 AND 5) NOT NULL,
content TEXT,
reviewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
UNIQUE (user_id, tmdb_id)
);
```

```sql
CREATE TABLE review_likes (
id SERIAL PRIMARY KEY,
user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
review_id INTEGER REFERENCES reviews(id) ON DELETE CASCADE,
liked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
UNIQUE (user_id, review_id)
);
```

---

---

### API Routes

#### Auth Routes

- `/api/v1/auth/signup` `POST`

  - for registering new users.
  - validates usernames (checks if username already exists).

- `/api/v1/auth/login` `POST`

  - logging in user.

- `/api/v1/auth/logout` `POST`
  - log out user.

---

---

### File Structure - with Description

#### Frontend

##### `components/`

###### `advertisements/`

- **`LargeAd.jsx`**
  - Displays a large advertisement banner (`950px × 100px`).
  - Currently, this links to my personal portfolio since the project is not monetized. The ad serves as a placeholder, aligning with the Letterboxd aesthetic for portfolio purposes.

###### `films/`

Components for the `Films.jsx` page.

- **`JustReviewed.jsx`**

  - Fetches and displays recently reviewed movies. Only posters are shown in a 12-column CSS grid layout.

- **`PopularMovies.jsx`**

  - Fetches and displays the most popular movies this week. Uses flexbox to show the top 4 movies in a row.

- **`PopularReviews.jsx`**
  - Fetches and displays the most liked reviews from this week.

###### `homepage/`

Components for the `Home.jsx` page.

- **`Login.jsx`**

  - Contains the login form UI and logic.

- **`SignUp.jsx`**
  - Contains the sign-up form with optional avatar and bio fields.

###### `movie/`

Components for the `Movie.jsx` page.

- **`MovieInfo.jsx`**

  - Fetches and displays detailed information about a specific movie selected by the user.

- **`MovieLatestReviews.jsx`**
  - Used by `MovieInfo.jsx` to fetch and display the latest reviews for the current movie.

###### `posters/`

Components used to display movie posters in different sizes.

- **`PosterLarge.jsx`**

  - Displays large posters (`345px × 230px`), used primarily in featured sections.

- **`PosterSmall.jsx`**
  - Displays smaller posters (`105px × 75px`), used in compact review or listing views.
