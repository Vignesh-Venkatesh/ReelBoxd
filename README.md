# ReelBoxd

> **_NOTE:_** The `README` is bound to change.

## API Endpoints

### Auth

`POST /auth/register`

- Auth: Not Required
- Description: Registering a new user
- Status: _Incomplete_

`POST /auth/login`

- Auth: Not Required
- Description: Logs in user
- Status: _Incomplete_

`POST /auth/logout`

- Auth: Required
- Description: Logs out user
- Status: _Incomplete_

`GET /auth/me`

- Auth: Required
- Description: Returns the current authenticated user
- Status: _Incomplete_

---

### User

`GET /users/:username`

- Auth: Not Required
- Description: Gets public profile of the user
- Status: _Incomplete_

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
- Status: _Incomplete_

`GET /movies/popular`

- Auth: Not Required
- Query: `?page=1&limit=20`
- Description: Gets trending/popular movies
- Status: _Incomplete_

`GET /movies/search`

- Auth: Not Required
- Query: `?movie=Example`
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
