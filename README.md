# 🔗 URL Shortener

A full-stack URL shortening application built with **FastAPI, SQLite, JWT authentication, and React**.

The application allows users to create short URLs, generate custom aliases, manage their URLs, track click counts, and generate QR codes for their shortened links.

## 🌐 Live Demo

**Frontend:** https://url-shortner-rho-lac.vercel.app

The application is deployed with:
- **Frontend:** Vercel
- **Backend:** Render
- **Database:** SQLite

## ✨ Features

* 🔗 **URL Shortening**

  * Convert long URLs into short, shareable links.
  * Automatically generates a unique short code.

* 🎨 **Custom URL Aliases**

  * Create personalized short URLs instead of using randomly generated codes.
  * Update an existing custom URL code when required.

* 🔐 **User Authentication**

  * User registration and login.
  * Passwords are securely hashed using `bcrypt`.
  * JWT-based authentication protects user-specific operations.
  * JWT tokens expire after 30 minutes.

* 📊 **URL Dashboard**

  * View the user's URL information.
  * Track click counts.
  * Dashboard displays the top URLs based on click count.

* 📈 **Click Tracking**

  * Every successful redirect increments the corresponding URL's click count.

* 🗑️ **URL Management**

  * View all URLs created by the authenticated user.
  * Delete URLs.
  * Update custom URL codes.

* 📱 **QR Code Generation**

  * A QR code is automatically generated whenever a short/custom URL is created.
  * QR codes can be accessed through the application.

* 🛡️ **Input Validation**

  * URL validation using Pydantic `HttpUrl`.
  * Email validation.
  * Password format validation.
  * Custom URL length validation.

* 🌐 **React Frontend**

  * React-based frontend built with Vite.
  * React Router is used for client-side routing.
  * Communicates with the FastAPI backend.

* 🧪 **Backend Testing**

  * API tests implemented using `pytest` and FastAPI's `TestClient`.

## 🛠️ Tech Stack

### Backend

| Technology    | Purpose                         |
| ------------- | ------------------------------- |
| Python        | Backend language                |
| FastAPI       | REST API framework              |
| Pydantic      | Request/data validation         |
| SQLite        | Database                        |
| PyJWT         | JWT authentication              |
| bcrypt        | Password hashing                |
| python-dotenv | Environment variable management |
| qrcode        | QR code generation              |
| Pillow        | QR code image handling          |
| Uvicorn       | ASGI server                     |
| pytest        | Testing                         |

### Frontend

| Technology   | Purpose                            |
| ------------ | ---------------------------------- |
| React        | Frontend UI                        |
| Vite         | Frontend development/build tooling |
| React Router | Client-side routing                |
| JavaScript   | Frontend logic                     |
| CSS          | Styling                            |

The backend dependencies are defined in `requirements.txt`, while the frontend uses React 19, React Router, and Vite.

## 🏗️ Project Structure

```text
Url-shortner/
│
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── QR_codes/
│   └── *.png
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── tests/
│   ├── __init__.py
│   └── test_main.py
│
├── database.py
├── main.py
├── model.py
├── security.py
├── utils.py
├── validation.py
├── requirements.txt
└── .gitignore
```

The repository separates the frontend from the FastAPI backend, while the backend keeps database, validation, security, utility, and API logic in separate modules.

## ⚙️ Backend Architecture

The main backend components are:

### `main.py`

Contains the FastAPI application and API endpoints.

It handles:

* Application startup
* CORS configuration
* Authentication endpoints
* URL shortening
* Custom URL creation
* URL retrieval/redirection
* URL deletion
* URL updates
* Dashboard data

The application also serves generated QR-code images through `/QR_codes`.

### `database.py`

Handles SQLite database operations.

Two primary tables are used:

```text
USERS
├── UID
├── NAME
├── EMAIL
└── PASSWORD

URL_MAPPING
├── UID
├── CUSTOMIZED_CODE
├── ORIGINAL_URL
├── CREATED_AT
└── CLICK_COUNT
```

The `URL_MAPPING.UID` field associates each shortened URL with its owner.

### `model.py`

Defines the Pydantic request models used by the API:

* `URL`
* `UserAccount`
* `LoginAccount`

URLs are validated using Pydantic's `HttpUrl` type.

### `validation.py`

Responsible for:

* Email validation
* Password validation
* Password hashing
* Password verification
* Account validation
* Login verification
* Custom URL validation

Passwords are hashed using `bcrypt` before being stored in the database.

### `security.py`

Implements JWT authentication.

The login process creates a JWT containing the user's ID and name. Tokens use `HS256` and have a **30-minute expiration time**. Protected endpoints use the JWT dependency to identify the authenticated user.

### `utils.py`

Contains utility functions for:

* Generating random short codes
* Extracting short codes
* Generating QR codes
* Deleting QR codes

Automatically generated short codes consist of letters and digits.

---

# 🚀 Getting Started

## Prerequisites

Make sure you have installed:

* Python 3.9+
* Node.js and npm
* Git

## 1. Clone the repository

```bash
git clone https://github.com/Jayaram-11/Url-shortner.git
cd Url-shortner
```

## 2. Create a Python virtual environment

### Windows

```bash
python -m venv .venv
```

