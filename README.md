# NestJS demo api with MongoDB

API [requirements.](https://www.notion.so/Transaction-Pricing-API-92fa9139981f483d9128c6c30eb8af01)

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Docker

### Building the Docker Image
```bash
$ docker build -t nestjsdemoapi .
```

### Running the Docker Image
```bash
$ docker run --publish 3000:3000 --name nestjsdemoapi nestjsdemoapi
```

## NestJS demo API endpoints

### GET ```/transactions``` - get all transactions
```js
// Response example
[
    {
        "id": "60a25548abd9a1027f157dcb",
        "date": "2021-01-01T15:50:50",
        "amount": "99.00",
        "currency": "EUR",
        "client_id": 5
    },
    {
        "id": "60a26169dc2a000677078803",
        "date": "2021-01-01T15:50:50",
        "amount": "100.00",
        "currency": "EUR",
        "client_id": 55,
        "commission_amount": "0.5",
        "commission_currency": "EUR"
    },
    {
        "id": "60a2619a9917ae0696e80108",
        "date": "2021-01-01T15:50:50",
        "amount": "100.00",
        "currency": "EUR",
        "client_id": 55,
        "commission_amount": "0.5",
        "commission_currency": "EUR"
    }
]
```

### POST ```/transactions``` - create transaction
```js
// Request BODY example
{
    "date": "2021-01-01T15:50:50",
    "amount": "500.00",
    "currency": "USD",
    "client_id": 55
}
```

```js
// Response example
{
    "commission_amount": "0.04",
    "commission_currency": "EUR"
}
```

### GET ```/transactions/client/{id}``` - get all transactions by client id
```js
// Response example
[
    {
        "id": "60a2a0d0ba0b1a1fadb3ca0b",
        "date": "2021-01-01T15:50:50",
        "amount": "500.00",
        "currency": "USD",
        "client_id": 9999999,
        "commission_amount": "2.06",
        "commission_currency": "EUR"
    }
]
```

### GET ```/transactions/{id}``` - get transaction by transaction id
```js
// Response example
{
    "id": "60a2619a9917ae0696e80108",
    "date": "2021-01-01T15:50:50",
    "amount": "100.00",
    "currency": "EUR",
    "client_id": 55,
    "commission_amount": "0.5",
    "commission_currency": "EUR"
}
```

### PATCH ```/transactions/{id}``` - update transaction by transaction id
```js
// Request BODY example
{
    "amount": "777.00",
    "currency": "USD"
}
```

### DELETE ```/transactions/{id}``` - delete transaction by transaction id
```
// Response
status 200
```

### DELETE ```/transactions/client/{id}``` - delete all transactions by client id
```
// Response
status 200
```

## License
[MIT](https://choosealicense.com/licenses/mit/)