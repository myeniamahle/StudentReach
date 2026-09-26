# StudentReach

```text
frontend/
  assets/                              # Browser assets, for example assets/logo.png
  src/loginpage/page.example.js        # Example login page; not connected yet
  src/services/auth.js                 # Add shared sign-in/current-user API calls here
  styles/                              # Browser styles and design tokens

backend/
  src/auth/login.example.js            # Example auth route; not mounted or functional
  src/server.js                        # Express app and current API routes
  src/db.js                            # PostgreSQL connection pool
  src/repository.js                    # Student data access
  src/detection.js                     # Pure student risk rules
  src/runDetection.js                  # Detection orchestration and persistence
  src/seed.js                          # Synthetic development data
  tests/                               # Node.js tests
  sql/schema.sql                       # Destructive development schema bootstrap
```

```text
# Example files explain placement in source comments; they are not production code.
# Register active API routes in backend/src/server.js and enforce access server-side.
# backend/sql/schema.sql and npm run seed replace data: use only with disposable DBs.
# Put DATABASE_URL in local .env; never commit credentials.
# Commands: npm run dev | npm start | npm test | npm run seed | npm run detect
```