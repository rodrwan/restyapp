import { gql } from "graphql-request";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { MANGO_API_URL } from "@/constants";

// Tipos de error personalizados
export enum ApiErrorType {
  NETWORK_ERROR = "NETWORK_ERROR",
  AUTHENTICATION_ERROR = "AUTHENTICATION_ERROR",
  AUTHORIZATION_ERROR = "AUTHORIZATION_ERROR",
  VALIDATION_ERROR = "VALIDATION_ERROR",
  SERVER_ERROR = "SERVER_ERROR",
  SERVICE_UNAVAILABLE = "SERVICE_UNAVAILABLE",
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
}

export interface ApiError {
  type: ApiErrorType;
  message: string;
  statusCode?: number;
  originalError?: any;
  timestamp: Date;
}

// Clase para manejo centralizado de errores
class ApiErrorHandler {
  static createError(
    type: ApiErrorType,
    message: string,
    statusCode?: number,
    originalError?: any
  ): ApiError {
    return {
      type,
      message,
      statusCode,
      originalError,
      timestamp: new Date(),
    };
  }

  static handleHttpError(statusCode: number, response?: Response): ApiError {
    switch (statusCode) {
      case 401:
        return this.createError(
          ApiErrorType.AUTHENTICATION_ERROR,
          "Sesión expirada o credenciales inválidas",
          statusCode
        );
      case 403:
        return this.createError(
          ApiErrorType.AUTHORIZATION_ERROR,
          "No tienes permisos para realizar esta acción",
          statusCode
        );
      case 422:
        return this.createError(
          ApiErrorType.VALIDATION_ERROR,
          "Datos de entrada inválidos",
          statusCode
        );
      case 503:
        return this.createError(
          ApiErrorType.SERVICE_UNAVAILABLE,
          "Servicio temporalmente no disponible",
          statusCode
        );
      case 500:
        return this.createError(
          ApiErrorType.SERVER_ERROR,
          "Error interno del servidor",
          statusCode
        );
      default:
        return this.createError(
          ApiErrorType.UNKNOWN_ERROR,
          `Error HTTP ${statusCode}`,
          statusCode
        );
    }
  }

  static logError(error: ApiError, context: string) {
    console.error(`[${context}] Error:`, {
      type: error.type,
      message: error.message,
      statusCode: error.statusCode,
      timestamp: error.timestamp,
      originalError: error.originalError,
    });
  }
}

// Interfaces mejoradas
interface LoginInput {
  password: string;
  username: string;
  source: string;
}

interface RegisterInput {
  password: string;
  source: string;
  firstname: string;
  lastname: string;
  email: string;
  picture: string;
  reference_id: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
}

// Configuración de la API
interface ApiConfig {
  baseUrl: string;
  timeout: number;
  retryAttempts: number;
  retryDelay: number;
}

class Client {
  private static _instance: Client = new Client();
  private accessToken: string = "";
  private refreshToken: string = "";
  private config: ApiConfig = {
    baseUrl: MANGO_API_URL,
    timeout: 30000, // 30 segundos
    retryAttempts: 3,
    retryDelay: 1000, // 1 segundo
  };

  constructor() {
    if (Client._instance) {
      throw new Error(
        "Error: Instantiation failed: Use SingletonClass.getInstance() instead of new."
      );
    }
    Client._instance = this;
  }

  public static getInstance(): Client {
    return Client._instance;
  }

