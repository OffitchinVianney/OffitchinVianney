import csrf from 'csurf';

// CSRF token stocké en cookie + validation dans header x-csrf-token.
export const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    sameSite: 'strict',
    secure: false
  }
});
