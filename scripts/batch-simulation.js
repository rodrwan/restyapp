#!/usr/bin/env node

/**
 * Script para ejecutar múltiples simulaciones de compra de entradas
 * Permite probar diferentes escenarios de manera batch
 */

const {
  ApiClient,
  simulateTicketPurchase,
} = require("./simulate-ticket-purchase.js");

// Configuraciones de prueba
const TEST_SCENARIOS = [
  {
    name: "Escenario 1: Compra simple - 1 ticket",
    config: {
      auth: {
        username: "test@mangoticket.com",
        password: "password123",
        source: "mangoticket",
      },
      items: [
        {
          id: "ticket-123",
          name: "Ticket General",
          type: "ENTRANCE",
          price: 25000,
          quantity: 1,
          cover: false,
          event_id: "event-456",
        },
      ],
      payment: {
        terms_and_conditions_signed: true,
        alcohol_signed: true,
        installments: 0,
        nominated_items: [
          {
            email: "johndoe@mangoticket.com",
            dni: "11.111.111-1",
          },
        ],
      },
    },
  },
  {
    name: "Escenario 2: Compra múltiple - tickets + bebidas",
    config: {
      auth: {
        username: "test@mangoticket.com",
        password: "password123",
        source: "mangoticket",
      },
      items: [
        {
          id: "ticket-123",
          name: "Ticket General",
          type: "ENTRANCE",
          price: 25000,
          quantity: 2,
          cover: true,
          event_id: "event-456",
        },
        {
          id: "drink-789",
          name: "Cerveza",
          type: "DRINK",
          price: 5000,
          quantity: 3,
          event_id: "event-456",
        },
      ],
      payment: {
        terms_and_conditions_signed: true,
        alcohol_signed: true,
        installments: 0,
        nominated_items: [
          {
            email: "johndoe@mangoticket.com",
            dni: "11.111.111-1",
          },
          {
            email: "janedoe@mangoticket.com",
            dni: "22.222.222-2",
          },
        ],
      },
    },
  },
  {
    name: "Escenario 3: Compra con cuotas",
    config: {
      auth: {
        username: "test@mangoticket.com",
        password: "password123",
        source: "mangoticket",
      },
      items: [
        {
          id: "ticket-vip",
          name: "Ticket VIP",
          type: "ENTRANCE",
          price: 50000,
          quantity: 1,
          cover: true,
          event_id: "event-456",
        },
      ],
      payment: {
        terms_and_conditions_signed: true,
        alcohol_signed: true,
        installments: 3,
        nominated_items: [
          {
            email: "vip@mangoticket.com",
            dni: "33.333.333-3",
          },
        ],
      },
    },
  },
];

