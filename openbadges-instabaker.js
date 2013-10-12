(function(PNGBaker) {
  var DATA_ATTR = 'data-openbadges';
  var FILENAME_ATTR = 'data-download';
  var BAKED_ATTR = 'data-baked';
  var BAKED_EVENT_TYPE = 'bake';
  var IMG_SELECTOR = 'img[' + DATA_ATTR + ']';
  var LINK_SELECTOR = 'a[data-download-openbadge]';
  var INSTABAKE_TRIGGERS = ['mouseover', 'touchstart'];
  var FILENAME_RE = /([^\/]+)$/;
  var DEFAULT_FILENAME = 'badge.png';
  var URL = window.URL || window.webkitURL;

  function handleSaveBlobInIE(img) {
    return function(event) {
      navigator.msSaveOrOpenBlob(img.blob,
                                 img.getAttribute(FILENAME_ATTR));
      event.preventDefault();
    };
  }

  function instabakeDownloadLink(event) {
    var a = this;
    var img = event.target;

    if ('download' in a) {
      a.setAttribute('download', img.getAttribute(FILENAME_ATTR));
      a.setAttribute('href', img.src);
    } else if (navigator.msSaveOrOpenBlob) {
      a.setAttribute('href', '#');
      a.addEventListener('click', handleSaveBlobInIE(img));
    }

    a.removeEventListener(BAKED_EVENT_TYPE, instabakeDownloadLink);
  }

  function instabakeImage() {
    var img = this;
    var w = img.naturalWidth, h = img.naturalHeight;
    var canvas = document.createElement('canvas');
    canvas.width = w; canvas.height = h;
    var ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    var baker = new PNGBaker(canvas.toDataURL());
    baker.textChunks['openbadges'] = img.getAttribute(DATA_ATTR);
    var blob = baker.toBlob();

    if (!img.hasAttribute(FILENAME_ATTR))
      img.setAttribute(FILENAME_ATTR, FILENAME_RE.test(img.src)
                                      ? img.src.match(FILENAME_RE)[1]
                                      : DEFAULT_FILENAME);

    img.src = URL.createObjectURL(blob);

    if (navigator.msSaveOrOpenBlob)
      // All browsers will save the baked badge when "Save Image As..." is
      // selected from the contextual menu, but IE10 saves the unbaked
      // version. So we'll hijack right-clicks on IE10 and do our own thing.
      img.addEventListener('contextmenu', handleSaveBlobInIE(img), true);

    img.setAttribute(BAKED_ATTR, new Date().toString());
    img.blob = blob;

    var bakedEvent = document.createEvent('Event');
    bakedEvent.initEvent(BAKED_EVENT_TYPE, true, true);
    img.dispatchEvent(bakedEvent);

    INSTABAKE_TRIGGERS.forEach(function(eventType) {
      img.removeEventListener(eventType, instabakeImage);
    });
  }

  function init() {
    var imgs = document.querySelectorAll(IMG_SELECTOR);
    var links = document.querySelectorAll(LINK_SELECTOR);

    [].slice.call(imgs).forEach(function(img) {
      INSTABAKE_TRIGGERS.forEach(function(eventType) {
        img.addEventListener(eventType, instabakeImage);
      });
    });

    [].slice.call(links).forEach(function(a) {
      a.addEventListener(BAKED_EVENT_TYPE, instabakeDownloadLink);
    });
  }

  if (!URL || !window.HTMLCanvasElement || !window.Blob) return;
  if (document.readyState == 'loading')
    window.addEventListener('DOMContentLoaded', init);
  else
    init();
})(PNGBaker);
