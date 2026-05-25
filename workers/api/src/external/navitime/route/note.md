# Navitime API (provided by RapidAPI)

## Totalnavi

### Official API document

<https://api-sdk.navitime.co.jp/api/specs/api_guide/route_transit.html>

### Request Example

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

### Schema vs Actual Response

**Verdict: no contradictions — schema is incomplete, not wrong.**

The schema was auto-generated from an early/partial example. It correctly describes the top-level
envelope but left `summary.move` and `sections[]` items as bare `object` without enumerating their
properties.

#### Gaps in the schema

| Path                    | Schema                       | Actual body                                                                                                                     |
| ----------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `items[*].summary.move` | bare `object`                | `transit_count`, `walk_distance`, `type`, `from_time`, `to_time`, `time`, `distance`, `move_type[]`, `fare?`, `reference_fare?` |
| `items[*].sections[]`   | items typed as bare `object` | discriminated `"point"` / `"move"` structure — see `type.ts` for full shape                                                     |

#### What the schema covers correctly

| Path                                                                          | Schema type    | Matches body        |
| ----------------------------------------------------------------------------- | -------------- | ------------------- |
| `unit.coord_unit/currency/datum/distance/time`                                | `string`       | ✓                   |
| `items[*].summary.no`                                                         | `string`       | ✓ (`"1"`, `"2"`, …) |
| `items[*].summary.start` / `.goal` — `coord.lat`, `coord.lon`, `name`, `type` | typed fields   | ✓                   |
| `items` / `unit` top-level structure                                          | array / object | ✓                   |

#### Source of truth

`response.schema.json` is a reference-only file and is not imported or validated in code.
The TypeScript interfaces in [`type.ts`](./type.ts) are the authoritative definition and cover all
fields the schema omits.