// Función para ejecutar un escenario individual
async function runScenario(scenario, index) {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`🎯 Ejecutando: ${scenario.name}`);
  console.log(`${"=".repeat(60)}`);

  const client = new ApiClient("http://localhost:8080/graphql");

  try {
    // Step 1: Autenticación
    console.log("\n📋 Paso 1: Autenticación");
    await client.signIn(scenario.config.auth);

    // Step 2: Crear orden
    console.log("\n📋 Paso 2: Crear orden");
    const orderItems = scenario.config.items.flatMap((item) => {
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
    const order = await client.createOrder(orderData);
    console.log(`✅ Orden creada: ${order.id}`);

    // Step 3: Autorizar transacción
    console.log("\n📋 Paso 3: Autorizar transacción");
    const paymentData = {
      order_id: order.id,
      terms_and_conditions_signed:
        scenario.config.payment.terms_and_conditions_signed,
      alcohol_signed: scenario.config.payment.alcohol_signed,
      installments: scenario.config.payment.installments,
      nominated_items: scenario.config.payment.nominated_items.map(
        (nominee, idx) => ({
          order_id: order.id,
          order_item_id: idx + 1,
          email: nominee.email,
          dni: nominee.dni,
        })
      ),
    };

    const transaction = await client.authorizeTransaction(paymentData);
    console.log(`✅ Transacción autorizada: ${transaction.status}`);

    // Resumen del escenario
    console.log("\n📊 Resumen del escenario:");
    console.log(`   - Orden ID: ${order.id}`);
    console.log(`   - Estado: ${transaction.status}`);
    console.log(`   - Items: ${order.items.length}`);
    console.log(
      `   - Total nominados: ${scenario.config.payment.nominated_items.length}`
    );
    console.log(`   - Cuotas: ${scenario.config.payment.installments}`);

    return {
      success: true,
      orderId: order.id,
      status: transaction.status,
      itemsCount: order.items.length,
    };
  } catch (error) {
    console.error(`❌ Error en escenario ${index + 1}:`, error.message);
    return {
      success: false,
      error: error.message,
    };
  }
}

// Función principal para ejecutar todos los escenarios
async function runBatchSimulation() {
  console.log("🚀 Iniciando simulación batch de compra de entradas...\n");

  const results = [];
  const startTime = Date.now();

  for (let i = 0; i < TEST_SCENARIOS.length; i++) {
    const scenario = TEST_SCENARIOS[i];
    const result = await runScenario(scenario, i);

    results.push({
      scenario: scenario.name,
      ...result,
    });

    // Pausa entre escenarios para no sobrecargar el servidor
    if (i < TEST_SCENARIOS.length - 1) {
      console.log("\n⏳ Esperando 2 segundos antes del siguiente escenario...");
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }

  // Resumen final
  const endTime = Date.now();
  const totalTime = (endTime - startTime) / 1000;

  console.log(`\n${"=".repeat(60)}`);
  console.log("📊 RESUMEN FINAL DE SIMULACIÓN BATCH");
  console.log(`${"=".repeat(60)}`);

  let successCount = 0;
  let failureCount = 0;

  results.forEach((result, index) => {
    if (result.success) {
      successCount++;
      console.log(`✅ ${index + 1}. ${result.scenario}`);
      console.log(`   - Orden: ${result.orderId}`);
      console.log(`   - Estado: ${result.status}`);
      console.log(`   - Items: ${result.itemsCount}`);
    } else {
      failureCount++;
      console.log(`❌ ${index + 1}. ${result.scenario}`);
      console.log(`   - Error: ${result.error}`);
    }
    console.log("");
  });

  console.log(`🎯 Estadísticas:`);
  console.log(`   - Total escenarios: ${results.length}`);
  console.log(`   - Exitosos: ${successCount}`);
  console.log(`   - Fallidos: ${failureCount}`);
  console.log(`   - Tiempo total: ${totalTime.toFixed(2)} segundos`);
  console.log(
    `   - Tiempo promedio: ${(totalTime / results.length).toFixed(
      2
    )} segundos por escenario`
  );

  if (failureCount > 0) {
    process.exit(1);
  }
}

// Función para mostrar ayuda
function showHelp() {
  console.log(`
🚀 Simulador Batch de Compra de Entradas - MangoTicket

Uso:
  node batch-simulation.js [opciones]

Opciones:
  --help, -h          Mostrar esta ayuda
  --scenario <num>    Ejecutar solo un escenario específico (1-${TEST_SCENARIOS.length})
  --list              Listar todos los escenarios disponibles

Ejemplos:
  node batch-simulation.js                    # Ejecutar todos los escenarios
  node batch-simulation.js --scenario 1      # Ejecutar solo el primer escenario
  node batch-simulation.js --list            # Ver escenarios disponibles

Los escenarios están predefinidos en el script y cubren diferentes casos de uso.
  `);
}

// Función para listar escenarios
function listScenarios() {
  console.log("📋 Escenarios disponibles:\n");
  TEST_SCENARIOS.forEach((scenario, index) => {
    console.log(`${index + 1}. ${scenario.name}`);
    console.log(`   - Items: ${scenario.config.items.length}`);
    console.log(
      `   - Nominados: ${scenario.config.payment.nominated_items.length}`
    );
    console.log(`   - Cuotas: ${scenario.config.payment.installments}`);
    console.log("");
  });
}

// Función para ejecutar un escenario específico
async function runSpecificScenario(scenarioNumber) {
  const index = scenarioNumber - 1;

  if (index < 0 || index >= TEST_SCENARIOS.length) {
    console.error(
      `❌ Error: Escenario ${scenarioNumber} no existe. Escenarios disponibles: 1-${TEST_SCENARIOS.length}`
    );
    process.exit(1);
  }

  console.log(`🎯 Ejecutando escenario específico: ${scenarioNumber}`);
  const result = await runScenario(TEST_SCENARIOS[index], index);

  if (result.success) {
    console.log("\n✅ Escenario ejecutado exitosamente");
  } else {
    console.log("\n❌ Escenario falló");
    process.exit(1);
  }
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

      case "--list":
        listScenarios();
        process.exit(0);
        break;

      case "--scenario":
        if (i + 1 < args.length) {
          const scenarioNumber = parseInt(args[i + 1]);
          if (isNaN(scenarioNumber)) {
            console.error("❌ Error: --scenario requiere un número válido");
            process.exit(1);
          }
          runSpecificScenario(scenarioNumber);
          return; // No ejecutar batch simulation
        } else {
          console.error("❌ Error: --scenario requiere un número");
          process.exit(1);
        }
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
  runBatchSimulation();
}

module.exports = {
  runBatchSimulation,
  runScenario,
  TEST_SCENARIOS,
};
