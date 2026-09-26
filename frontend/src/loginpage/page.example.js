// EXAMPLE ONLY: this page is not connected to a frontend app or build tool yet.
export function renderLoginPage(container) {
  container.innerHTML = `
    <main>

    </main>
  `;
}

/*
Placement notes:
- Keep the login screen and its form behavior in this folder.
- Move the fetch call into frontend/src/services/auth.js when that service exists.
- The backend must validate credentials and enforce access on every protected API.
- Do not store passwords or session tokens in browser storage.
- Connect and style this example only after selecting the frontend framework/build tool.
*/
