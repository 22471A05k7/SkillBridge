class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function getCsrfToken() {
  let response
  try {
    response = await fetch('/api/auth/csrf', { credentials: 'include' })
  } catch {
    throw new ApiError('Cannot reach the SkillBridge backend. Start Spring Boot on port 8081 and try again.', 0)
  }
  if (!response.ok) throw new ApiError('Unable to connect securely to the SkillBridge backend.', response.status)
  const result = await response.json()
  return result.token
}

export async function apiRequest(path, options = {}) {
  const method = options.method || 'GET'
  const headers = { Accept: 'application/json', ...options.headers }
  const request = { ...options, method, headers, credentials: 'include' }

  if (options.body !== undefined) {
    headers['Content-Type'] = 'application/json'
    request.body = JSON.stringify(options.body)
  }
  if (!['GET', 'HEAD', 'OPTIONS'].includes(method.toUpperCase())) {
    headers['X-XSRF-TOKEN'] = await getCsrfToken()
  }

  let response
  try {
    response = await fetch(`/api${path}`, request)
  } catch {
    throw new ApiError('Cannot reach the SkillBridge backend. Start Spring Boot on port 8081 and try again.', 0)
  }

  if (!response.ok) {
    let message = `Backend request failed (${response.status}).`
    if (response.status === 403) {
      message = 'The backend rejected the CSRF token. Restart Spring Boot and Vite, then reload the page to refresh the session.'
    } else if (response.status === 401 && path === '/auth/login') {
      message = 'Email or password is incorrect. If account creation did not complete, create the account before logging in.'
    }
    try {
      const body = await response.json()
      message = body.detail || body.message || body.error || message
    } catch {
      // Keep the HTTP status message when the server does not return JSON.
    }
    throw new ApiError(message, response.status)
  }
  return response.status === 204 ? null : response.json()
}

export { ApiError }
