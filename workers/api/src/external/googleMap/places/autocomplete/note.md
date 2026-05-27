# Google Map Places API / Autocomplete (provided by RapidAPI)

## Request Example

```js
const url = 'https://google-map-places-new-v2.p.rapidapi.com/v1/places:autocomplete';
const options = {
  method: 'POST',
  headers: {
    'x-rapidapi-key': '<RAPIDAPI_TOKEN>',
    'x-rapidapi-host': 'google-map-places-new-v2.p.rapidapi.com',
    'Content-Type': 'application/json',
    'X-Goog-FieldMask': '*'
  },
  body: {
    input: 'Restaurant',
    locationBias: {
      circle: {
        center: {
          latitude: 35.690887451171875,
          longitude: 139.7022247314453
        },
        radius: 10000
      }
    },
    includedPrimaryTypes: [],
    includedRegionCodes: [],
    languageCode: '',
    regionCode: '',
    origin: {
      latitude: 0,
      longitude: 0
    },
    inputOffset: 0,
    includeQueryPredictions: true,
    sessionToken: ''
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
