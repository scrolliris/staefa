# Scrolliris Readability Tracker

Code Name: `Stäfa /stäfa/`

[![pipeline status][pipeline]][commit] [![coverage report][coverage]][commit]
[![npm version][version]][npm]

[pipeline]: https://gitlab.com/scrolliris/scrolliris-readability-tracker/badges/master/build.svg
[coverage]: https://gitlab.com/scrolliris/scrolliris-readability-tracker/badges/master/coverage.svg
[commit]: https://gitlab.com/scrolliris/scrolliris-readability-tracker/commits/master
[version]: https://img.shields.io/npm/v/@lupine-software/scrolliris-readability-tracker.svg
[npm]: https://www.npmjs.com/package/@lupine-software/scrolliris-readability-tracker


```txt
               _
  ()     + +  | |
  /\_|_  __,  | |  __,
 /  \|  /  |  |/  /  |
/(__/|_/\_/|_/|__/\_/|_/
              |\
              |/

Stäfa; Scrolliris Text reAdability trAcker
```

**Stäfa** tracks text readability data based on the scroll event in
a gentlemanly manner. It will be indicated by [Scrolliris Readability Reflector (Sierre)](
https://gitlab.com/scrolliris/scrolliris-readability-reflector).

This project is text readibility tracking script and its SDK by [Scrolliris](
https://about.scrolliris.com) using browser's Web Worker API.


## Repository

[https://gitlab.com/scrolliris/scrolliris-readability-tracker](
https://gitlab.com/scrolliris/scrolliris-readability-tracker)


## Philosophy

### Mission

We're working on this to encourage author's motivation to write longer texts on
the web. We believe that, to let author know which part of their text is
readable or not, it would be sure delightfull also for reader.

This software is designed also to work for text on general website besides
Scrolliris.

### Privacy Policy

We respect reader's privacy and take care them seriously.

This SDK has support for `Do Not Track` (DNT) settings.

We do not track who user is. Otherwise, it just only cares how eagerly texts
are read by reader.


## Tracked data

Data will be sent via `PUT`.  
Tracking API must be enabled CORS (`OPTIONS`)

This is sample data.

### Request Header

* `X-Requested-With`
* `X-CSRF-Token`

```txt
Host: api.example.org
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:51.0) Gecko/20100101 Firefox/51.0
Accept: */*
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate, br
Content-Type: application/json; charset=UTF-8
Authorization: <API_KEY>
X-Requested-With: XMLHttpRequest
X-CSRF-Token: <CSRF_TOKEN>
```

### Body

```javascript
{
  "host": "example.org",
  "path": "/from-the-earth-to-the-moon/chapters/5",  // path or collection name
  "eventKey": "KanaylMKTRuWGJSRczIg_w==", // __anonymous__ key which generated by access on browser
  "eventType": "scroll", // {scroll|visibilitychange|fullscreenchange}
  "record": {
    "data": { // capturing range data like PostgreSQL's range type `[0, 1] ::int4range`
      "headings": [0, 1],
      "paragraphs": [1, 3],
      "sentences": [3, 14],
      "materials": [0, 0],
      "count": 7, // capturing count at this region
      "duration": 22.90, // captured duration at this region
      "startedAt":  1489082998821 // capturing has been started at
    },
    "info": { // situation information of the document
      "scroll": {
        "position": [0, 345], // (x, y)
        "proportion": [0, 52.35204855842185] // (x, y)
      },
      "view": [1678, 677], // view port size (width, height)
      "page": [1683, 1336], // html document size (width, height)
    }
  },
  "count": 14, // total tracking ount on this article
  "duration": 22.40, // total tracked duration on this article
  "startedAt": 1489083012910, // tracking has been started at
  "timestamp": 1489083035848, // will be sent at
  "extra": {}
}
```

Data does not contain sensitive values. The `eventKey` is anonymous
key which just generated on the browser by the each access.


## Install

```zsh
: via npm
% npm install @lupine-software/scrolliris-readability-tracker --save
```


## Configuration

### `client`

#### Settings

| value | default | description |
|---|---|---|
| apiKey | `null` | The key will be set as `Authorization` header. |

#### Options

| value | default | description |
|---|---|---|
| debug | `false` | In debug mode, data will not be sent to server (will be output in console). |
| path | `window.pathname` | It does not contain parameters. |
| csrfToken | `null` | CSRF token. This value will be set as `X-CSRF-Token` in request header. |
| baseDate | `new Date().toISOString()` | Base date to calculate timestamp. |


#### `record`

##### Selectors

`Client.record` can take `selectors` in second argument.

| Object | Default Selector | Type |
|---|---|---|
| article | `body article` | `querySelector` |
| heading | `'h1,h2,h3,h4,h5,h6'` | `querySelectorAll` |
| paragraph | `'p'`| `querySelectorAll` |
| sentence | `'p > span'`| `querySelectorAll` |
| material | `'ul,ol,pre,table,blockquote'`| `querySelectorAll` |


```js
client.record({
  selectors: {
      article: 'section > article'
    , heading: 'h2.title,h3.title'
    , paragraph: 'p'
    , sentence: 'p > span'
    , material: 'ul,ol,table,pre.code'
  }
});
```

##### Extra

`Client.record` can take `extra` in second argument, as you need.

```js
client.record({
  extra: {
    readingFont: 'TimesNewRoman'
  , brightnessLevel: 3
  }
});
```


## Usage

### JavaScript

#### For Browser

```html
<script type="text/javascript"
 src="https:///path/to/scrolliris-readability-tracker-browser.min.js"></script>
```

```js
(function(tracker) {
  var client = new tracker.Client({
    apiKey: '<API_KEY>'
  }, {
    debug: false
  , csrfToken: '<CSRF_TOKEN>'
  , baseDate: (new Date().toISOString())
  });

  client.ready(['body'], function() {
    client.record({
        ...
    });
  });
}(window.ScrollirisReadabilityTracker));
```

#### For Module

The main `lib/index.js` has ES2015 style.

```js
import Client from 'staefa';

let client = new Client({
  apiKey: '...'
}, {
  debug: false
, csrfToken: '...'
, baseDate: (new Date().toISOString())
});

client.ready(['body'], function() {
  client.record({
  });
});

```

### Default HTML structure

The text (HTML) is assumed as following structure by default.  
This is very common in various blogging services or web documents.


```txt
Article has...
  > Heading(s)
  > Paragraph(s)
    > Sentence(s)
  > Material(s)
```

```html
<!-- Example -->
<div>
  <h2>PUBLICATION TITLE</h2>

  <article>
    <div class="meta">
      <author>John Smith</author>
    </div>

    <div>
      <h1>ARTICLE TITLE</h1>
      <h2>ARTICLE SUB-TITLE</h2>

      <div class="body">
        <h3>SECTION-TITLE 1</h3>

        <p><span>Lorem... </span><span>ipsum... </span></p>
        <p><span>Lorem ipsum... </span></p>

        <img src=...>

        <h3>SECTION-TITLE 2</h3>

        <p><span>Lorem ipsum... </span></p>

        <table>
        </table>
        ...
      </div>
    </div>
  </article>
</div>
```


## Demo

```zsh
% xdg-open file://`pwd`/example/index.html
```


## To-Do List

* Request queue using local storage
* More Test Coverage
* Set appropriate margin for view port


## Development

### Building

```zsh
% gulp build
```

### Testing

```zsh
: run all tests on PhantomJS with coverage (`karma start`)
% npm test

: test task runs all tests {unit|functional} both
% gulp test

: run unit tests
% gulp test:unit

: run functional tests on Electron
% gulp test:func
```


## License

```txt
Scrolliris Readability Tracker
Copyright (c) 2017 Lupine Software LLC
```

`GPL-3.0`

The programs in this project are distributed as
GNU General Public License. (version 3)

```txt
This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program. If not, see <http://www.gnu.org/licenses/>.
```

See [LICENSE](LICENSE).
