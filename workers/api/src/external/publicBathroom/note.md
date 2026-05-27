# Public Bathroom / GetByCords (provided by RapidAPI)

## Request Example

```js
const url = 'https://public-bathrooms.p.rapidapi.com/api/getByCords?lat=40.7128&lng=-74.0060&radius=10&page=1&per_page=10';
const options = {
  method: 'GET',
  headers: {
    'x-rapidapi-key': '<RAPIDAPI_KEY>',
    'x-rapidapi-host': 'public-bathrooms.p.rapidapi.com',
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
