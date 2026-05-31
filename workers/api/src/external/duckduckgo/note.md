# DuckDuckGo API (provided by RapidAPI)

## Request Example

```js
const url = "https://duckduckgo8.p.rapidapi.com/?q=Nike";
const options = {
  method: "GET",
  headers: {
    "x-rapidapi-key": "<RAPIDAPI_TOKEN>",
    "x-rapidapi-host": "duckduckgo8.p.rapidapi.com",
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

## Response

### Response Data

Real data from real-world request: refer to [response.body.json](./response.body.json)

### Response Header

Provided by Rapid API

Refer to [response.header.json](./response.header.json)
