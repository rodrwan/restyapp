import { useState, useCallback } from "react";
import Client from "@/lib/api";
import { ApiError, ApiResponse } from "@/lib/api";
import {
  useApiErrorHandler,
  ApiErrorUtils,
  shouldRetry,
  calculateRetryDelay,
  RetryConfig,
} from "@/lib/api-utils";

interface UseApiOptions {
  retryConfig?: RetryConfig;
  onError?: (error: ApiError) => void;
  onSuccess?: (data: any) => void;
  showUserMessage?: boolean;
}

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
  userMessage: string | null;
}

export const useApiWithErrorHandling = <T = any,>(
  options: UseApiOptions = {}
) => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
    userMessage: null,
  });

  const { handleError } = useApiErrorHandler();

  const executeRequest = useCallback(
    async (
      apiCall: () => Promise<ApiResponse<T>>,
      context?: string
    ): Promise<T | null> => {
      setState((prev) => ({
        ...prev,
        loading: true,
        error: null,
        userMessage: null,
      }));

      let attempt = 1;
      const maxAttempts = options.retryConfig?.maxAttempts || 3;

      while (attempt <= maxAttempts) {
        try {
          const result = await apiCall();

          if (result.error) {
            // Manejar el error
            const errorInfo = handleError(result.error, context);

            setState((prev) => ({
              ...prev,
              loading: false,
              error: result.error || null,
              userMessage: errorInfo.userMessage,
            }));

            // Llamar callback de error si existe
            if (options.onError) {
              options.onError(result.error);
            }

            // Verificar si se debe reintentar
            if (shouldRetry(result.error, attempt, options.retryConfig)) {
              const delay = calculateRetryDelay(attempt, options.retryConfig);
              console.log(
                `Reintentando en ${delay}ms (intento ${attempt}/${maxAttempts})`
              );

              await new Promise((resolve) => setTimeout(resolve, delay));
              attempt++;
              continue;
            }

            return null;
          }

          // Éxito
          setState((prev) => ({
            ...prev,
            loading: false,
            data: result.data as T,
            error: null,
            userMessage: null,
          }));

          // Llamar callback de éxito si existe
          if (options.onSuccess && result.data) {
            options.onSuccess(result.data);
          }

          return result.data as T;
        } catch (error: any) {
          // Error inesperado
          const apiError: ApiError = {
            type: "UNKNOWN_ERROR" as any,
            message: error.message || "Error inesperado",
            timestamp: new Date(),
            originalError: error,
          };

          const errorInfo = handleError(apiError, context);

          setState((prev) => ({
            ...prev,
            loading: false,
            error: apiError,
            userMessage: errorInfo.userMessage,
          }));

          if (options.onError) {
            options.onError(apiError);
          }

          return null;
        }
      }

      return null;
    },
    [handleError, options]
  );

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null, userMessage: null }));
  }, []);

  const clearData = useCallback(() => {
    setState((prev) => ({ ...prev, data: null }));
  }, []);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
      userMessage: null,
    });
  }, []);

  return {
    ...state,
    executeRequest,
    clearError,
    clearData,
    reset,
  };
};

// Hook específico para autenticación
export const useAuthWithErrorHandling = () => {
  const { executeRequest, ...state } = useApiWithErrorHandling({
    onError: (error) => {
      if (ApiErrorUtils.requiresReauthentication(error)) {
        // Aquí podrías redirigir al login o limpiar tokens
        console.log("Usuario necesita reautenticarse");
      }
    },
  });

  const signIn = useCallback(
    async (username: string, password: string, source: string) => {
      return executeRequest(
        () => Client.getInstance().signIn({ username, password, source }),
        "signIn"
      );
    },
    [executeRequest]
  );

  const signUp = useCallback(
    async (userData: any) => {
      return executeRequest(
        () => Client.getInstance().signUp(userData),
        "signUp"
      );
    },
    [executeRequest]
  );

  const logout = useCallback(async () => {
    try {
      await Client.getInstance().clearTokens();
      state.reset();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  }, [state]);

  return {
    ...state,
    signIn,
    signUp,
    logout,
  };
};

// Hook específico para eventos
export const useEventsWithErrorHandling = () => {
  const { executeRequest, ...state } = useApiWithErrorHandling();

  const getEvents = useCallback(async () => {
    return executeRequest(() => Client.getInstance().getEvents(), "getEvents");
  }, [executeRequest]);

  const getEventById = useCallback(
    async (id: string) => {
      return executeRequest(
        () => Client.getInstance().getEventById(id),
        "getEventById"
      );
    },
    [executeRequest]
  );

  return {
    ...state,
    getEvents,
    getEventById,
  };
};

// Hook específico para pagos
export const usePaymentsWithErrorHandling = () => {
  const { executeRequest, ...state } = useApiWithErrorHandling({
    retryConfig: {
      maxAttempts: 2, // Menos reintentos para pagos
      baseDelay: 2000,
      maxDelay: 5000,
      backoffMultiplier: 1.5,
    },
  });

  const createPayment = useCallback(
    async (paymentData: any) => {
      return executeRequest(
        () => Client.getInstance().createPayment(paymentData),
        "createPayment"
      );
    },
    [executeRequest]
  );

  const confirmPayment = useCallback(
    async (paymentId: string) => {
      return executeRequest(
        () => Client.getInstance().confirmNewPayment(paymentId),
        "confirmPayment"
      );
    },
    [executeRequest]
  );

  return {
    ...state,
    createPayment,
    confirmPayment,
  };
};
