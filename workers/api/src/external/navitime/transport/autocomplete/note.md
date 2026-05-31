# Navitime API - Transport Autocomplete

## Official Document

<https://api-sdk.navitime.co.jp/api/specs/api_guide/transport_node-autocomplete.html>

## Example

```js
const url =
  "https://navitime-transport.p.rapidapi.com/transport_node/autocomplete?word=%E3%81%A8%E3%81%86%EF%BD%8B&word_match=prefix&coord=35.689457%2C139.691935&radius=10000&datum=wgs84&coord_unit=degree";
const options = {
  method: "GET",
  headers: {
    "x-rapidapi-key": "<REPIDAPI_KEY>",
    "x-rapidapi-host": "navitime-transport.p.rapidapi.com",
    "Content-Type": "application/json",
  },
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
