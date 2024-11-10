import * as graphql from "graphql-request/build/entrypoints/main";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { MANGO_API_URL } from "@/constants";

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

class Client {
  private static _instance: Client = new Client();
  accessToken: string = "";
  refreshToken: string = "";

  constructor() {
    if (Client._instance) {
      throw new Error(
        "Error: Instantiation failed: Use SingletonClass.getInstance() instead of new."
      );
    }
    Client._instance = this;
  }

  public async getAccessToken(): Promise<string | null> {
    const accessToken = await AsyncStorage.getItem("accessToken");
    if (accessToken) {
      this.accessToken = accessToken;
    }
    return this.accessToken;
  }

  public async setAccessToken(accessToken: string) {
    this.accessToken = accessToken;
  }

  public static getInstance(): Client {
    return Client._instance;
  }

  // Initialize session
  async signIn(input: LoginInput) {
    try {
      const document = graphql.gql`
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

      const requestHeaders = {
        "X-User-Roles": "system",
      };

      const response = await fetch(`${MANGO_API_URL}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-user-platform": "mobile",
          ...requestHeaders,
        },
        body: JSON.stringify({
          query: document,
          variables,
          operationName: "Login",
        }),
      });

      if (response.status === 503) {
        console.log("Login Unavailable service");
        return [];
      } else if (response.status !== 200) {
        console.log("Login response", response);
        return [];
      }
      const resp = await response.json();

      if (!resp.errors) {
        this.accessToken = resp?.data?.login.access_token;
        AsyncStorage.setItem("accessToken", this.accessToken);
      }

      return [resp?.data?.login, resp?.errors];
    } catch (error: any) {
      console.log("error", error);
      throw new Error(error);
    }
  }

  async signUp(input: RegisterInput) {
    try {
      const document = graphql.gql`
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
        }
        access_token
    }
}
      `;

      const variables = {
        input: {
          ...input,
        },
      };

      const requestHeaders = {
        "X-User-Roles": "system",
      };

      const response = await fetch(`${MANGO_API_URL}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-user-platform": "mobile",
          ...requestHeaders,
        },
        body: JSON.stringify({
          query: document,
          variables,
          operationName: "Register",
        }),
      });

      if (response.status === 503) {
        console.log("Register Unavailable service");
        return [];
      } else if (response.status !== 200) {
        console.log("Register response", response);
        return [];
      }
      const resp = await response.json();

      if (!resp.errors) {
        this.accessToken = resp?.data?.register.access_token;
        AsyncStorage.setItem("accessToken", this.accessToken);
      }

      return [resp?.data?.register, resp?.errors];
    } catch (error: any) {
      console.log("error", error);
      throw new Error(error);
    }
  }

  async me() {
    try {
      const document = graphql.gql`
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
        }
      }
    }
      `;

      const requestHeaders = {
        "X-User-Roles": "system",
        Authorization: `Bearer ${this.accessToken}`,
      };

      const response = await fetch(`${MANGO_API_URL}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-user-platform": "mobile",
          ...requestHeaders,
        },
        body: JSON.stringify({
          query: document,
          variables: {},
          operationName: "Me",
        }),
      });

      if (response.status === 503) {
        console.log("Me Unavailable service");
        return [];
      } else if (response.status !== 200) {
        console.log("Me response", response);
        return [];
      }
      const resp = await response.json();

      return [resp?.data?.me, resp?.errors];
    } catch (error: any) {
      console.log("error", error);
      throw new Error(error);
    }
  }

  // upload a file
  async uploadFile(file: any) {
    let body: any = new FormData();
    body.append("file", {
      uri: file.uri,
      name: file.name,
      filename: file.name,
      type: file.mimeType,
    });
    body.append("Content-Type", file.mimeType);

    try {
      const response = await fetch(`${MANGO_API_URL}/upload`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
          "x-user-platform": "mobile",
          Authorization: `Bearer ${this.accessToken}`,
        },
        body,
      });

      if (response.status === 503) {
        console.log("Unavailable service");
        return [];
      } else if (response.status !== 200) {
        console.log("response", response);
        return [];
      }
      const { data } = await response.json();

      return data;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async getEvents(): Promise<any> {
    try {
      const document = graphql.gql`
        query GetEvents {
          getEvents {
            id
            image
            name
            start_at
            start_at
            end_at
            start_hour
            end_hour
            nominated
            items {
              price
            }
          }
        }
      `;

      const variables = {};

      const requestHeaders = {};

      const response = await fetch(MANGO_API_URL, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-user-platform": "mobile",
          ...requestHeaders,
        },
        body: JSON.stringify({
          query: document,
          variables,
          operationName: "GetEvents",
        }),
      });

      if (response.status === 503) {
        console.log("GetEvents Unavailable service");
        return [];
      } else if (response.status !== 200) {
        console.log("GetEvents response", response);
        return [];
      }
      const { data } = await response.json();

      return data.getEvents;
    } catch (error: any) {
      console.log("getEvents error", error);
      throw new Error(error);
    }
  }
  async getEventById(id: string): Promise<any> {
    try {
      const document = graphql.gql`
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
          out_of_stock
          address
          items {
            id
            type
            name
            price
            stock
            max_per_sale
            event_id
            priority
            end_at
            end_hour
          }
        }
      }
    }
      `;

      const variables = {
        id,
      };

      const requestHeaders = {
        "X-User-Roles": "system",
      };

      const response = await fetch(`${MANGO_API_URL}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-user-platform": "mobile",
          ...requestHeaders,
        },
        body: JSON.stringify({
          query: document,
          variables,
          operationName: "GetEventById",
        }),
      });

      if (response.status === 503) {
        console.log("GetEventById Unavailable service");
        return [];
      } else if (response.status !== 200) {
        console.log("GetEventById response", response);
        return [];
      }
      const { data } = await response.json();

      return data.getEventById;
    } catch (error: any) {
      console.log("error", error);
      throw new Error(error);
    }
  }
  async createOrder(orderData: any): Promise<any> {
    try {
      const document = graphql.gql`
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

      const variables = {
        input: {
          ...orderData,
        },
      };

      const requestHeaders = {
        "X-User-Roles": "system",
        Authorization: `Bearer ${this.accessToken}`,
      };

      const response = await fetch(`${MANGO_API_URL}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-user-platform": "mobile",
          ...requestHeaders,
        },
        body: JSON.stringify({
          query: document,
          variables,
          operationName: "CreateOrder",
        }),
      });

      if (response.status === 503) {
        console.log("CreateOrder Unavailable service");
        return [];
      } else if (response.status !== 200) {
        console.log("CreateOrder response", response);
        return [];
      }

      const { data } = await response.json();

      return data.createOrder;
    } catch (error: any) {
      console.log("error", error);
      throw new Error(error);
    }
  }

  async createPayment(paymentData: any): Promise<any> {
    try {
      const document = graphql.gql`
    mutation CreatePayment($input: CreatePaymentData!) {
      createPayment(input: $input) {
        url
        token
      }
    }
      `;

      const variables = {
        input: {
          ...paymentData,
        },
      };

      const requestHeaders = {
        "X-User-Roles": "system",
        Authorization: `Bearer ${this.accessToken}`,
      };

      const response = await fetch(`${MANGO_API_URL}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-user-platform": "mobile",
          ...requestHeaders,
        },
        body: JSON.stringify({
          query: document,
          variables,
          operationName: "CreatePayment",
        }),
      });

      if (response.status === 503) {
        console.log("CreatePayment Unavailable service");
        return [];
      } else if (response.status !== 200) {
        console.log("CreatePayment response", response);
        return [];
      }
      const { data } = await response.json();

      return data.createPayment;
    } catch (error: any) {
      console.log("error", error);
      throw new Error(error);
    }
  }

  async getPaymentByToken(token: any): Promise<any> {
    try {
      const document = graphql.gql`
    query GetPaymentByToken($token: String!) {
      getPaymentByToken(token: $token) {
        id
      }
    }
      `;

      const variables = {
        token,
      };

      const requestHeaders = {
        "X-User-Roles": "system",
      };

      const response = await fetch(`${MANGO_API_URL}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          ...requestHeaders,
        },
        body: JSON.stringify({
          query: document,
          variables,
          operationName: "GetPaymentByToken",
        }),
      });

      console.log("response", response);
      if (response.status === 503) {
        console.log("CreatePayment Unavailable service");
        return [];
      } else if (response.status !== 200) {
        console.log("CreatePayment response", response);
        return [];
      }
      const { data } = await response.json();
      console.log("data", data);

      return data.getPaymentByToken;
    } catch (error: any) {
      console.log("error", error);
      throw new Error(error);
    }
  }
  async confirmNewPayment(paymentId: any): Promise<any> {
    try {
      const document = graphql.gql`
    mutation ConfirmPayment($paymentId: String!) {
      confirmPayment(paymentId: $paymentId) {
        status
        order_id
      }
    }
      `;

      const variables = {
        paymentId,
      };

      const requestHeaders = {
        "X-User-Roles": "system",
      };

      const response = await fetch(`${MANGO_API_URL}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-user-platform": "mobile",
          ...requestHeaders,
        },
        body: JSON.stringify({
          query: document,
          variables,
          operationName: "ConfirmPayment",
        }),
      });

      console.log("response", response);
      if (response.status === 503) {
        console.log("CreatePayment Unavailable service");
        return [];
      } else if (response.status !== 200) {
        console.log("CreatePayment response", response);
        return [];
      }
      const { data } = await response.json();
      console.log("data", data);

      return data.confirmPayment;
    } catch (error: any) {
      console.log("error", error);
      throw new Error(error);
    }
  }
  async getEventsByIds(ids: string[]): Promise<any> {
    try {
      const document = graphql.gql`
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

      const variables = {
        ids: {
          id: ids,
        },
      };

      const requestHeaders = {
        "X-User-Roles": "system",
        Authorization: `Bearer ${this.accessToken}`,
      };

      const response = await fetch(`${MANGO_API_URL}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-user-platform": "mobile",
          ...requestHeaders,
        },
        body: JSON.stringify({
          query: document,
          variables,
          operationName: "getEventsByIds",
        }),
      });

      if (response.status === 503) {
        console.log("getOrderItemsByUser Unavailable service");
        return [];
      } else if (response.status !== 200) {
        console.log("getOrderItemsByUser response", response);
        return [];
      }
      const { data } = await response.json();

      return data.getEventsByIds;
    } catch (error: any) {
      console.log("error", error);
      throw new Error(error);
    }
  }
  async getOrderItemsByUser(): Promise<any> {
    try {
      const document = graphql.gql`
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

      const variables = {
        input: {
          status: "1",
        },
      };

      const requestHeaders = {
        "X-User-Roles": "system",
        Authorization: `Bearer ${this.accessToken}`,
      };

      const response = await fetch(`${MANGO_API_URL}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-user-platform": "mobile",
          ...requestHeaders,
        },
        body: JSON.stringify({
          query: document,
          variables,
          operationName: "getOrdersByUser",
        }),
      });

      if (response.status === 503) {
        console.log("getOrdersByUser Unavailable service");
        return [];
      } else if (response.status !== 200) {
        console.log("getOrdersByUser response", response);
        return [];
      }
      const { data } = await response.json();

      return data.getOrderItemsByUser;
    } catch (error: any) {
      console.log("error", error);
      throw new Error(error);
    }
  }

  async getTicketsByUserAndEventID(eventId: string): Promise<any> {
    try {
      const document = graphql.gql`
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

      const variables = {
        input: {
          event_id: eventId,
        },
      };

      const requestHeaders = {
        "X-User-Roles": "system",
        Authorization: `Bearer ${this.accessToken}`,
      };

      const response = await fetch(`${MANGO_API_URL}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-user-platform": "mobile",
          ...requestHeaders,
        },
        body: JSON.stringify({
          query: document,
          variables,
          operationName: "getTicketsByUserAndEventID",
        }),
      });

      if (response.status === 503) {
        console.log("getTicketsByUserAndEventID Unavailable service");
        return [];
      } else if (response.status !== 200) {
        console.log("getTicketsByUserAndEventID response", response);
        return [];
      }
      const { data } = await response.json();

      return data.getTickets;
    } catch (error: any) {
      console.log("error", error);
      throw new Error(error);
    }
  }

  async createInscription(): Promise<any> {
    try {
      const document = graphql.gql`
    mutation CreateInscription {
      createInscription {
        url
        token
      }
    }
      `;

      const variables = {};

      const requestHeaders = {
        "X-User-Roles": "system",
        Authorization: `Bearer ${this.accessToken}`,
      };

      const response = await fetch(`${MANGO_API_URL}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-user-platform": "mobile",
          ...requestHeaders,
        },
        body: JSON.stringify({
          query: document,
          variables,
          operationName: "CreateInscription",
        }),
      });

      console.log("response", response);
      if (response.status === 503) {
        console.log("CreateInscription Unavailable service");
        return [];
      } else if (response.status !== 200) {
        console.log("CreateInscription response", response);
        return [];
      }
      const { data } = await response.json();
      console.log("data", data);

      return data.createInscription;
    } catch (error: any) {
      console.log("error", error);
      throw new Error(error);
    }
  }

  async confirmInscription(token: string): Promise<any> {
    try {
      const document = graphql.gql`
    mutation ConfirmInscription($input: ConfirmInscriptionData!) {
      confirmInscription(input: $input) {
        tbk_user
        card_number
      }
    }
      `;

      const variables = {
        input: {
          token,
        },
      };

      const requestHeaders = {
        "X-User-Roles": "system",
        Authorization: `Bearer ${this.accessToken}`,
      };

      const response = await fetch(`${MANGO_API_URL}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-user-platform": "mobile",
          ...requestHeaders,
        },
        body: JSON.stringify({
          query: document,
          variables,
          operationName: "ConfirmInscription",
        }),
      });

      if (response.status === 503) {
        console.log("ConfirmInscription Unavailable service");
        return [];
      } else if (response.status !== 200) {
        console.log("ConfirmInscription response", response);
        return [];
      }
      const res = await response.json();
      console.log("data", res);

      return res?.data?.confirmInscription;
    } catch (error: any) {
      console.log("error", error);
      throw new Error(error);
    }
  }

  async authorizeTransaction(paymentData: any): Promise<any> {
    try {
      const document = graphql.gql`
    mutation AuthorizeTransaction($input: AuthorizeTransactionData!) {
      authorizeTransaction(input: $input) {
        status
        order_id
      }
    }
      `;

      const variables = {
        input: {
          ...paymentData,
        },
      };

      const requestHeaders = {
        "X-User-Roles": "system",
        Authorization: `Bearer ${this.accessToken}`,
      };

      const response = await fetch(`${MANGO_API_URL}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-user-platform": "mobile",
          ...requestHeaders,
        },
        body: JSON.stringify({
          query: document,
          variables,
          operationName: "AuthorizeTransaction",
        }),
      });

      if (response.status === 503) {
        console.log("AuthorizeTransaction Unavailable service");
        return [];
      } else if (response.status !== 200) {
        console.log("AuthorizeTransaction response", response);
        return [];
      }
      const res = await response.json();
      console.log("data", res);

      return res?.data?.authorizeTransaction;
    } catch (error: any) {
      console.log("error", error);
      throw new Error(error);
    }
  }

  async getUserFirstUpcomingEvent(): Promise<any> {
    try {
      const document = graphql.gql`
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
    }
  }
}
      `;

      const variables = {};

      const requestHeaders = {
        "X-User-Roles": "system",
        Authorization: `Bearer ${this.accessToken}`,
      };

      const response = await fetch(`${MANGO_API_URL}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-user-platform": "mobile",
          ...requestHeaders,
        },
        body: JSON.stringify({
          query: document,
          variables,
          operationName: "GetUserFirstUpcomingEvent",
        }),
      });

      if (response.status === 503) {
        console.log("GetUserFirstUpcomingEvent Unavailable service");
        return [];
      } else if (response.status !== 200) {
        if (response.status === 401) {
          throw new Error("unauthorized");
        }
        console.log("GetUserFirstUpcomingEvent response", response);
        return [];
      }
      const res = await response.json();

      return res?.data?.getUserFirstUpcomingEvent;
    } catch (error: any) {
      console.log("error", error);
      throw new Error(error);
    }
  }
  async getUserUpcomingEvents(): Promise<any> {
    try {
      const document = graphql.gql`
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

      const variables = {};

      const requestHeaders = {
        "X-User-Roles": "system",
        Authorization: `Bearer ${this.accessToken}`,
      };

      const response = await fetch(`${MANGO_API_URL}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-user-platform": "mobile",
          ...requestHeaders,
        },
        body: JSON.stringify({
          query: document,
          variables,
          operationName: "GetUserUpcomingEvents",
        }),
      });

      if (response.status === 503) {
        console.log("GetUserUpcomingEvents Unavailable service");
        return [];
      } else if (response.status !== 200) {
        if (response.status === 401) {
          throw new Error("unauthorized");
        }
        console.log("GetUserUpcomingEvents response", response);
        return [];
      }
      const res = await response.json();

      return res?.data?.getUserUpcomingEvents;
    } catch (error: any) {
      console.log("error", error);
      throw new Error(error);
    }
  }

  async getTicketById(id: string): Promise<any> {
    try {
      const document = graphql.gql`
        query GetTicketById($id: ID!) {
          getTicketById(id: $id) {
            id
            is_validated
          }
        }
      `;

      const variables = {
        id,
      };

      const requestHeaders = {
        "X-User-Roles": "system",
        Authorization: `Bearer ${this.accessToken}`,
      };

      const response = await fetch(`${MANGO_API_URL}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-user-platform": "mobile",
          ...requestHeaders,
        },
        body: JSON.stringify({
          query: document,
          variables,
          operationName: "GetTicketById",
        }),
      });

      if (response.status === 503) {
        console.log("GetTicketById Unavailable service");
        return [];
      } else if (response.status !== 200) {
        console.log("GetTicketById response", response);
        return [];
      }
      const { data } = await response.json();

      return data.getTicketById;
    } catch (error: any) {
      console.log("error", error);
      throw new Error(error);
    }
  }
}

export default Client;
