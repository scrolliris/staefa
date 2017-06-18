import Scrollbar from './scrollbar';
import Screen from './screen';

class Recorder {
  constructor(selectors=null) {
    this.clear();

    let body = document.body
      , html = document.documentElement
      ;

    this._selectors = this._configureSelectors(selectors);
    this._bar = new Scrollbar();

    this._view = { // inner rect (viewport)
      'margin': 9 * 2
    , 'width':  Math.max(window.innerWidth  - this._bar.width,
                         html.clientWidth)
    , 'height': Math.max(window.innerHeight - this._bar.height,
                         html.clientHeight)
    };

    this._page = {}; // {body|html} width, height
    this._page['width'] = Math.max(
      html.clientWidth, html.scrollWidth, html.offsetWidth,
      body.scrollWidth, body.offsetWidth);
    this._page['height'] = Math.max(
      html.clientHeight, html.scrollHeight, html.offsetHeight,
      body.scrollHeight, body.offsetHeight);
  }

  _configureSelectors(selectors) {
    if (typeof selectors === 'undefined' ||
        selectors === null ||
        Object.getOwnPropertyNames(selectors).length === 0) {
      // default
      return {
        body:      'div.body'
      , heading:   'h1,h2,h3,h3,h4,h6'
      , paragraph: 'p'
      , sentence:  'p > span'
      , material:  'img,pre,table,quote'
      };
    }
    return selectors;
  }

  // returns detected element index should be captured
  _detectIndex(len, i, obj) {
    if (len === 0 && this._isInView(obj)) {
      return i;
    } else if (len === 1) {
      if (this._isInView(obj)) {
        if (i === 0) {
          return 0;
        }
      } else {
        // previous element
        return i + 1;
      }
    }
    return null;
  }

  // captures index into _data property
  _capture(body, kind) {
    let qs = body.querySelectorAll(this._selectors[kind]);
    for (let i = qs.length - 1; i >= 0; i--) {
      let obj = qs[i];
      let key = kind + 's';
      let n = this._detectIndex(this._data[key].length, i, obj);
      if (n !== null) {
        this._data[key].push(n);
      }
    }
  }

  // returns as boolean element is in viewport or not (verticaly & horizontaly)
  _isInView(el) {
    let rect = el.getBoundingClientRect();
    return ((rect.top <= this._view['height'] - this._view['margin']) &&
            ((rect.top + rect.height) >= 0))
        && ((rect.left <= this._view['width'] - this._view['margin']) &&
            ((rect.left + rect.width) >= 0));
  }

  _clone() {
    let [d, i] = [{}, {}];
    for (let attr in this._data) {
      if (this._data.hasOwnProperty(attr)) {
        d[attr] = this._data[attr];
      }
    }
    for (let attr in this._info) {
      if (this._info.hasOwnProperty(attr)) {
        i[attr] = this._info[attr];
      }
    }
    return [d, i];
  }

  capture(object, options={}, selector=null) {
    this._data['count']     = options['count'];
    this._data['duration']  = options['duration'];
    this._data['startedAt'] = options['startedAt'];

    // skip without first time
    if (this._data['count'] !== null && this._data['count'] > 1) {
      return null;
    }

    // body
    //   --> heading
    //   --> paragraph
    //      --> sentence
    //   --> material
    let body;
    if (typeof this._selectors['body'] === 'undefined' ||
        this._selectors['body'] === null) {
      body = object;
    } else {
      body = object.querySelector(this._selectors['body']);
    }
    if (body === null) {
      return null;
    }

    ['heading', 'paragraph', 'sentence', 'material'].map((k) => {
      this._capture(body, k)
      let key = k + 's';
      let len = this._data[key].length;
      if (len === 1) {
        // make pair as range
        this._data[key][1] = this._data[key][0];
      } else if (len === 2) {
        this._data[key].sort((a, b) => {
          return a - b;
        });
      }
    });

    // info
    this._info['fullscreen']  = Screen.isFullscreenMode();
    this._info['orientation'] = Screen.getOrientation(this._view);

    let [position, proportion] = this._bar.calculate(
        this._page['width']
      , this._page['height']
      , this._view['width']
      , this._view['height']
    )
    this._info['scroll'] = {
      position
    , proportion
    };

    return null;
  }

  dump() {
    let [data, info] = this._clone();
    this.clear();
    return {
        'data': data
      , 'info': info
      , 'view': [this._view['width'], this._view['height']]
      , 'page': [this._page['width'], this._page['height']]
    };
  }

  clear() {
    this._data = {
      'headings':   []
    , 'paragraphs': []
    , 'sentences':  []
    , 'materials':  []
    , 'count':      0
    , 'duration':   null
    , 'startedAt':  null
    };
    this._info = {
      'scroll':      {}
    , 'orientation': {}
    , 'fullscreen':  false
    };
    return;
  }
}

export default Recorder;