import { ApiError, ApiErrorType } from "./api";

// Utilidades para el manejo de errores de la API
export class ApiErrorUtils {
  /**
   * Obtiene un mensaje de error amigable para el usuario
   */
  static getUserFriendlyMessage(error: ApiError): string {
    switch (error.type) {
      case ApiErrorType.NETWORK_ERROR:
        return "Error de conexión. Verifica tu conexión a internet e intenta nuevamente.";

      case ApiErrorType.AUTHENTICATION_ERROR:
        return "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.";

      case ApiErrorType.AUTHORIZATION_ERROR:
        return "No tienes permisos para realizar esta acción.";

      case ApiErrorType.VALIDATION_ERROR:
        return "Los datos ingresados no son válidos. Por favor, verifica la información.";

      case ApiErrorType.SERVER_ERROR:
        return "Error interno del servidor. Por favor, intenta más tarde.";

      case ApiErrorType.SERVICE_UNAVAILABLE:
        return "El servicio no está disponible en este momento. Por favor, intenta más tarde.";

      case ApiErrorType.UNKNOWN_ERROR:
      default:
        return "Ha ocurrido un error inesperado. Por favor, intenta nuevamente.";
    }
  }

  /**
   * Verifica si el error requiere que el usuario se autentique nuevamente
   */
  static requiresReauthentication(error: ApiError): boolean {
    return error.type === ApiErrorType.AUTHENTICATION_ERROR;
  }

  /**
   * Verifica si el error es recuperable (puede reintentarse)
   */
  static isRecoverable(error: ApiError): boolean {
    return [
      ApiErrorType.NETWORK_ERROR,
      ApiErrorType.SERVER_ERROR,
      ApiErrorType.SERVICE_UNAVAILABLE,
      ApiErrorType.UNKNOWN_ERROR,
    ].includes(error.type);
  }

  /**
   * Obtiene el tiempo de espera recomendado antes de reintentar
   */
  static getRetryDelay(error: ApiError): number {
    switch (error.type) {
      case ApiErrorType.NETWORK_ERROR:
        return 2000; // 2 segundos

      case ApiErrorType.SERVER_ERROR:
        return 5000; // 5 segundos

      case ApiErrorType.SERVICE_UNAVAILABLE:
        return 10000; // 10 segundos

      default:
        return 3000; // 3 segundos
    }
  }

  /**
   * Formatea el error para logging
   */
  static formatForLogging(error: ApiError, context?: string): string {
    const timestamp = error.timestamp.toISOString();
    const contextStr = context ? `[${context}]` : "";

    return `${contextStr} ${timestamp} - ${error.type}: ${error.message}${
      error.statusCode ? ` (${error.statusCode})` : ""
    }`;
  }

  /**
   * Crea un error de red personalizado
   */
  static createNetworkError(message?: string): ApiError {
    return {
      type: ApiErrorType.NETWORK_ERROR,
      message: message || "Error de conexión de red",
      timestamp: new Date(),
    };
  }

  /**
   * Crea un error de autenticación personalizado
   */
  static createAuthError(message?: string): ApiError {
    return {
      type: ApiErrorType.AUTHENTICATION_ERROR,
      message: message || "Error de autenticación",
      timestamp: new Date(),
    };
  }
}

// Hook personalizado para manejar errores de API
export const useApiErrorHandler = () => {
  const handleError = (error: ApiError, context?: string) => {
    // Log del error
    console.error(ApiErrorUtils.formatForLogging(error, context));

    // Aquí podrías integrar con servicios de monitoreo como Sentry
    // Sentry.captureException(error.originalError || error);

    return {
      userMessage: ApiErrorUtils.getUserFriendlyMessage(error),
      requiresReauth: ApiErrorUtils.requiresReauthentication(error),
      isRecoverable: ApiErrorUtils.isRecoverable(error),
      retryDelay: ApiErrorUtils.getRetryDelay(error),
    };
  };

  return { handleError };
};

// Configuración para reintentos
export interface RetryConfig {
  maxAttempts: number;
  baseDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
}

export const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxAttempts: 3,
  baseDelay: 1000,
  maxDelay: 10000,
  backoffMultiplier: 2,
};

/**
 * Calcula el delay para el siguiente reintento usando backoff exponencial
 */
export const calculateRetryDelay = (
  attempt: number,
  config: RetryConfig = DEFAULT_RETRY_CONFIG
): number => {
  const delay =
    config.baseDelay * Math.pow(config.backoffMultiplier, attempt - 1);
  return Math.min(delay, config.maxDelay);
};

/**
 * Verifica si se debe reintentar basado en el tipo de error
 */
export const shouldRetry = (
  error: ApiError,
  attempt: number,
  config: RetryConfig = DEFAULT_RETRY_CONFIG
): boolean => {
  if (attempt >= config.maxAttempts) {
    return false;
  }

  return ApiErrorUtils.isRecoverable(error);
};
