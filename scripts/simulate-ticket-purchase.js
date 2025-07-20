#!/usr/bin/env node

/**
 * Script para simular el flujo de compra de entradas no nominadas
 * Permite configurar datos de entrada y ejecutar las llamadas de manera fluida
 */

const fetch = require("node-fetch");

// Configuración
const API_BASE_URL = "http://localhost:8080/graphql";
const API_TIMEOUT = 30000;

// Datos de entrada configurables
const INPUT_DATA = {
  // Datos de autenticación
  auth: {
    username: "test06@mangoticket.com",
    password: "test0606",
    source: "mangoticket",
  },

  // Items a comprar (configurables)
  items: [
    {
      id: "409b3c3d-1374-45f5-9019-edad2d5d01dc",
      name: "Entrada General",
      type: "ENTRANCE",
      price: 10000,
      quantity: 2,
      cover: false,
      event_id: "1e2c2af3-da19-4706-af42-692e0301d51c",
    },
    {
      id: "3f510dba-d64b-42b5-8779-b3bdabad48e9",
      name: "Piscola",
      type: "DRINK",
      price: 10000,
      quantity: 3,
      event_id: "1e2c2af3-da19-4706-af42-692e0301d51c",
    },
  ],

  // Datos de pago
  payment: {
    terms_and_conditions_signed: true,
    alcohol_signed: true,
    installments: 0,
    nominated_items: [],
  },
};

// Clase para manejo de errores
class ApiError extends Error {
  constructor(message, statusCode, originalError) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.originalError = originalError;
  }
}

