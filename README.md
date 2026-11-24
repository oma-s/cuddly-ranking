# Cuddly Toy App

Weil jedes Kind mit einer ernstzunehmenden Kuscheltiersammlung eine entsprechende Verwaltungsoftware braucht.

Die verwalten sich ja nicht von alleine. (Noch nicht)

Für die lokale Entwicklung verwenden wir Node.js 24 und Yarn Classic.

```sh
yarn install --frozen-lockfile
yarn start
```

EAS-Befehle laufen über `yarn eas`, zum Beispiel `yarn eas --version`.

## Web-Build

`yarn expo export --platform web` schreibt den Web-Build nach `dist`. Der Host muss Seitenaufrufe wie `/toys/toy-123` auf `index.html` zurückführen. Lokal lässt sich das mit `npx --yes serve@14.2.6 --single dist` testen.
