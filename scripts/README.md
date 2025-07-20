# 🎫 Scripts de Simulación de Compra de Entradas

Este directorio contiene scripts para simular el flujo completo de compra de entradas no nominadas en MangoTicket, permitiendo configurar datos de entrada y ejecutar las llamadas de manera fluida y rápida.

## 📁 Archivos

- `simulate-ticket-purchase.js` - Script principal para simular una compra individual
- `batch-simulation.js` - Script para ejecutar múltiples simulaciones con diferentes escenarios
- `config-example.json` - Archivo de configuración de ejemplo
- `README.md` - Este archivo

## 🚀 Uso Rápido

### Simulación Individual

```bash
# Ejecutar con configuración por defecto
node scripts/simulate-ticket-purchase.js

# Ejecutar con configuración personalizada
node scripts/simulate-ticket-purchase.js --config scripts/config-example.json

# Modo dry-run (sin llamadas reales)
node scripts/simulate-ticket-purchase.js --dry-run
```

### Simulación Batch

```bash
# Ejecutar todos los escenarios
node scripts/batch-simulation.js

# Ejecutar un escenario específico
node scripts/batch-simulation.js --scenario 1

# Ver escenarios disponibles
node scripts/batch-simulation.js --list
```

## ⚙️ Configuración

### Datos de Entrada

Los datos de entrada se pueden configurar de tres maneras:

1. **Directamente en el script** - Edita la variable `INPUT_DATA` en `simulate-ticket-purchase.js`
2. **Archivo de configuración** - Crea un archivo JSON y úsalo con `--config`
3. **Escenarios predefinidos** - Usa los escenarios en `batch-simulation.js`

### Estructura de Datos

```json
{
  "auth": {
    "username": "test@mangoticket.com",
    "password": "password123",
    "source": "mangoticket"
  },
  "items": [
    {
      "id": "ticket-123",
      "name": "Ticket General",
      "type": "ENTRANCE",
      "price": 25000,
      "quantity": 2,
      "cover": true,
      "event_id": "event-456"
    }
  ],
  "payment": {
    "terms_and_conditions_signed": true,
    "alcohol_signed": true,
    "installments": 0,
    "nominated_items": [
      {
        "email": "johndoe@mangoticket.com",
        "dni": "11.111.111-1"
      }
    ]
  }
}
```

## 🔄 Flujo de Simulación

El script simula exactamente el flujo documentado en `pipelines/buy_non_nominated_tickets.md`:

### Paso 1: Autenticación
- Se autentica con las credenciales proporcionadas
- Obtiene el token de acceso

### Paso 2: Crear Orden
- Transforma los items de entrada al formato requerido por la API
- Llama a `createOrder` con los datos procesados
- Recibe el ID de la orden creada

### Paso 3: Autorizar Transacción
- Prepara los datos de pago con la información de nominados
- Llama a `authorizeTransaction` con los datos de pago
- Recibe el estado de la transacción

## 📊 Escenarios Disponibles

### Escenario 1: Compra Simple
- 1 ticket de entrada
- Sin cover
- 1 nominado

### Escenario 2: Compra Múltiple
- 2 tickets de entrada con cover
- 3 bebidas
- 2 nominados

### Escenario 3: Compra con Cuotas
- 1 ticket VIP
- 3 cuotas
- 1 nominado

## 🛠️ Personalización

### Crear Nuevo Escenario

1. Edita `batch-simulation.js`
2. Agrega un nuevo objeto al array `TEST_SCENARIOS`:

```javascript
{
  name: "Mi Escenario Personalizado",
  config: {
    auth: { /* datos de autenticación */ },
    items: [ /* items a comprar */ ],
    payment: { /* datos de pago */ }
  }
}
```

### Crear Configuración Personalizada

1. Copia `config-example.json`
2. Modifica los datos según tus necesidades
3. Ejecuta: `node scripts/simulate-ticket-purchase.js --config mi-config.json`

## 🔧 Requisitos

- Node.js 14+
- Servidor de API ejecutándose en `http://localhost:8080/graphql`
- Dependencia `node-fetch` (incluida en el proyecto)

## 🐛 Troubleshooting

### Error de Conexión
```
❌ Error durante la simulación: Tiempo de espera agotado
```
- Verifica que el servidor esté ejecutándose
- Revisa la URL en `API_BASE_URL`

### Error de Autenticación
```
❌ Error durante la simulación: No se pudo obtener el token de acceso
```
- Verifica las credenciales en la configuración
- Asegúrate de que el usuario exista en el sistema

### Error de Validación
```
❌ Error durante la simulación: Error en la consulta GraphQL
```
- Revisa la estructura de los datos de entrada
- Verifica que los IDs de eventos e items sean válidos

## 📈 Monitoreo

Los scripts proporcionan logs detallados que incluyen:

- ✅ Confirmación de cada paso exitoso
- 📋 Datos de entrada procesados
- 📊 Resumen de resultados
- ⏱️ Tiempos de ejecución (en batch)
- ❌ Errores detallados con contexto

## 🔄 Integración con CI/CD

Los scripts pueden integrarse en pipelines de CI/CD:

```yaml
# Ejemplo para GitHub Actions
- name: Test Ticket Purchase Flow
  run: |
    node scripts/batch-simulation.js
```

## 📝 Notas

- Los scripts usan la misma lógica que la aplicación móvil
- Todos los timeouts y reintentos están configurados
- Los errores se manejan de manera robusta
- Los logs son compatibles con sistemas de monitoreo 