  // Método centralizado para hacer requests
  private async makeRequest<T>(
    query: string,
    variables: any = {},
    operationName: string,
    requiresAuth: boolean = false,
    retryCount: number = 0
  ): Promise<ApiResponse<T>> {
    try {
      const headers: Record<string, string> = {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-User-Roles": "system",
        "x-user-platform": "mobile",
      };

      if (requiresAuth) {
        const token = await this.getAccessToken();
        if (!token) {
          const error = ApiErrorHandler.createError(
            ApiErrorType.AUTHENTICATION_ERROR,
            "Token de acceso no encontrado"
          );
          ApiErrorHandler.logError(error, operationName);
          return { error };
        }
        headers.Authorization = `Bearer ${token}`;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(
        () => controller.abort(),
        this.config.timeout
      );

      headers.origin = "https://mangoticket.com";
      const response = await fetch(this.config.baseUrl, {
        method: "POST",
        headers,
        body: JSON.stringify({
          query,
          variables,
          operationName,
        }),
        signal: controller.signal,
      });

      console.log(">>> Operation Name", operationName);
      // console.log(
      //   JSON.stringify(
      //     {
      //       method: "POST",
      //       headers,
      //       body: JSON.stringify({
      //         query,
      //         variables,
      //         operationName,
      //       }),
      //     },
      //     null,
      //     2
      //   )
      // );

      clearTimeout(timeoutId);

      // Manejo de errores HTTP
      if (!response.ok) {
        const error = ApiErrorHandler.handleHttpError(
          response.status,
          response
        );
        ApiErrorHandler.logError(error, operationName);

        const result = await response.text();
        // console.log("result", result);

        // Reintento automático para errores 5xx
        if (response.status >= 500 && retryCount < this.config.retryAttempts) {
          await new Promise((resolve) =>
            setTimeout(resolve, this.config.retryDelay * (retryCount + 1))
          );
          return this.makeRequest<T>(
            query,
            variables,
            operationName,
            requiresAuth,
            retryCount + 1
          );
        }

        return { error };
      }

      const result = await response.json();
      // console.log("result", result);

      // Manejo de errores GraphQL
      if (result.errors && result.errors.length > 0) {
        const graphqlError = result.errors[0];
        const error = ApiErrorHandler.createError(
          ApiErrorType.VALIDATION_ERROR,
          graphqlError.message || "Error en la consulta GraphQL",
          response.status,
          graphqlError
        );
        ApiErrorHandler.logError(error, operationName);
        return { error };
      }

      return { data: result.data };
    } catch (error: any) {
      let apiError: ApiError;

      if (error.name === "AbortError") {
        apiError = ApiErrorHandler.createError(
          ApiErrorType.NETWORK_ERROR,
          "Tiempo de espera agotado",
          undefined,
          error
        );
      } else if (error.message?.includes("Network request failed")) {
        apiError = ApiErrorHandler.createError(
          ApiErrorType.NETWORK_ERROR,
          "Error de conexión de red",
          undefined,
          error
        );
      } else {
        apiError = ApiErrorHandler.createError(
          ApiErrorType.UNKNOWN_ERROR,
          "Error inesperado en la solicitud",
          undefined,
          error
        );
      }

      ApiErrorHandler.logError(apiError, operationName);
      return { error: apiError };
    }
  }

  public async getAccessToken(): Promise<string | null> {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken");
      if (accessToken) {
        this.accessToken = accessToken;
      }
      return this.accessToken;
    } catch (error) {
      const apiError = ApiErrorHandler.createError(
        ApiErrorType.UNKNOWN_ERROR,
        "Error al obtener el token de acceso",
        undefined,
        error
      );
      ApiErrorHandler.logError(apiError, "getAccessToken");
      return null;
    }
  }

  public async setAccessToken(accessToken: string): Promise<void> {
    try {
      this.accessToken = accessToken;
      await AsyncStorage.setItem("accessToken", accessToken);
    } catch (error) {
      const apiError = ApiErrorHandler.createError(
        ApiErrorType.UNKNOWN_ERROR,
        "Error al guardar el token de acceso",
        undefined,
        error
      );
      ApiErrorHandler.logError(apiError, "setAccessToken");
      throw apiError;
    }
  }

  // Initialize session
  async signIn(input: LoginInput): Promise<ApiResponse<{ login: any }>> {
    const document = gql`
      mutation Login($input: LoginData!) {
        login(input: $input) {
          user {
            id
            firstname
            lastname
            email
            dni
            preferences
            news_subscription
            roles
            resale_sign
            resale_contract_url
            bank_account {
              number
              bank_name
              type
              email
              dni
            }
            gender
            phone
            birth_date
            picture
            source
            tbk_user_id
            tbk_card_number
            tbk_card_type
          }
          can_access
          access_token
        }
      }
    `;

    const variables = {
      input: {
        username: input.username,
        password: input.password,
        source: input.source,
      },
    };

    const result = await this.makeRequest<{ login: any }>(
      document,
      variables,
      "Login"
    );

    if (result.data?.login?.access_token) {
      await this.setAccessToken(result.data.login.access_token);
    }

    return result;
  }

