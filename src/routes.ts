/**
 * Those are the public routes that should available for loggined user
 * @type {String[]}
 */
export const PROTECTED_ROUTES = ["/"];
/**
 * Those are the protected routes that should be available for any user
 * @type {String[]}
 */
export const PUBLIC_ROUTES = [];

/**
 * those are authentication routes
 * @type {String[]}
 */
export const AUTH_ROUTES = ["/login", "/register"];

/**
 * prefix for api authentication routes
 * @type {String}
 */
export const API_AUTH_PREFIX = "/api/auth";
/**
 * Redirected url after login
 * @type {String}
 */
export const DEFAULT_LOGIN_REDIRECTED = "/";