// Cliente API simplificado
class ApiClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.accessToken = null;
  }

  async makeRequest(
    query,
    variables = {},
    operationName,
    requiresAuth = false
  ) {
    try {
      const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-user-platform": "mobile",
        "X-User-Roles": "system",
      };

      if (requiresAuth && this.accessToken) {
        headers.Authorization = `Bearer ${this.accessToken}`;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers,
        body: JSON.stringify({
          query,
          variables,
          operationName,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new ApiError(
          `HTTP ${response.status}: ${response.statusText}`,
          response.status
        );
      }

      const result = await response.json();

      if (result.errors && result.errors.length > 0) {
        const graphqlError = result.errors[0];
        throw new ApiError(
          graphqlError.message || "Error en la consulta GraphQL",
          response.status,
          graphqlError
        );
      }

      return result.data;
    } catch (error) {
      if (error.name === "AbortError") {
        throw new ApiError("Tiempo de espera agotado");
      }
      throw error;
    }
  }

  // Autenticación
  async signIn(input) {
    const query = `
      mutation Login($input: LoginData!) {
        login(input: $input) {
          user {
            id
            firstname
            lastname
            email
            dni
          }
          access_token
        }
      }
    `;

    const result = await this.makeRequest(query, { input }, "Login");

    if (result?.login?.access_token) {
      this.accessToken = result.login.access_token;
      console.log("✅ Autenticación exitosa");
      return result.login;
    }

    throw new ApiError("No se pudo obtener el token de acceso");
  }

  // Crear orden
  async createOrder(orderData) {
    const query = `
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

    const result = await this.makeRequest(
      query,
      { input: orderData },
      "CreateOrder",
      true
    );
    console.log("✅ Orden creada exitosamente");
    return result.createOrder;
  }

  // Autorizar transacción
  async authorizeTransaction(paymentData) {
    const query = `
      mutation AuthorizeTransaction($input: AuthorizeTransactionData!) {
        authorizeTransaction(input: $input) {
          status
          order_id
        }
      }
    `;

    const result = await this.makeRequest(
      query,
      { input: paymentData },
      "AuthorizeTransaction",
      true
    );
    console.log("✅ Transacción autorizada exitosamente");
    return result.authorizeTransaction;
  }
}

// Función principal de simulación
async function simulateTicketPurchase() {
  console.log("🎫 Iniciando simulación de compra de entradas...\n");

  const client = new ApiClient(API_BASE_URL);

  try {
    // Step 1: Autenticación
    console.log("📋 Paso 1: Autenticación");
    console.log("Datos de entrada:", JSON.stringify(INPUT_DATA.auth, null, 2));

    await client.signIn(INPUT_DATA.auth);
    console.log("");

    // Step 2: Crear orden
    console.log("📋 Paso 2: Crear orden");
    console.log("Items a comprar:", JSON.stringify(INPUT_DATA.items, null, 2));

    // Transformar items para la API
    const orderItems = INPUT_DATA.items.flatMap((item) => {
      const elements = [];
      for (let i = 0; i < item.quantity; i++) {
        elements.push({
          event_id: item.event_id,
          item_id: item.id,
          quantity: 1,
          with_cover: item.cover || false,
        });
      }
      return elements;
    });

    const orderData = { items: orderItems };
    console.log("Datos de orden:", JSON.stringify(orderData, null, 2));

    const order = await client.createOrder(orderData);
    console.log("Respuesta de orden:", JSON.stringify(order, null, 2));
    console.log("");

    // Step 3: Autorizar transacción
    console.log("📋 Paso 3: Autorizar transacción");

    const paymentData = {
      order_id: order.id,
      terms_and_conditions_signed:
        INPUT_DATA.payment.terms_and_conditions_signed,
      alcohol_signed: INPUT_DATA.payment.alcohol_signed,
      installments: INPUT_DATA.payment.installments,
      nominated_items: INPUT_DATA.payment.nominated_items.map((nominee) => ({
        order_id: order.id,
        order_item_id: 1, // Asumiendo que es el primer item
        email: nominee.email,
        dni: nominee.dni,
      })),
    };

    console.log("Datos de pago:", JSON.stringify(paymentData, null, 2));

    const transaction = await client.authorizeTransaction(paymentData);
    console.log(
      "Respuesta de transacción:",
      JSON.stringify(transaction, null, 2)
    );
    console.log("");

    // Resumen final
    console.log("🎉 ¡Simulación completada exitosamente!");
    console.log("📊 Resumen:");
    console.log(`   - Orden ID: ${order.id}`);
    console.log(`   - Estado de transacción: ${transaction.status}`);
    console.log(`   - Items procesados: ${order.items.length}`);
  } catch (error) {
    console.error("❌ Error durante la simulación:", error.message);
    if (error.statusCode) {
      console.error(`   Código de estado: ${error.statusCode}`);
    }
    if (error.originalError) {
      console.error("   Error original:", error.originalError);
    }
    process.exit(1);
  }
}

// Función para mostrar ayuda
function showHelp() {
  console.log(`
🎫 Simulador de Compra de Entradas - MangoTicket

Uso:
  node simulate-ticket-purchase.js [opciones]

Opciones:
  --help, -h          Mostrar esta ayuda
  --config <archivo>   Cargar configuración desde archivo JSON
  --dry-run           Ejecutar sin hacer llamadas reales (solo simular)

Ejemplo:
  node simulate-ticket-purchase.js --config ./config.json

Para modificar los datos de entrada, edita la variable INPUT_DATA en este script.
  `);
}

// Función para cargar configuración desde archivo
function loadConfigFromFile(filePath) {
  try {
    const fs = require("fs");
    const config = JSON.parse(fs.readFileSync(filePath, "utf8"));

    // Merge con configuración por defecto
    Object.assign(INPUT_DATA, config);
    console.log(`✅ Configuración cargada desde: ${filePath}`);
  } catch (error) {
    console.error(
      `❌ Error al cargar configuración desde ${filePath}:`,
      error.message
    );
    process.exit(1);
  }
}

// Función para modo dry-run
function dryRun() {
  console.log("🧪 Modo DRY-RUN - No se realizarán llamadas reales");
  console.log("📋 Datos de entrada configurados:");
  console.log(JSON.stringify(INPUT_DATA, null, 2));
  console.log("\n📋 Pasos que se ejecutarían:");
  console.log("1. Autenticación con:", INPUT_DATA.auth.username);
  console.log("2. Crear orden con", INPUT_DATA.items.length, "items");
  console.log("3. Autorizar transacción para orden");
  console.log("\n✅ Simulación completada (modo dry-run)");
}

// Procesar argumentos de línea de comandos
function processArguments() {
  const args = process.argv.slice(2);

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    switch (arg) {
      case "--help":
      case "-h":
        showHelp();
        process.exit(0);
        break;

      case "--config":
        if (i + 1 < args.length) {
          loadConfigFromFile(args[i + 1]);
          i++; // Skip next argument
        } else {
          console.error("❌ Error: --config requiere un archivo");
          process.exit(1);
        }
        break;

      case "--dry-run":
        dryRun();
        process.exit(0);
        break;

      default:
        console.error(`❌ Opción desconocida: ${arg}`);
        showHelp();
        process.exit(1);
    }
  }
}

// Ejecutar script
if (require.main === module) {
  processArguments();
  simulateTicketPurchase();
}

module.exports = {
  ApiClient,
  simulateTicketPurchase,
  INPUT_DATA,
};