  async signUp(input: RegisterInput): Promise<ApiResponse<{ register: any }>> {
    const document = gql`
      mutation Register($input: RegisterData!) {
        register(input: $input) {
          user {
            id
            firstname
            lastname
            email
            dni
            preferences
            news_subscription
            roles
            resale_sign
            resale_contract_url
            gender
            phone
            birth_date
            picture
            source
            tbk_user_id
            tbk_card_number
            tbk_card_type
          }
          access_token
        }
      }
    `;

    const variables = { input };

    const result = await this.makeRequest<{ register: any }>(
      document,
      variables,
      "Register"
    );

    if (result.data?.register?.access_token) {
      await this.setAccessToken(result.data.register.access_token);
    }

    return result;
  }

  async me(): Promise<ApiResponse<any>> {
    const document = gql`
      query Me {
        me {
          user {
            id
            firstname
            lastname
            email
            dni
            preferences
            news_subscription
            roles
            resale_sign
            resale_contract_url
            bank_account {
              number
              bank_name
              type
              email
              dni
            }
            gender
            phone
            birth_date
            picture
            source
            tbk_user_id
            tbk_card_number
            tbk_card_type
          }
        }
      }
    `;

    return this.makeRequest(document, {}, "Me", true);
  }

  // upload a file
  async uploadFile(file: any): Promise<ApiResponse<any>> {
    try {
      const body = new FormData();
      body.append("file", {
        uri: file.uri,
        name: file.name,
        filename: file.name,
        type: file.mimeType,
      } as any);
      body.append("Content-Type", file.mimeType);

      const token = await this.getAccessToken();
      if (!token) {
        const error = ApiErrorHandler.createError(
          ApiErrorType.AUTHENTICATION_ERROR,
          "Token de acceso requerido para subir archivos"
        );
        return { error };
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(
        () => controller.abort(),
        this.config.timeout
      );

      const response = await fetch(`${this.config.baseUrl}/upload`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
          "x-user-platform": "mobile",
          Authorization: `Bearer ${token}`,
        },
        body,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = ApiErrorHandler.handleHttpError(
          response.status,
          response
        );
        ApiErrorHandler.logError(error, "uploadFile");
        return { error };
      }

      const { data } = await response.json();
      return { data };
    } catch (error: any) {
      const apiError = ApiErrorHandler.createError(
        ApiErrorType.UNKNOWN_ERROR,
        "Error al subir el archivo",
        undefined,
        error
      );
      ApiErrorHandler.logError(apiError, "uploadFile");
      return { error: apiError };
    }
  }

  async getEvents(): Promise<ApiResponse<any>> {
    const document = gql`
      query GetEvents {
        getEvents {
          id
          image
          name
          start_at
          end_at
          start_hour
          end_hour
          nominated
          items {
            type
            price
          }
        }
      }
    `;

    return this.makeRequest(document, {}, "GetEvents");
  }

  async getEventById(id: string): Promise<ApiResponse<any>> {
    const document = gql`
      query GetEventById($id: String!) {
        getEventById(id: $id) {
          event {
            id
            image
            name
            description
            place
            nominated
            start_at
            end_at
            start_hour
            end_hour
            address
            items {
              id
              event_id
              name
              description
              type
              priority
              stock
              max_per_sale
              price
              end_at
              end_hour
              out_of_stock
              cover
            }
          }
        }
      }
    `;

    return this.makeRequest(document, { id }, "GetEventById");
  }

  async createOrder(orderData: any): Promise<ApiResponse<any>> {
    const document = gql`
      mutation CreateOrder($input: CreateOrderData!) {
        createOrder(input: $input) {
          id
          items {
            id
            type
            name
          }
        }
      }
    `;

    return this.makeRequest(
      document,
      { input: orderData },
      "CreateOrder",
      true
    );
  }

  async createPayment(paymentData: any): Promise<ApiResponse<any>> {
    const document = gql`
      mutation CreatePayment($input: CreatePaymentData) {
        createPayment(input: $input) {
          url
          token
        }
      }
    `;

    return this.makeRequest(
      document,
      { input: paymentData },
      "CreatePayment",
      true
    );
  }

  async getPaymentByToken(token: string): Promise<ApiResponse<any>> {
    const document = gql`
      query GetPaymentByToken($token: String!) {
        getPaymentByToken(token: $token) {
          id
        }
      }
    `;

    return this.makeRequest(document, { token }, "GetPaymentByToken");
  }

