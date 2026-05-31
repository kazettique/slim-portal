# Google Map Places API / Place Details (provided by RapidAPI)

## Request Example

```js
const url = "https://google-map-places-new-v2.p.rapidapi.com/v1/places/ChIJj61dQgK6j4AR4GeTYWZsKWw";
const options = {
  method: "GET",
  headers: {
    "x-rapidapi-key": "<RAPIDAPI_TOKEN>",
    "x-rapidapi-host": "google-map-places-new-v2.p.rapidapi.com",
    "Content-Type": "application/json",
    "X-Goog-FieldMask": "*",
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

#### Response Schema

Provided by Rapid API

Refer to [response.type.json](./response.schema.json)
