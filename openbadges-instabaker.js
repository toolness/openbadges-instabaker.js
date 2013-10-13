(function(PNGBaker) {
  var DATA_ATTR = 'data-openbadges';
  var FILENAME_ATTR = 'data-download';
  var BAKED_ATTR = 'data-baked';
  var DOWNLOAD_LINK_ATTR = 'data-download-openbadge';
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

  function instabakeDownloadLink(a, img) {
    if ('download' in a) {
      a.setAttribute('download', img.getAttribute(FILENAME_ATTR));
      a.setAttribute('href', img.src);
    } else if (navigator.msSaveOrOpenBlob) {
      a.setAttribute('href', '#');
      a.addEventListener('click', handleSaveBlobInIE(img));
    }
  }

  function instabakeImage(img) {
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

    for (var prnt = img.parentNode; prnt; prnt = prnt.parentNode)
      if (prnt.nodeName == 'A' && prnt.hasAttribute(DOWNLOAD_LINK_ATTR)) {
        instabakeDownloadLink(prnt, img);
        break;
      }
  }

  function maybeInstabake(event) {
    if (event.target.nodeName == 'IMG' &&
        event.target.hasAttribute(DATA_ATTR) &&
        !event.target.hasAttribute(BAKED_ATTR))
      instabakeImage(event.target);
  }

  if (!URL || !window.HTMLCanvasElement || !window.Blob) return;
  document.addEventListener('mouseover', maybeInstabake, true);
  document.addEventListener('touchstart', maybeInstabake, true);
})(PNGBaker);
