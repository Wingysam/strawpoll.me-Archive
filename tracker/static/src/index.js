const wrap = () => {
  // node-fetch because i wanted to not need node_modules
  // and didn't want to bother with webpack
  // please excuse the hackiness
  if (typeof document === 'undefined') { "use strict";function _interopDefault(e){return e&&"object"==typeof e&&"default"in e?e.default:e}Object.defineProperty(exports,"__esModule",{value:!0});var Stream=_interopDefault(require("stream")),http=_interopDefault(require("http")),Url=_interopDefault(require("url")),https=_interopDefault(require("https")),zlib=_interopDefault(require("zlib"));const Readable=Stream.Readable,BUFFER=Symbol("buffer"),TYPE=Symbol("type");class Blob{constructor(){this[TYPE]="";const e=arguments[0],t=arguments[1],r=[];let o=0;if(e){const t=e,n=Number(t.length);for(let e=0;e<n;e++){const n=t[e];let s;o+=(s=n instanceof Buffer?n:ArrayBuffer.isView(n)?Buffer.from(n.buffer,n.byteOffset,n.byteLength):n instanceof ArrayBuffer?Buffer.from(n):n instanceof Blob?n[BUFFER]:Buffer.from("string"==typeof n?n:String(n))).length,r.push(s)}}this[BUFFER]=Buffer.concat(r);let n=t&&void 0!==t.type&&String(t.type).toLowerCase();n&&!/[^\u0020-\u007E]/.test(n)&&(this[TYPE]=n)}get size(){return this[BUFFER].length}get type(){return this[TYPE]}text(){return Promise.resolve(this[BUFFER].toString())}arrayBuffer(){const e=this[BUFFER],t=e.buffer.slice(e.byteOffset,e.byteOffset+e.byteLength);return Promise.resolve(t)}stream(){const e=new Readable;return e._read=function(){},e.push(this[BUFFER]),e.push(null),e}toString(){return"[object Blob]"}slice(){const e=this.size,t=arguments[0],r=arguments[1];let o,n;o=void 0===t?0:t<0?Math.max(e+t,0):Math.min(t,e),n=void 0===r?e:r<0?Math.max(e+r,0):Math.min(r,e);const s=Math.max(n-o,0),i=this[BUFFER].slice(o,o+s),a=new Blob([],{type:arguments[2]});return a[BUFFER]=i,a}}function FetchError(e,t,r){Error.call(this,e),this.message=e,this.type=t,r&&(this.code=this.errno=r.code),Error.captureStackTrace(this,this.constructor)}let convert;Object.defineProperties(Blob.prototype,{size:{enumerable:!0},type:{enumerable:!0},slice:{enumerable:!0}}),Object.defineProperty(Blob.prototype,Symbol.toStringTag,{value:"Blob",writable:!1,enumerable:!1,configurable:!0}),FetchError.prototype=Object.create(Error.prototype),FetchError.prototype.constructor=FetchError,FetchError.prototype.name="FetchError";try{convert=require("encoding").convert}catch(e){}const INTERNALS=Symbol("Body internals"),PassThrough=Stream.PassThrough;function Body(e){var t=this,r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},o=r.size;let n=void 0===o?0:o;var s=r.timeout;let i=void 0===s?0:s;null==e?e=null:isURLSearchParams(e)?e=Buffer.from(e.toString()):isBlob(e)||Buffer.isBuffer(e)||("[object ArrayBuffer]"===Object.prototype.toString.call(e)?e=Buffer.from(e):ArrayBuffer.isView(e)?e=Buffer.from(e.buffer,e.byteOffset,e.byteLength):e instanceof Stream||(e=Buffer.from(String(e)))),this[INTERNALS]={body:e,disturbed:!1,error:null},this.size=n,this.timeout=i,e instanceof Stream&&e.on("error",function(e){const r="AbortError"===e.name?e:new FetchError(`Invalid response body while trying to fetch ${t.url}: ${e.message}`,"system",e);t[INTERNALS].error=r})}function consumeBody(){var e=this;if(this[INTERNALS].disturbed)return Body.Promise.reject(new TypeError(`body used already for: ${this.url}`));if(this[INTERNALS].disturbed=!0,this[INTERNALS].error)return Body.Promise.reject(this[INTERNALS].error);let t=this.body;if(null===t)return Body.Promise.resolve(Buffer.alloc(0));if(isBlob(t)&&(t=t.stream()),Buffer.isBuffer(t))return Body.Promise.resolve(t);if(!(t instanceof Stream))return Body.Promise.resolve(Buffer.alloc(0));let r=[],o=0,n=!1;return new Body.Promise(function(s,i){let a;e.timeout&&(a=setTimeout(function(){n=!0,i(new FetchError(`Response timeout while trying to fetch ${e.url} (over ${e.timeout}ms)`,"body-timeout"))},e.timeout)),t.on("error",function(t){"AbortError"===t.name?(n=!0,i(t)):i(new FetchError(`Invalid response body while trying to fetch ${e.url}: ${t.message}`,"system",t))}),t.on("data",function(t){if(!n&&null!==t){if(e.size&&o+t.length>e.size)return n=!0,void i(new FetchError(`content size at ${e.url} over limit: ${e.size}`,"max-size"));o+=t.length,r.push(t)}}),t.on("end",function(){if(!n){clearTimeout(a);try{s(Buffer.concat(r,o))}catch(t){i(new FetchError(`Could not create Buffer from response body for ${e.url}: ${t.message}`,"system",t))}}})})}function convertBody(e,t){if("function"!=typeof convert)throw new Error("The package `encoding` must be installed to use the textConverted() function");const r=t.get("content-type");let o,n,s="utf-8";return r&&(o=/charset=([^;]*)/i.exec(r)),n=e.slice(0,1024).toString(),!o&&n&&(o=/<meta.+?charset=(['"])(.+?)\1/i.exec(n)),!o&&n&&((o=/<meta[\s]+?http-equiv=(['"])content-type\1[\s]+?content=(['"])(.+?)\2/i.exec(n))||(o=/<meta[\s]+?content=(['"])(.+?)\1[\s]+?http-equiv=(['"])content-type\3/i.exec(n))&&o.pop(),o&&(o=/charset=(.*)/i.exec(o.pop()))),!o&&n&&(o=/<\?xml.+?encoding=(['"])(.+?)\1/i.exec(n)),o&&("gb2312"!==(s=o.pop())&&"gbk"!==s||(s="gb18030")),convert(e,"UTF-8",s).toString()}function isURLSearchParams(e){return"object"==typeof e&&"function"==typeof e.append&&"function"==typeof e.delete&&"function"==typeof e.get&&"function"==typeof e.getAll&&"function"==typeof e.has&&"function"==typeof e.set&&("URLSearchParams"===e.constructor.name||"[object URLSearchParams]"===Object.prototype.toString.call(e)||"function"==typeof e.sort)}function isBlob(e){return"object"==typeof e&&"function"==typeof e.arrayBuffer&&"string"==typeof e.type&&"function"==typeof e.stream&&"function"==typeof e.constructor&&"string"==typeof e.constructor.name&&/^(Blob|File)$/.test(e.constructor.name)&&/^(Blob|File)$/.test(e[Symbol.toStringTag])}function clone(e){let t,r,o=e.body;if(e.bodyUsed)throw new Error("cannot clone body after it is used");return o instanceof Stream&&"function"!=typeof o.getBoundary&&(t=new PassThrough,r=new PassThrough,o.pipe(t),o.pipe(r),e[INTERNALS].body=t,o=r),o}function extractContentType(e){return null===e?null:"string"==typeof e?"text/plain;charset=UTF-8":isURLSearchParams(e)?"application/x-www-form-urlencoded;charset=UTF-8":isBlob(e)?e.type||null:Buffer.isBuffer(e)?null:"[object ArrayBuffer]"===Object.prototype.toString.call(e)?null:ArrayBuffer.isView(e)?null:"function"==typeof e.getBoundary?`multipart/form-data;boundary=${e.getBoundary()}`:e instanceof Stream?null:"text/plain;charset=UTF-8"}function getTotalBytes(e){const t=e.body;return null===t?0:isBlob(t)?t.size:Buffer.isBuffer(t)?t.length:t&&"function"==typeof t.getLengthSync&&(t._lengthRetrievers&&0==t._lengthRetrievers.length||t.hasKnownLength&&t.hasKnownLength())?t.getLengthSync():null}function writeToStream(e,t){const r=t.body;null===r?e.end():isBlob(r)?r.stream().pipe(e):Buffer.isBuffer(r)?(e.write(r),e.end()):r.pipe(e)}Body.prototype={get body(){return this[INTERNALS].body},get bodyUsed(){return this[INTERNALS].disturbed},arrayBuffer(){return consumeBody.call(this).then(function(e){return e.buffer.slice(e.byteOffset,e.byteOffset+e.byteLength)})},blob(){let e=this.headers&&this.headers.get("content-type")||"";return consumeBody.call(this).then(function(t){return Object.assign(new Blob([],{type:e.toLowerCase()}),{[BUFFER]:t})})},json(){var e=this;return consumeBody.call(this).then(function(t){try{return JSON.parse(t.toString())}catch(t){return Body.Promise.reject(new FetchError(`invalid json response body at ${e.url} reason: ${t.message}`,"invalid-json"))}})},text(){return consumeBody.call(this).then(function(e){return e.toString()})},buffer(){return consumeBody.call(this)},textConverted(){var e=this;return consumeBody.call(this).then(function(t){return convertBody(t,e.headers)})}},Object.defineProperties(Body.prototype,{body:{enumerable:!0},bodyUsed:{enumerable:!0},arrayBuffer:{enumerable:!0},blob:{enumerable:!0},json:{enumerable:!0},text:{enumerable:!0}}),Body.mixIn=function(e){for(const t of Object.getOwnPropertyNames(Body.prototype))if(!(t in e)){const r=Object.getOwnPropertyDescriptor(Body.prototype,t);Object.defineProperty(e,t,r)}},Body.Promise=global.Promise;const invalidTokenRegex=/[^\^_`a-zA-Z\-0-9!#$%&'*+.|~]/,invalidHeaderCharRegex=/[^\t\x20-\x7e\x80-\xff]/;function validateName(e){if(e=`${e}`,invalidTokenRegex.test(e)||""===e)throw new TypeError(`${e} is not a legal HTTP header name`)}function validateValue(e){if(e=`${e}`,invalidHeaderCharRegex.test(e))throw new TypeError(`${e} is not a legal HTTP header value`)}function find(e,t){t=t.toLowerCase();for(const r in e)if(r.toLowerCase()===t)return r}const MAP=Symbol("map");class Headers{constructor(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:void 0;if(this[MAP]=Object.create(null),e instanceof Headers){const t=e.raw(),r=Object.keys(t);for(const e of r)for(const r of t[e])this.append(e,r)}else if(null==e);else{if("object"!=typeof e)throw new TypeError("Provided initializer must be an object");{const t=e[Symbol.iterator];if(null!=t){if("function"!=typeof t)throw new TypeError("Header pairs must be iterable");const r=[];for(const t of e){if("object"!=typeof t||"function"!=typeof t[Symbol.iterator])throw new TypeError("Each header pair must be iterable");r.push(Array.from(t))}for(const e of r){if(2!==e.length)throw new TypeError("Each header pair must be a name/value tuple");this.append(e[0],e[1])}}else for(const t of Object.keys(e)){const r=e[t];this.append(t,r)}}}}get(e){validateName(e=`${e}`);const t=find(this[MAP],e);return void 0===t?null:this[MAP][t].join(", ")}forEach(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:void 0,r=getHeaders(this),o=0;for(;o<r.length;){var n=r[o];const s=n[0],i=n[1];e.call(t,i,s,this),r=getHeaders(this),o++}}set(e,t){t=`${t}`,validateName(e=`${e}`),validateValue(t);const r=find(this[MAP],e);this[MAP][void 0!==r?r:e]=[t]}append(e,t){t=`${t}`,validateName(e=`${e}`),validateValue(t);const r=find(this[MAP],e);void 0!==r?this[MAP][r].push(t):this[MAP][e]=[t]}has(e){return validateName(e=`${e}`),void 0!==find(this[MAP],e)}delete(e){validateName(e=`${e}`);const t=find(this[MAP],e);void 0!==t&&delete this[MAP][t]}raw(){return this[MAP]}keys(){return createHeadersIterator(this,"key")}values(){return createHeadersIterator(this,"value")}[Symbol.iterator](){return createHeadersIterator(this,"key+value")}}function getHeaders(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"key+value";return Object.keys(e[MAP]).sort().map("key"===t?function(e){return e.toLowerCase()}:"value"===t?function(t){return e[MAP][t].join(", ")}:function(t){return[t.toLowerCase(),e[MAP][t].join(", ")]})}Headers.prototype.entries=Headers.prototype[Symbol.iterator],Object.defineProperty(Headers.prototype,Symbol.toStringTag,{value:"Headers",writable:!1,enumerable:!1,configurable:!0}),Object.defineProperties(Headers.prototype,{get:{enumerable:!0},forEach:{enumerable:!0},set:{enumerable:!0},append:{enumerable:!0},has:{enumerable:!0},delete:{enumerable:!0},keys:{enumerable:!0},values:{enumerable:!0},entries:{enumerable:!0}});const INTERNAL=Symbol("internal");function createHeadersIterator(e,t){const r=Object.create(HeadersIteratorPrototype);return r[INTERNAL]={target:e,kind:t,index:0},r}const HeadersIteratorPrototype=Object.setPrototypeOf({next(){if(!this||Object.getPrototypeOf(this)!==HeadersIteratorPrototype)throw new TypeError("Value of `this` is not a HeadersIterator");var e=this[INTERNAL];const t=e.target,r=e.kind,o=e.index,n=getHeaders(t,r);return o>=n.length?{value:void 0,done:!0}:(this[INTERNAL].index=o+1,{value:n[o],done:!1})}},Object.getPrototypeOf(Object.getPrototypeOf([][Symbol.iterator]())));function exportNodeCompatibleHeaders(e){const t=Object.assign({__proto__:null},e[MAP]),r=find(e[MAP],"Host");return void 0!==r&&(t[r]=t[r][0]),t}function createHeadersLenient(e){const t=new Headers;for(const r of Object.keys(e))if(!invalidTokenRegex.test(r))if(Array.isArray(e[r]))for(const o of e[r])invalidHeaderCharRegex.test(o)||(void 0===t[MAP][r]?t[MAP][r]=[o]:t[MAP][r].push(o));else invalidHeaderCharRegex.test(e[r])||(t[MAP][r]=[e[r]]);return t}Object.defineProperty(HeadersIteratorPrototype,Symbol.toStringTag,{value:"HeadersIterator",writable:!1,enumerable:!1,configurable:!0});const INTERNALS$1=Symbol("Response internals"),STATUS_CODES=http.STATUS_CODES;class Response{constructor(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};Body.call(this,e,t);const r=t.status||200,o=new Headers(t.headers);if(null!=e&&!o.has("Content-Type")){const t=extractContentType(e);t&&o.append("Content-Type",t)}this[INTERNALS$1]={url:t.url,status:r,statusText:t.statusText||STATUS_CODES[r],headers:o,counter:t.counter}}get url(){return this[INTERNALS$1].url||""}get status(){return this[INTERNALS$1].status}get ok(){return this[INTERNALS$1].status>=200&&this[INTERNALS$1].status<300}get redirected(){return this[INTERNALS$1].counter>0}get statusText(){return this[INTERNALS$1].statusText}get headers(){return this[INTERNALS$1].headers}clone(){return new Response(clone(this),{url:this.url,status:this.status,statusText:this.statusText,headers:this.headers,ok:this.ok,redirected:this.redirected})}}Body.mixIn(Response.prototype),Object.defineProperties(Response.prototype,{url:{enumerable:!0},status:{enumerable:!0},ok:{enumerable:!0},redirected:{enumerable:!0},statusText:{enumerable:!0},headers:{enumerable:!0},clone:{enumerable:!0}}),Object.defineProperty(Response.prototype,Symbol.toStringTag,{value:"Response",writable:!1,enumerable:!1,configurable:!0});const INTERNALS$2=Symbol("Request internals"),parse_url=Url.parse,format_url=Url.format,streamDestructionSupported="destroy"in Stream.Readable.prototype;function isRequest(e){return"object"==typeof e&&"object"==typeof e[INTERNALS$2]}function isAbortSignal(e){const t=e&&"object"==typeof e&&Object.getPrototypeOf(e);return!(!t||"AbortSignal"!==t.constructor.name)}class Request{constructor(e){let t,r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};isRequest(e)?t=parse_url(e.url):(t=e&&e.href?parse_url(e.href):parse_url(`${e}`),e={});let o=r.method||e.method||"GET";if(o=o.toUpperCase(),(null!=r.body||isRequest(e)&&null!==e.body)&&("GET"===o||"HEAD"===o))throw new TypeError("Request with GET/HEAD method cannot have body");let n=null!=r.body?r.body:isRequest(e)&&null!==e.body?clone(e):null;Body.call(this,n,{timeout:r.timeout||e.timeout||0,size:r.size||e.size||0});const s=new Headers(r.headers||e.headers||{});if(null!=n&&!s.has("Content-Type")){const e=extractContentType(n);e&&s.append("Content-Type",e)}let i=isRequest(e)?e.signal:null;if("signal"in r&&(i=r.signal),null!=i&&!isAbortSignal(i))throw new TypeError("Expected signal to be an instanceof AbortSignal");this[INTERNALS$2]={method:o,redirect:r.redirect||e.redirect||"follow",headers:s,parsedURL:t,signal:i},this.follow=void 0!==r.follow?r.follow:void 0!==e.follow?e.follow:20,this.compress=void 0!==r.compress?r.compress:void 0===e.compress||e.compress,this.counter=r.counter||e.counter||0,this.agent=r.agent||e.agent}get method(){return this[INTERNALS$2].method}get url(){return format_url(this[INTERNALS$2].parsedURL)}get headers(){return this[INTERNALS$2].headers}get redirect(){return this[INTERNALS$2].redirect}get signal(){return this[INTERNALS$2].signal}clone(){return new Request(this)}}function getNodeRequestOptions(e){const t=e[INTERNALS$2].parsedURL,r=new Headers(e[INTERNALS$2].headers);if(r.has("Accept")||r.set("Accept","*/*"),!t.protocol||!t.hostname)throw new TypeError("Only absolute URLs are supported");if(!/^https?:$/.test(t.protocol))throw new TypeError("Only HTTP(S) protocols are supported");if(e.signal&&e.body instanceof Stream.Readable&&!streamDestructionSupported)throw new Error("Cancellation of streamed requests with AbortSignal is not supported in node < 8");let o=null;if(null==e.body&&/^(POST|PUT)$/i.test(e.method)&&(o="0"),null!=e.body){const t=getTotalBytes(e);"number"==typeof t&&(o=String(t))}o&&r.set("Content-Length",o),r.has("User-Agent")||r.set("User-Agent","node-fetch/1.0 (+https://github.com/bitinn/node-fetch)"),e.compress&&!r.has("Accept-Encoding")&&r.set("Accept-Encoding","gzip,deflate");let n=e.agent;return"function"==typeof n&&(n=n(t)),r.has("Connection")||n||r.set("Connection","close"),Object.assign({},t,{method:e.method,headers:exportNodeCompatibleHeaders(r),agent:n})}function AbortError(e){Error.call(this,e),this.type="aborted",this.message=e,Error.captureStackTrace(this,this.constructor)}Body.mixIn(Request.prototype),Object.defineProperty(Request.prototype,Symbol.toStringTag,{value:"Request",writable:!1,enumerable:!1,configurable:!0}),Object.defineProperties(Request.prototype,{method:{enumerable:!0},url:{enumerable:!0},headers:{enumerable:!0},redirect:{enumerable:!0},clone:{enumerable:!0},signal:{enumerable:!0}}),AbortError.prototype=Object.create(Error.prototype),AbortError.prototype.constructor=AbortError,AbortError.prototype.name="AbortError";const PassThrough$1=Stream.PassThrough,resolve_url=Url.resolve;function fetch(e,t){if(!fetch.Promise)throw new Error("native promise missing, set fetch.Promise to your favorite alternative");return Body.Promise=fetch.Promise,new fetch.Promise(function(r,o){const n=new Request(e,t),s=getNodeRequestOptions(n),i=("https:"===s.protocol?https:http).request,a=n.signal;let u=null;const l=function(){let e=new AbortError("The user aborted a request.");o(e),n.body&&n.body instanceof Stream.Readable&&n.body.destroy(e),u&&u.body&&u.body.emit("error",e)};if(a&&a.aborted)return void l();const c=function(){l(),h()},f=i(s);let d;function h(){f.abort(),a&&a.removeEventListener("abort",c),clearTimeout(d)}a&&a.addEventListener("abort",c),n.timeout&&f.once("socket",function(e){d=setTimeout(function(){o(new FetchError(`network timeout at: ${n.url}`,"request-timeout")),h()},n.timeout)}),f.on("error",function(e){o(new FetchError(`request to ${n.url} failed, reason: ${e.message}`,"system",e)),h()}),f.on("response",function(e){clearTimeout(d);const t=createHeadersLenient(e.headers);if(fetch.isRedirect(e.statusCode)){const s=t.get("Location"),i=null===s?null:resolve_url(n.url,s);switch(n.redirect){case"error":return o(new FetchError(`uri requested responds with a redirect, redirect mode is set to error: ${n.url}`,"no-redirect")),void h();case"manual":if(null!==i)try{t.set("Location",i)}catch(e){o(e)}break;case"follow":if(null===i)break;if(n.counter>=n.follow)return o(new FetchError(`maximum redirect reached at: ${n.url}`,"max-redirect")),void h();const s={headers:new Headers(n.headers),follow:n.follow,counter:n.counter+1,agent:n.agent,compress:n.compress,method:n.method,body:n.body,signal:n.signal,timeout:n.timeout,size:n.size};return 303!==e.statusCode&&n.body&&null===getTotalBytes(n)?(o(new FetchError("Cannot follow redirect with body being a readable stream","unsupported-redirect")),void h()):(303!==e.statusCode&&(301!==e.statusCode&&302!==e.statusCode||"POST"!==n.method)||(s.method="GET",s.body=void 0,s.headers.delete("content-length")),r(fetch(new Request(i,s))),void h())}}e.once("end",function(){a&&a.removeEventListener("abort",c)});let s=e.pipe(new PassThrough$1);const i={url:n.url,status:e.statusCode,statusText:e.statusMessage,headers:t,size:n.size,timeout:n.timeout,counter:n.counter},l=t.get("Content-Encoding");if(!n.compress||"HEAD"===n.method||null===l||204===e.statusCode||304===e.statusCode)return u=new Response(s,i),void r(u);const f={flush:zlib.Z_SYNC_FLUSH,finishFlush:zlib.Z_SYNC_FLUSH};if("gzip"==l||"x-gzip"==l)return s=s.pipe(zlib.createGunzip(f)),u=new Response(s,i),void r(u);if("deflate"!=l&&"x-deflate"!=l){if("br"==l&&"function"==typeof zlib.createBrotliDecompress)return s=s.pipe(zlib.createBrotliDecompress()),u=new Response(s,i),void r(u);u=new Response(s,i),r(u)}else{e.pipe(new PassThrough$1).once("data",function(e){s=8==(15&e[0])?s.pipe(zlib.createInflate()):s.pipe(zlib.createInflateRaw()),u=new Response(s,i),r(u)})}}),writeToStream(f,n)})}fetch.isRedirect=function(e){return 301===e||302===e||303===e||307===e||308===e},fetch.Promise=global.Promise,module.exports=exports=fetch,Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=exports,exports.Headers=Headers,exports.Request=Request,exports.Response=Response,exports.FetchError=FetchError;  }
  // end of node-fetch

  // my code
  if (typeof process !== 'undefined' && typeof wrap !== 'undefined') {
    const code = (`(${wrap})()`)
    let procs = Number(process.env.PROCESSES)
    if (process.env.PROCESSES) delete process.env.PROCESSES
    if (Number.isNaN(procs)) procs = require('os').cpus().length
    console.log(`Spawning ${procs} subprocesses.`)
    const { spawn } = require('child_process')
    for (let i = 0; i < procs; i++) {
      const proc = spawn(process.argv[0], [ '-e', code ])
      ;['stdout', 'stderr'].forEach(type => {
        proc[type].on('data', data => process[type].write(`[${i}] ${data}`))
      })
    }
    return
  }

  const BLOCK_AMOUNT = 1000
  const API_HOST = 'saw.home.wingysam.xyz'
  const API_HTTPS = `https://${API_HOST}/api`
  const API_WSS = `https://${API_HOST}/stats`

  const browser = typeof document !== 'undefined'
  //if (typeof require !== 'undefined') { fetch = require('node-fetch') }

  let concurrent = 1
  try { concurrent = process.env.CONCURRENT || 1} catch (_) {}
  try { concurrent = Number(location.search.replace('?', '') || 1) } catch (_) {}

  console.log(`Using ${concurrent} concurrent item(s)`)
  if (browser) document.querySelector('#threadcount').textContent = concurrent

  if ((concurrent > 20 && browser) || (concurrent > 30 && !browser)) {
    console.warn(`WARNING! Using ${concurrent} concurrent. This may cause the JavaScript process to run slowly!\nContinuing anyway.`)
  }

  async function main() {
    if (browser) {
      const progress = document.createElement('progress')
      progress.classList.add('is-block', 'progress')
      progress.max = BLOCK_AMOUNT
      progress.value = 0
      document.querySelector('#threads').appendChild(progress)
      while (true) {
        try {
          const block = await getBlock(progress)
          if (block === false) {
            concurrent--
            document.querySelector('#threadcount').textContent = concurrent
            progress.parentNode.removeChild(progress)
            return
          }
        } catch {}
      }
    } else {
      while (true) {
        try {
          await getBlock()
        } catch {}
      }
    }
  }

  async function getBlock(progress) {
    const block = await fetch(`${API_HTTPS}/job`).then(res => res.json())
    if (block === false) return false
    const blockStart = block * BLOCK_AMOUNT
    const blockEnd = blockStart + BLOCK_AMOUNT

    const data = []
    let j = 0
    for (let i = blockStart; i < blockEnd; i++) {
      j++
      try {
        const poll = (await (await fetch(`https://www.strawpoll.me/api/v2/polls/${i}`)).text())
        if (!poll) {
          console.warn(`Block #${block} item #${i} returned blank`)
        }
        data.push(poll)
      } catch (_) {
        console.error(`Skipping poll id ${i}`)
      }
      if (progress) progress.value = j
    }
    const worked = await fetch(`${API_HTTPS}/job/${block}`, {
      method: 'post',
      body: data.join('\n')
    }).then(res => res.json())

    if (!worked) return console.error(`Block #${block} failed, maybe someone else confirmed it`)

    if (browser) {
      const completed = document.querySelector('#completed')
      completed.textContent = Number(completed.textContent) + 1
    }

    console.log(`Completed block ${block}`)

    return true
  }

  for (let i = 0; i < concurrent; i++) {
    main()
  }

  if (browser) {
    const socket = new WebSocket(API_WSS)
    socket.onmessage = message => {
      try {
        const { out, done, todo } = JSON.parse(message.data)
        if (!out || !done || !todo) return console.log('missing stats')
        document.querySelector('#out').textContent = out
        document.querySelector('#done').textContent = done
        document.querySelector('#todo').textContent = todo
      } catch (error) { console.error(error) }
    }
  }
}

wrap()