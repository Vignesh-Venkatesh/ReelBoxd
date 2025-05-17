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
