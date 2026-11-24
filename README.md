# Cuddly Toy App

Weil jedes Kind mit einer ernstzunehmenden Kuscheltiersammlung eine entsprechende Verwaltungsoftware braucht.

Die verwalten sich ja nicht von alleine. (Noch nicht)

```
yarn start
```

...wäre ein guter Start

und natürlich dependencies installieren.

## Web-Build

`yarn expo export --platform web` schreibt den Web-Build nach `dist`. Der Host muss Seitenaufrufe wie `/toys/toy-123` auf `index.html` zurückführen. Lokal lässt sich das mit `npx --yes serve@14.2.6 --single dist` testen.
