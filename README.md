**openbadges-instabaker.js** is a drop-in script that provides a simple
markup API allowing [Open Badges][] to be automatically [baked][] for
users on-demand, in their browsers.

The script requires [png-baker.js][]. Because of this, it only runs
on modern browsers.

## Usage

Just include `png-baker.js` and `openbadges-instabaker.js` on any page
that you need baked badges in.

For any badge images that you want baked:

* At minimum, add a `data-openbadges` attribute whose value is set to
  the absolute URL of the badge's assertion.

* Optionally, add a `data-download` attribute whose value is set to the
  name of a file. This will be the default filename suggested if the
  user decides to save the baked badge to their filesystem.

* Optionally, wrap the image in `<a data-download-openbadge></a>`. The
  script will automatically convert this into a download link, so that
  when the user clicks on the badge image, they will be prompted to
  download it.

See `index.html` for an example of all these in practice.

## How It Works

When any image with the `data-openbadges` attribute is moused-over or
touched, baking occurs. At this time, a `data-baked` attribute is set on it
to mark it as baked and ensure that it's not re-baked.

If the user's browser doesn't support automatic baking, the script
does nothing.

## Limitations

* Badge images need to be served from the same origin as the web page.
  Alternatively, the `crossorigin` attribute will allow automatic
  baking to work on browsers that support it.

## License

[MIT][].

  [Open Badges]: http://openbadges.org/
  [baked]: https://github.com/mozilla/openbadges/wiki/Badge-Baking
  [png-baker.js]: https://github.com/toolness/png-baker.js
  [MIT]: http://opensource.org/licenses/MIT
