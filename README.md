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
