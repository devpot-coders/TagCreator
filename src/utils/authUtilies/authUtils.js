/**
 * Checks if user is authenticated
 */
export function isAuthenticated() {
    const token = getLocalStorage('accessToken');
    return !!token;
  }
  
  /**
   * Handles logout
   * @param {Function} redirectFn - Function to redirect after logout
   */
  export function handleLogout(redirectFn = null) {
    removeLocalStorage('accessToken');
    removeLocalStorage('userData');
    if (redirectFn) redirectFn('/login');
  }
  
  /**
   * Redirects if not authenticated (for Next.js)
   * @param {Object} context - Next.js context
   * @param {string} redirectTo - Path to redirect to
   */
  export function redirectIfUnauthenticated(context, redirectTo = '/login') {
    const token = getLocalStorage('accessToken');
    if (!token && context.res) {
      context.res.writeHead(302, { Location: redirectTo });
      context.res.end();
    }
    return { props: {} };
  }