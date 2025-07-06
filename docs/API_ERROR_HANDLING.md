# Sistema de Manejo de Errores de API - MangoTicket

## Resumen de Mejoras

El módulo `api.ts` ha sido completamente refactorizado para implementar un sistema robusto de manejo de errores con las siguientes mejoras:

### 🎯 Principales Mejoras

1. **Tipos de Error Personalizados**: Sistema de enumeración para categorizar errores
2. **Manejo Centralizado**: Clase `ApiErrorHandler` para procesar errores de forma consistente
3. **Reintentos Automáticos**: Sistema de retry con backoff exponencial
4. **Timeouts Configurables**: Control de tiempos de espera
5. **Logging Mejorado**: Logs estructurados con contexto y timestamps
6. **Mensajes de Usuario**: Traducción automática de errores técnicos a mensajes amigables
7. **Hooks Personalizados**: React hooks para manejo de errores en componentes

## 📋 Tipos de Error

```typescript
export enum ApiErrorType {
  NETWORK_ERROR = "NETWORK_ERROR",           // Errores de conexión
  AUTHENTICATION_ERROR = "AUTHENTICATION_ERROR", // Token expirado/inválido
  AUTHORIZATION_ERROR = "AUTHORIZATION_ERROR",   // Sin permisos
  VALIDATION_ERROR = "VALIDATION_ERROR",     // Datos inválidos
  SERVER_ERROR = "SERVER_ERROR",             // Errores 5xx
  SERVICE_UNAVAILABLE = "SERVICE_UNAVAILABLE", // Servicio no disponible
  UNKNOWN_ERROR = "UNKNOWN_ERROR",           // Errores no categorizados
}
```

## 🔧 Estructura de Error

```typescript
interface ApiError {
  type: ApiErrorType;
  message: string;
  statusCode?: number;
  originalError?: any;
  timestamp: Date;
}
```

## 🚀 Uso Básico

### Antes (Código Original)
```typescript
// ❌ Manejo inconsistente de errores
try {
  const response = await fetch(url);
  if (response.status === 503) {
    console.log("Unavailable service");
    return [];
  } else if (response.status !== 200) {
    console.log("response", response);
    return [];
  }
  // ...
} catch (error) {
  console.log("error", error);
  throw new Error(error);
}
```

### Después (Nuevo Sistema)
```typescript
// ✅ Manejo consistente y estructurado
const result = await client.makeRequest(document, variables, "OperationName");
if (result.error) {
  // El error ya está categorizado y procesado
  console.error(result.error.message);
  return;
}
// Usar result.data
```

## 🎣 Hooks Personalizados

### Hook General
```typescript
import { useApiWithErrorHandling } from '@/hooks/useApiWithErrorHandling';

const MyComponent = () => {
  const { executeRequest, loading, error, userMessage, data } = useApiWithErrorHandling({
    retryConfig: {
      maxAttempts: 3,
      baseDelay: 1000,
      maxDelay: 5000,
      backoffMultiplier: 2,
    },
    onError: (error) => {
      // Callback personalizado para errores
      console.log('Error personalizado:', error);
    },
  });

  const fetchData = async () => {
    const result = await executeRequest(
      () => Client.getInstance().getEvents(),
      'getEvents'
    );
    
    if (result) {
      // Datos obtenidos exitosamente
      console.log(result);
    }
  };

  return (
    <div>
      {loading && <Text>Cargando...</Text>}
      {error && <Text>Error: {userMessage}</Text>}
      {data && <Text>Datos: {JSON.stringify(data)}</Text>}
    </div>
  );
};
```

### Hook de Autenticación
```typescript
import { useAuthWithErrorHandling } from '@/hooks/useApiWithErrorHandling';

const LoginComponent = () => {
  const { signIn, loading, error, userMessage } = useAuthWithErrorHandling();

  const handleLogin = async () => {
    const result = await signIn(username, password, 'mobile');
    if (result) {
      // Login exitoso
      navigation.navigate('Dashboard');
    }
  };

  return (
    <View>
      {error && <Text style={{color: 'red'}}>{userMessage}</Text>}
      <Button 
        title="Iniciar Sesión" 
        onPress={handleLogin}
        disabled={loading}
      />
    </View>
  );
};
```

### Hook de Pagos
```typescript
import { usePaymentsWithErrorHandling } from '@/hooks/useApiWithErrorHandling';

const PaymentComponent = () => {
  const { createPayment, confirmPayment, loading, error, userMessage } = usePaymentsWithErrorHandling();

  const handlePayment = async () => {
    const payment = await createPayment(paymentData);
    if (payment) {
      const confirmation = await confirmPayment(payment.id);
      if (confirmation) {
        // Pago exitoso
        navigation.navigate('Success');
      }
    }
  };

  return (
    <View>
      {error && <Text style={{color: 'red'}}>{userMessage}</Text>}
      <Button 
        title="Pagar" 
        onPress={handlePayment}
        disabled={loading}
      />
    </View>
  );
};
```

## ⚙️ Configuración

### Configuración de Reintentos
```typescript
const retryConfig = {
  maxAttempts: 3,        // Número máximo de intentos
  baseDelay: 1000,       // Delay inicial en ms
  maxDelay: 10000,       // Delay máximo en ms
  backoffMultiplier: 2,  // Multiplicador exponencial
};
```

### Configuración de Timeouts
```typescript
const apiConfig = {
  baseUrl: MANGO_API_URL,
  timeout: 30000,        // 30 segundos
  retryAttempts: 3,
  retryDelay: 1000,      // 1 segundo
};
```

