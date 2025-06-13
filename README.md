# ReelBoxd

> **_NOTE:_** The `README` is bound to change.

## Schema

### Users

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(30) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    bio TEXT DEFAULT '',
    avatar_url TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT now()
);
```

### Movies

```sql
CREATE TABLE movies (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  original_title TEXT,
  overview TEXT,
  poster_path TEXT,
  backdrop_path TEXT,
  release_date DATE,
  status TEXT
);
```

---

## API Endpoints

### Auth

`POST /auth/register`

- Auth: Not Required
- Description: Registering a new user (username, password, avatar, bio)
- Status: _Complete_

`POST /auth/login`

- Auth: Not Required
- Description: Logs in user
- Status: _Complete_

`POST /auth/logout`

- Auth: Required
- Description: Logs out user
- Status: _Complete_

`GET /auth/me`

- Auth: Required
- Description: Returns the current authenticated user
- Status: _Complete_

---

### User

`GET /users/:username`

- Auth: Not Required
- Description: Gets public profile of the user
- Status: _Complete_

`GET /users/:username/reviews`

- Auth: Not Required
- Description: Gets users reviews
- Status: _Incomplete_

`GET /users/:username/watched`

- Auth: Not Required
- Description: Gets users watched films
- Status: _Incomplete_

`GET /users/:username/liked`

- Auth: Not Required
- Description: Gets users liked films
- Status: _Incomplete_

`GET /users/:username/watch_later`

- Auth: Not Required
- Description: Gets users watch later films
- Status: _Incomplete_

`PUT /users/me`

- Auth: Required
- Description: updates current user's profile
- Status: _Incomplete_

---

### Movies

`GET /movies/:id`

- Auth: Not Required
- Description: Gets full info on a movie (title, poster, genres, year, etc.)
- Status: _Complete_

`GET /movies/popular`

- Auth: Not Required
- Query: `?page=x`
- Description: Gets trending/popular movies
- Status: _Complete_

`GET /movies/popular`

- Auth: Not Required
- Query: `?page=x`
- Description: Gets now showing movies
- Status: _Complete_

`GET /movies/search`

- Auth: Not Required
- Query: `?movie=Example&page=x`
- Description: Search movies by title
- Status: _Incomplete_

`GET /movies/:id/reviews`

- Auth: Not Required
- Description: Get all reviews for a movie
- Status: _Incomplete_

---

### Reviews

`POST /reviews`

- Auth: Required
- Description: Post a review for a movie
- Status: _Incomplete_

`PUT /reviews/:id`

- Auth: Required
- Description: Update own review
- Status: _Incomplete_

`DELETE /reviews/:id`

- Auth: Required
- Description: Delete own review
- Status: _Incomplete_

`GET /reviews/:id`

- Auth: Not Required
- Description: Get single review by ID
- Status: _Incomplete_

`GET /me/reviews`

- Auth: Required
- Description: Get authenticated user's own reviews
- Status: _Incomplete_
