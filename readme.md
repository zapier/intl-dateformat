<h1 align="center">
  <img src="./art.png" width="600" height="300" />
</h1>

<h4 align="center">Format a date using Intl.DateTimeFormat goodness.</h4>

<p align="center">
  <img alt="GitHub Checks" src="https://img.shields.io/github/check-runs/zapier/intl-dateformat/master">
  <a href="https://www.npmjs.com/package/intl-dateformat">
    <img alt="NPM Version" src="https://img.shields.io/npm/v/intl-dateformat">
  </a>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#installation">Installation</a> •
  <a href="#example">Example</a> •
  <a href="#usage">Usage</a>
</p>

**intl-dateformat** is a simple date formatting library that leverage the [Intl.DateTimeFormat](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/DateTimeFormat) API to format dates in different languages and timezones without having to clutter your JavaScript bundles.

## Features

- ✌ **Small**: As it directly leverages `Intl.DateTimeFormat`, there is no need to bundle additional locales or a timezones database. It's already in your Browser!
- 👌 **Simple**: It supports a subset of ISO 8601 formats, discarding very rarely used date parts.
- 🤟 **Extensible**: That said, if you want to customize things you can pass [custom formatters](#custom-formatters).

## Installation

```js
// NPM
$ npm install intl-dateformat
// Yarn
$ yarn add intl-dateformat
// PNPM
$ pnpm add intl-dateformat
```

## Example

```js
import formatDate from 'intl-dateformat'

const date = new Date(Date.UTC(1984, 0, 17, 16, 13, 37, 0))

formatDate(date, 'YYYY-MM-DD hh:mm:ss A')
// → 1984-01-17 04:13:37 PM
formatDate(date, 'YYYY-MM-DD hh:mm:ss A', { timezone: 'Asia/Singapore' })
// → 1984-01-18 00:13:37 AM
formatDate(date, 'YYYY, MMMM dddd DD')
// → 1984, January Tuesday 17
formatDate(date, '[It is] dddd [today!]')
// → It is Tuesday today!
formatDate(date, 'YYYY, MMMM dddd DD', { locale: 'fr' })
// → 1984, Janvier Mardi 17
```

## Usage

```js
import formatDate from 'intl-dateformat'

const date = new Date(Date.UTC(1984, 0, 17, 16, 13, 37, 0))

formatDate(date, 'YYYY-MM-DD hh:mm:ss A')
// → 1984-01-17 04:13:37 PM
```

| Argument  | Description               | Type                    |
| --------- | ------------------------- | ----------------------- |
| `date`    | The date to format        | `Date`, `number`        |
| `format`  | The format to use         | See [Format](#format)   |
| `options` | Custom locale or timezone | See [Options](#options) |

### Format

The format is a combination of the following masks:

| Mask   | Description               | Example       |
| ------ | ------------------------- | ------------- |
| `YYYY` | 4-digits year             | `1984`        |
| `YY`   | 2-digits year             | `84`          |
| `MMMM` | Month name                | `January`     |
| `MMM`  | Short month name          | `Jan`         |
| `DD`   | 2-digits day              | `17`          |
| `dddd` | Day of the week           | `Tuesday`     |
| `ddd`  | Short day of the week     | `Tue`         |
| `A`    | Day period                | `AM`, `PM`    |
| `a`    | Lowercased day period     | `am`, `pm`    |
| `HH`   | 24-hours hour             | `16`          |
| `hh`   | 12-hours hour             | `04`          |
| `mm`   | 2-digit minute            | `13`          |
| `ss`   | 2-digit second            | `37`          |
| `SSS`  | 3-digit fractional second | `123`         |
| `XXX`  | Timezone offset or 'Z'    | `+10:00`, `Z` |

Masks will be replaced by their associated date part.

You can also pass string literals in the format by surrouding them with a `[]`:

```js
formatDate(date, '[It is] dddd [today!]')
// → It is Tuesday today!
```

### Options

- `locale` - A [BCP 47](https://tools.ietf.org/html/bcp47) tag to identify the output language
  - Type: `string`
  - Default: The system locale
  - Example: `fr`, `fr-FR`
- `timezone` - A [IANA timezone](https://www.iana.org/time-zones)
  - Type: `string`
  - Default: The system timezone
  - Example: `Europe/Paris`, `America/Chicago`

## Custom formatters

If you find yourself missing some date parts, no problem we got you covered. You can create your own `dateFormat` function and add your custom formatters:

```js
import { createDateFormatter } from 'intl-dateformat'

const formatDate = createDateFormatter({
  // numeric hour
  h: ({ hour }) => hour[0] === '0' ? hour[1] : hour
  // milliseconds
  SSS: (parts, date) => String(date.getTime()).slice(-3)
})

const date = new Date(Date.UTC(1984, 0, 17, 16, 13, 37, 0))

formatDate(date, 'YYYY-MM-DD h:mm:ss.SSS')
// → 1984-01-17 4:13:37.505
```

| Argument     | Description       | Type                          |
| ------------ | ----------------- | ----------------------------- |
| `formatters` | Custom formatters | See [Formatters](#formatters) |

### Formatters

Formatters are represented as a dictionary of functions, where the key represents the mask that is to be matched in the `format` and the value is the function that will format the date.

The formatter function takes the following arguments:

- `parts` - An object containing all the date parts provided by `Intl.DateTimeFormat`. You can inspect the [DatePartName](./src/types.ts) type for an exhaustive list of all the date parts
- `date` - The original date passed to the `formatDate` function.