## 🔍 Utilidades de Error

### Mensajes de Usuario
```typescript
import { ApiErrorUtils } from '@/lib/api-utils';

const userMessage = ApiErrorUtils.getUserFriendlyMessage(error);
// "Error de conexión. Verifica tu conexión a internet e intenta nuevamente."
```

### Verificación de Tipo de Error
```typescript
// Verificar si requiere reautenticación
if (ApiErrorUtils.requiresReauthentication(error)) {
  // Redirigir al login
  navigation.navigate('Login');
}

// Verificar si es recuperable
if (ApiErrorUtils.isRecoverable(error)) {
  // Mostrar opción de reintentar
  showRetryButton();
}
```

### Logging Estructurado
```typescript
const logMessage = ApiErrorUtils.formatForLogging(error, 'LoginComponent');
// "[LoginComponent] 2024-01-15T10:30:00.000Z - AUTHENTICATION_ERROR: Token expirado (401)"
```

## 📊 Monitoreo y Analytics

### Integración con Sentry
```typescript
// En api-utils.ts
import * as Sentry from '@sentry/react-native';

const handleError = (error: ApiError, context?: string) => {
  // Log del error
  console.error(ApiErrorUtils.formatForLogging(error, context));
  
  // Enviar a Sentry para monitoreo
  Sentry.captureException(error.originalError || error, {
    tags: {
      errorType: error.type,
      context: context,
    },
    extra: {
      statusCode: error.statusCode,
      timestamp: error.timestamp,
    },
  });
  
  return {
    userMessage: ApiErrorUtils.getUserFriendlyMessage(error),
    requiresReauth: ApiErrorUtils.requiresReauthentication(error),
    isRecoverable: ApiErrorUtils.isRecoverable(error),
    retryDelay: ApiErrorUtils.getRetryDelay(error),
  };
};
```

## 🧪 Testing

### Test de Hooks
```typescript
import { renderHook, act } from '@testing-library/react-hooks';
import { useApiWithErrorHandling } from '@/hooks/useApiWithErrorHandling';

test('should handle network errors correctly', async () => {
  const { result } = renderHook(() => useApiWithErrorHandling());

  await act(async () => {
    await result.current.executeRequest(
      () => Promise.resolve({ error: networkError }),
      'test'
    );
  });

  expect(result.current.error?.type).toBe('NETWORK_ERROR');
  expect(result.current.userMessage).toContain('Error de conexión');
});
```

### Test de Utilidades
```typescript
import { ApiErrorUtils } from '@/lib/api-utils';

test('should return correct user message for network error', () => {
  const error = {
    type: 'NETWORK_ERROR' as ApiErrorType,
    message: 'Network request failed',
    timestamp: new Date(),
  };

  const message = ApiErrorUtils.getUserFriendlyMessage(error);
  expect(message).toContain('Error de conexión');
});
```

## 📈 Métricas y KPIs

### Métricas Recomendadas
- **Tasa de Error por Tipo**: Monitorear distribución de errores
- **Tiempo de Recuperación**: Medir efectividad de reintentos
- **Satisfacción del Usuario**: Feedback sobre mensajes de error
- **Tiempo de Resolución**: Desde error hasta solución

### Dashboard Sugerido
```typescript
interface ErrorMetrics {
  totalErrors: number;
  errorsByType: Record<ApiErrorType, number>;
  averageRetryAttempts: number;
  successRateAfterRetry: number;
  mostCommonErrors: Array<{
    type: ApiErrorType;
    count: number;
    percentage: number;
  }>;
}
```

## 🔄 Migración

### Pasos para Migrar Código Existente

1. **Reemplazar llamadas directas a fetch**:
```typescript
// Antes
const response = await fetch(url);

// Después
const result = await client.makeRequest(query, variables, 'OperationName');
```

2. **Actualizar manejo de errores**:
```typescript
// Antes
if (response.status !== 200) {
  console.log("Error:", response);
  return [];
}

// Después
if (result.error) {
  console.error(result.error.message);
  return null;
}
```

3. **Usar hooks personalizados**:
```typescript
// Antes
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

// Después
const { loading, error, userMessage, executeRequest } = useApiWithErrorHandling();
```

## 🎯 Beneficios

### Para Desarrolladores
- ✅ Código más limpio y mantenible
- ✅ Manejo consistente de errores
- ✅ Mejor debugging con logs estructurados
- ✅ Reutilización de lógica de errores

### Para Usuarios
- ✅ Mensajes de error claros y útiles
- ✅ Reintentos automáticos transparentes
- ✅ Mejor experiencia de usuario
- ✅ Menos frustración por errores técnicos

### Para el Negocio
- ✅ Reducción de tickets de soporte
- ✅ Mejor monitoreo de problemas
- ✅ Datos para mejorar la aplicación
- ✅ Mayor confiabilidad del sistema

## 🚨 Consideraciones de Seguridad

1. **No exponer información sensible** en mensajes de error
2. **Validar inputs** antes de enviar a la API
3. **Manejar tokens de forma segura** en AsyncStorage
4. **Implementar rate limiting** para prevenir abuso
5. **Logging seguro** sin datos personales

## 📚 Recursos Adicionales

- [Documentación de React Native](https://reactnative.dev/)
- [GraphQL Error Handling](https://graphql.org/learn/best-practices/#errors)
- [Sentry React Native](https://docs.sentry.io/platforms/react-native/)
- [AsyncStorage Best Practices](https://react-native-async-storage.github.io/async-storage/) 