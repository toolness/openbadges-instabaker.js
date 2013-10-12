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

## How It Works

The script looks at all the images on the page on `DOMContentLoaded` and
attaches event handlers to them. When those badges are moused-over or
touched, baking occurs.

At this time, a `bake` event is emitted from the image and a
`data-baked` attribute is set on it.

If the user's browser doesn't support automatic baking, the script
does nothing.

## Limitations

* Currently, there's no way to delay the initialization of the script
  to a time other than `DOMContentLoaded`. This means that if badge
  images are added to the page after this event, they won't be
  automatically baked when the user starts interacting with them.

## License

[MIT][].

  [Open Badges]: http://openbadges.org/
  [baked]: https://github.com/mozilla/openbadges/wiki/Badge-Baking
  [png-baker.js]: https://github.com/toolness/png-baker.js
  [MIT]: http://opensource.org/licenses/MIT