  async confirmNewPayment(paymentId: string): Promise<ApiResponse<any>> {
    const document = gql`
      mutation ConfirmPayment($paymentId: String!) {
        confirmPayment(paymentId: $paymentId) {
          status
          order_id
        }
      }
    `;

    return this.makeRequest(document, { paymentId }, "ConfirmPayment");
  }

  async getEventsByIds(ids: string[]): Promise<ApiResponse<any>> {
    const document = gql`
      query getEventsByIds($ids: GetEventsByIdsInput) {
        getEventsByIds(input: $ids) {
          events {
            id
            name
            image
            description
            start_at
            place
            items {
              price
              name
              type
            }
          }
        }
      }
    `;

    return this.makeRequest(
      document,
      { ids: { id: ids } },
      "getEventsByIds",
      true
    );
  }

  async getOrderItemsByUser(): Promise<ApiResponse<any>> {
    const document = gql`
      query getOrdersByUser($input: GetOrderItemsByUserIdInput!) {
        getOrderItemsByUser(input: $input) {
          id
          items {
            id
            item_id
            event_id
            type
            name
            price
            quantity
          }
        }
      }
    `;

    return this.makeRequest(
      document,
      { input: { status: "1" } },
      "getOrdersByUser",
      true
    );
  }

  async getTicketsByUserAndEventID(eventId: string): Promise<ApiResponse<any>> {
    const document = gql`
      query getTicketsByUserAndEventID($input: GetTicketsInput!) {
        getTickets(input: $input) {
          data {
            ticket {
              id
              base64
              event {
                id
                name
                start_at
                place
                description
                image
              }
              is_validated
              cover
            }
            event {
              id
              name
              start_at
              place
              image
              end_hour
              end_at
              description
            }
            event_item {
              name
              type
              cover
            }
          }
        }
      }
    `;

    return this.makeRequest(
      document,
      { input: { event_id: eventId } },
      "getTicketsByUserAndEventID",
      true
    );
  }

  async createInscription(eventId: string): Promise<ApiResponse<any>> {
    const document = gql`
      mutation CreateInscription($eventId: String!) {
        createInscription(eventId: $eventId) {
          url
          token
        }
      }
    `;

    return this.makeRequest(document, { eventId }, "CreateInscription", true);
  }

  async confirmInscription(
    token: string,
    eventId: string
  ): Promise<ApiResponse<any>> {
    const document = gql`
      mutation ConfirmInscription($input: ConfirmInscriptionData!) {
        confirmInscription(input: $input) {
          tbk_user
          card_number
          card_type
        }
      }
    `;

    return this.makeRequest(
      document,
      { input: { token, event_id: eventId } },
      "ConfirmInscription",
      true
    );
  }

  async deleteInscription(eventId: string): Promise<ApiResponse<any>> {
    const document = gql`
      mutation DeleteInscription($eventId: String!) {
        deleteInscription(eventId: $eventId) {
          tbk_user
        }
      }
    `;

    return this.makeRequest(document, { eventId }, "DeleteInscription", true);
  }

  async authorizeTransaction(paymentData: any): Promise<ApiResponse<any>> {
    const document = gql`
      mutation AuthorizeTransaction($input: AuthorizeTransactionData!) {
        authorizeTransaction(input: $input) {
          status
          order_id
        }
      }
    `;

    return this.makeRequest(
      document,
      { input: paymentData },
      "AuthorizeTransaction",
      true
    );
  }

  async getUserFirstUpcomingEvent(): Promise<ApiResponse<any>> {
    const document = gql`
      query GetUserFirstUpcomingEvent {
        getUserFirstUpcomingEvent {
          tickets {
            id
            base64
            event {
              id
              name
              start_at
              place
              description
              image
            }
            is_validated
          }
          event {
            id
            name
            start_at
            place
            image
            end_hour
            end_at
            description
          }
          event_item {
            name
            type
            cover
          }
        }
      }
    `;

    return this.makeRequest(document, {}, "GetUserFirstUpcomingEvent", true);
  }

