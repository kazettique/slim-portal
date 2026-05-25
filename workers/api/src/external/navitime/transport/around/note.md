# Navitime API - Transport Around

## Official Document

<https://api-sdk.navitime.co.jp/api/specs/api_guide/transport_node-around.html>

## Example

```js
const url = 'https://navitime-transport.p.rapidapi.com/transport_node/around?coord=35.689457%2C139.691935&limit=10&term=60&datum=wgs84&coord_unit=degree&walk_speed=5';
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