Activate it:

```bash
.venv\Scripts\activate
```

### Linux/macOS

```bash
python3 -m venv .venv
source .venv/bin/activate
```

## 3. Install backend dependencies

```bash
pip install -r requirements.txt
```

## 4. Configure environment variables

Create a `.env` file in the project root:

```env
SECRET_KEY=your-secret-key
DOMAIN=http://127.0.0.1:8000
```

`SECRET_KEY` is used for signing JWT tokens.

`DOMAIN` is used when constructing shortened URLs and QR-code URLs.

**Do not commit your `.env` file to Git.**

## 5. Start the backend

Run:

```bash
uvicorn main:app --reload
```

The backend will normally be available at:

```text
http://127.0.0.1:8000
```

The SQLite database is created automatically when the application starts.

## 6. Start the frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Vite will provide the local frontend development URL.

---

# 🔌 API Endpoints

## Health Check

```http
GET /
```

Returns:

```json
{
  "status": "ok"
}
```

## Create Account

```http
POST /create-account
```

Example:

```json
{
  "name": "John",
  "email": "john@example.com",
  "password": "Test@123"
}
```

## Login

```http
POST /login
```

The endpoint uses OAuth2 password-form data.

Example:

```text
username=john@example.com
password=Test@123
```

On successful authentication, the API returns a JWT access token.

## Get User URLs

```http
GET /my-urls
```

Requires authentication.

Returns URLs belonging to the authenticated user.

## Shorten URL

```http
POST /shorten-url
```

Requires authentication.

Example:

```json
{
  "url": "https://example.com/some/very/long/url"
}
```

A generated short code is returned along with the shortened URL.

## Create Custom URL

```http
POST /customize-url
```

Requires authentication.

Example parameters:

```text
custom_code=my-link
original_url=https://example.com
```

The resulting URL will be similar to:

```text
http://127.0.0.1:8000/my-link
```

Custom codes are validated for length before being stored.

## Dashboard

```http
GET /dashboard
```

Requires authentication.

Returns dashboard information for the authenticated user, including the most-clicked URLs.

## Redirect

```http
GET /{short_code}
```

Opening a valid shortened URL redirects the user to the original URL.

Each successful redirect increments the URL's click count.

## Delete URL

```http
DELETE /{custom_code}
```

Requires authentication.

Deletes a URL belonging to the authenticated user and removes its corresponding QR code.

## Update Custom URL

```http
PATCH /{old_custom_code}
```

Requires authentication.

Example:

```text
new_custom_code=my-new-link
```

Updates the custom code associated with the URL.

---

# 🔄 How It Works

### Creating a Short URL

```text
User
  │
  ▼
React Frontend
  │
  │ POST /shorten-url
  ▼
FastAPI
  │
  ├── Validate JWT
  │
  ├── Validate URL
  │
  ├── Generate unique short code
  │
  ▼
SQLite
  │
  └── Store URL mapping
  │
  ▼
Generate QR Code
  │
  ▼
Return Short URL
```

### Opening a Short URL

```text
User opens /ABC123
        │
        ▼
FastAPI
        │
        ▼
Find ABC123 in SQLite
        │
        ├── Not found → 404
        │
        ▼
Increment click count
        │
        ▼
302 Redirect
        │
        ▼
Original URL
```

The backend generates a random short code and retries if the generated code already exists in the database.

---

# 🧪 Running Tests

The project uses `pytest` with FastAPI's `TestClient`.

From the project root:

```bash
pytest
```

The current test suite includes validation tests for invalid email formats, invalid passwords, and invalid login credentials.

---

# 🔐 Security

The project includes several security mechanisms:

* Password hashing with `bcrypt`
* JWT-based authentication
* JWT expiration
* Protected user-specific endpoints
* URL ownership checks before deletion/update
* Input validation using Pydantic
* Email validation
* Password strength validation
* Secrets loaded through environment variables

The JWT secret should always be supplied through the environment rather than committed to source control.

---

# 🌐 Frontend

The frontend is located in the `frontend/` directory and is built with React and Vite.

Its source is organized into:

```text
src/
├── assets/
├── components/
├── context/
├── pages/
├── services/
├── utils/
├── App.jsx
├── App.css
├── index.css
└── main.jsx
```

The frontend communicates with the FastAPI backend and provides the user-facing interface for authentication and URL management.

---

# 📱 QR Codes

Every newly created shortened or customized URL can have a corresponding QR code generated by the backend.

QR codes are stored inside:

```text
QR_codes/
```

and are served by FastAPI under:

```text
/QR_codes/<short_code>_qrcode.png
```

The QR-code generation functionality is implemented using the `qrcode` and `Pillow` packages.

---

# 🚧 Future Improvements

Some possible improvements for future versions include:

- Email ownership verification using OTP
- Password reset via email
- Expiring URLs
- Rate limiting
- More detailed URL analytics
- Redis caching
- PostgreSQL for production-scale persistence
- Docker support
- Expanded automated test coverage
---

# 📄 License

This project does not currently specify a license.

If you intend to make the project open source, consider adding an appropriate license such as MIT.

---

## 👨‍💻 Author

**Jayaram**

GitHub: [Jayaram-11](https://github.com/Jayaram-11)
