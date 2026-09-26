// EXAMPLE ONLY: this file is not mounted by server.js and does not authenticate users.
const express = require('express');

const router = express.Router();

router.post('/login', async (_req, res) => {
  // Replace this response only after credential verification and session creation
  // are implemented in an auth service. Never accept identity from the browser alone.
  return res.status(501).json({ error: 'Authentication is not configured.' });
});

module.exports = router;

/*
Placement notes:
- Keep auth endpoint paths and middleware order in this folder's routes.
- Put password-hash verification and session creation in an auth service.
- Put request/response mapping in a controller when the feature grows.
- Mount the completed router once from ../server.js.
- Add tests under backend/tests before enabling the endpoint.
*/
