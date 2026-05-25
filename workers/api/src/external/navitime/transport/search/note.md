# Navitime API - Transport Node

## Official Document

<https://api-sdk.navitime.co.jp/api/specs/api_guide/transport_node.html>

## Request Example

```js
const url = 'https://navitime-transport.p.rapidapi.com/transport_node?word=%E6%9D%B1%E4%BA%AC&coord_unit=degree&offset=0&datum=wgs84&limit=10';
const options = {
  method: 'GET',
  headers: {
  'x-rapidapi-key': '<RAPIDAPI_KEY>',
  'x-rapidapi-host': 'navitime-transport.p.rapidapi.com',
  'Content-Type': 'application/json'
  }
};

try {
  const response = await fetch(url, options);
  const result = await response.text();
  console.log(result);
} catch (error) {
  console.error(error);
}
```

### Response

#### Response Data

Real data from real-world request: refer to [response.body.json](./response.body.json)

#### Response Schema

Provided by Rapid API

Refer to [response.type.json](./response.schema.json)

#### Response Header

Provided by Rapid API

Refer to [response.header.json](./response.header.json)
