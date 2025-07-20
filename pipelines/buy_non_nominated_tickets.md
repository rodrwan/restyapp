## Step 1

Seleccionar las entradas a comprar.

Datos de entrada

```JS
[
    {
        id: "ticket-123",
        name: "Ticket General",
        type: "ENTRANCE",
        price: 25000,
        quantity: 2,
        cover: true,
        event_id: "event-456"
    },
    {
        id: "drink-789",
        name: "Cerveza",
        type: "DRINK", 
        price: 5000,
        quantity: 3,
        event_id: "event-456"
    }
]
```

## Step 2

Se llama al backend con la información capturada en le paso anterior.

#### Llamada:
##### orderData: 
```json
{
    items: [
        {
            event_id: "event-123"
            item_id: "item-123",
            quantity: 1,
            with_cover: false,
        }
    ]
}
```

```js
async createOrder(orderData: any): Promise<ApiResponse<any>> {
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

    return this.makeRequest(
        document,
        { input: orderData },
        "CreateOrder",
        true
    );
}
```

#### Respuesta:

```json
{
    "id": "event-123",
    "items": [
        {
            "id": "item-123",
            "type": "DRINK",
            "name": "Piscola",
        }
    ]
}
```

## Step 3

Se envia confirmación de compra.

#### Request:

paymentData
```JSON
{
    "order_id": "order-123",
    "terms_and_conditions_signed": true,
    "alcohol_signed": true,
    "installments": 0,
    "nominated_items":[
        {
            "order_id": "order-123",
            "order_item_id": 1,
            "email": "johndoe@mangoticket.com",
            "dni": "11.111.111-1",
        }
    ]
}
```
Llamada:
```js
async authorizeTransaction(paymentData: any): Promise<ApiResponse<any>> {
    const document = graphql.gql`
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
```

