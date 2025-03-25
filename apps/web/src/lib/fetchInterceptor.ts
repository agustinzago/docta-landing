import { authService } from './authService';

/**
 * Un cliente fetch mejorado que maneja automáticamente la renovación de tokens
 * si una solicitud falla debido a un token expirado.
 */
export async function fetchWithAuth(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  // Asegurarse de que se incluyan las credenciales para las cookies
  const fetchOptions: RequestInit = {
    ...options,
    credentials: 'include',
  };

  // Realizar la solicitud inicial
  let response = await fetch(url, fetchOptions);

  // Si el token ha expirado (401), intentar renovarlo y reintentar
  if (response.status === 401) {
    const refreshSuccess = await authService.refreshToken();

    if (refreshSuccess) {
      // Reintentar la solicitud original con el nuevo token
      response = await fetch(url, fetchOptions);
    }
  }

  return response;
}