  async getUserFirstTodayEvent(): Promise<ApiResponse<any>> {
    const document = gql`
      query GetUserFirstUpcomingEvent {
        getUserFirstUpcomingEvent {
          tickets {
            id
            base64
            event {
              id
              name
              start_at
              place
              description
              image
            }
            is_validated
          }
          event {
            id
            name
            start_at
            place
            image
            end_hour
            end_at
            description
          }
          event_item {
            name
            type
            cover
          }
        }
      }
    `;

    return this.makeRequest(document, {}, "GetUserFirstUpcomingEvent", true);
  }

  async getUserUpcomingEvents(): Promise<ApiResponse<any>> {
    const document = gql`
      query GetUserUpcomingEvents {
        getUserUpcomingEvents {
          data {
            tickets {
              id
              base64
              event {
                id
                name
                start_at
                place
                description
                image
              }
              is_validated
            }
            event {
              id
              name
              start_at
              place
              image
              end_hour
              end_at
              description
            }
            event_item {
              name
              type
            }
          }
        }
      }
    `;

    return this.makeRequest(document, {}, "GetUserUpcomingEvents", true);
  }

  async getTicketById(id: string): Promise<ApiResponse<any>> {
    const document = gql`
      query GetTicketById($id: ID!) {
        getTicketById(id: $id) {
          id
          is_validated
        }
      }
    `;

    return this.makeRequest(document, { id }, "GetTicketById", true);
  }

  async getOrderById(id: string): Promise<ApiResponse<any>> {
    const document = gql`
      query GetOrderById($id: ID!) {
        getOrderById(id: $id) {
          order {
            id
            items {
              type
              name
              price
              quantity
            }
          }
          payment {
            id
            amount
            status
            invoice_href
            created_at
          }
          event {
            id
            name
            start_at
            place
            description
            image
            address
          }
        }
      }
    `;

    return this.makeRequest(document, { id }, "GetOrderById", true);
  }

  async requestPasswordReset(email: string): Promise<ApiResponse<any>> {
    const document = gql`
      mutation ForgotPassword($input: String!) {
        forgotPassword(email: $input) {
          success
          message
        }
      }
    `;

    return this.makeRequest(document, { input: email }, "ForgotPassword", true);
  }

  async resetPassword(
    code: string,
    newPassword: string
  ): Promise<ApiResponse<any>> {
    const document = gql`
      mutation ResetPassword($token: String!, $password: String!) {
        resetPassword(token: $token, password: $password) {
          success
          message
        }
      }
    `;

    return this.makeRequest(
      document,
      { token: code, password: newPassword },
      "ResetPassword",
      true
    );
  }

  async deleteMe(): Promise<ApiResponse<any>> {
    const document = gql`
      mutation DeleteUser {
        deleteUser {
          success
          message
        }
      }
    `;

    return this.makeRequest(document, {}, "DeleteUser", true);
  }

  async updateUserExtra(user: any): Promise<ApiResponse<any>> {
    const document = gql`
      mutation UpdateUserExtra($input: UpdateUserProfileExtraInput!) {
        updateUserProfileExtra(input: $input) {
          success
          message
        }
      }
    `;

    const variables = {
      input: {
        ...user,
        dni: user?.dni?.toString().replaceAll(".", ""),
      },
    };

    return this.makeRequest(document, variables, "UpdateUserExtra", true);
  }

  async getCourtesies(eventId: string): Promise<ApiResponse<any>> {
    const document = gql`
      query GetCourtesies($input: GetCourtesiesInput!) {
        getCourtesies(input: $input) {
          data {
            courtesy {
              id
              base64
              name
              is_validated
            }
            event {
              id
              name
              start_at
              place
              description
              image
            }
          }
        }
      }
    `;

    return this.makeRequest(
      document,
      { input: { event_id: eventId } },
      "GetCourtesies",
      true
    );
  }

  // Método para limpiar tokens (logout)
  async clearTokens(): Promise<void> {
    try {
      this.accessToken = "";
      this.refreshToken = "";
      await AsyncStorage.removeItem("accessToken");
      await AsyncStorage.removeItem("refreshToken");
    } catch (error) {
      const apiError = ApiErrorHandler.createError(
        ApiErrorType.UNKNOWN_ERROR,
        "Error al limpiar tokens",
        undefined,
        error
      );
      ApiErrorHandler.logError(apiError, "clearTokens");
      throw apiError;
    }
  }

  // Método para verificar si el usuario está autenticado
  async isAuthenticated(): Promise<boolean> {
    const token = await this.getAccessToken();
    return !!token;
  }
}

export default Client;
