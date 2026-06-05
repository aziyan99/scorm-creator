# SCORM Creator and Packager

A client-side web application for creating interactive courses and exporting them as standard-compliant SCORM 1.2 or SCORM 2004 (4th Edition) ZIP packages.

## Features

* Client-side compilation and packaging using JSZip.
* Interactive page structures: Text, Flip Cards, Accordions, Tabs, Hotspots, and Quizzes.
* Theme color customization (Primary Background, Sidebar Background, Text, and Accent colors).
* Resizable side-panels and live SCORM developer communication logs.
* Support for multiple hotspot layouts (Email Client Mockup, Policy Document, or Generic Text).

## Running Locally

Since this is a fully static client-side application, you can run it using any static file server.

Using Python:
```bash
python3 -m http.server 8088
```

Then open `http://localhost:8088` in your browser.


