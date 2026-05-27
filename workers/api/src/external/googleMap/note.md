# Google Map Places API (provided by RapidAPI)

## Official API document

<https://api-sdk.navitime.co.jp/api/specs/api_guide/route_transit.html>

## Request Example

```js
const url = 'https://navitime-route-totalnavi.p.rapidapi.com/route_transit?start=35.665251%2C139.712092&goal=35.661971%2C139.703795&datum=wgs84&term=1440&limit=5&start_time=2020-08-19T10%3A00%3A00&coord_unit=degree';
const options = {
 method: 'GET',
 headers: {
  'x-rapidapi-key': '<RAPIDAPI_KEY>',
  'x-rapidapi-host': 'navitime-route-totalnavi.p.rapidapi.com',
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
