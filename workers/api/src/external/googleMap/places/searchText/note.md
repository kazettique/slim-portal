# Google Map Places API / Text Search (provided by RapidAPI)

## Request Example

```js
const url = "https://google-map-places-new-v2.p.rapidapi.com/v1/places:searchText";
const options = {
  method: "POST",
  headers: {
    "x-rapidapi-key": "<RAPIDAPI_TOKEN>",
    "x-rapidapi-host": "google-map-places-new-v2.p.rapidapi.com",
    "Content-Type": "application/json",
    "X-Goog-FieldMask": "*",
  },
  body: {
    textQuery: "restaurants",
    languageCode: "",
    regionCode: "",
    rankPreference: 0,
    includedType: "",
    openNow: true,
    minRating: 0,
    maxResultCount: 1,
    priceLevels: [],
    strictTypeFiltering: true,
    locationBias: {
      circle: {
        center: {
          latitude: 35.690887451171875,
          longitude: 139.7022247314453,
        },
        radius: 10000,
      },
    },
    evOptions: {
      minimumChargingRateKw: 0,
      connectorTypes: [],
    },
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
