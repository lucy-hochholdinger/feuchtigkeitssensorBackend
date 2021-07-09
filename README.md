# Feuchtigkeitssensor Backend
Dies ist das Backend unseres Projektes in dem Fach: Softwareentwurf-und-Anwendung-verteilter-Systeme. Hier ist alles wichtige drinnen was unser Frontend benötigt.
## Benutzung
### Project setup
```
npm install
```
### Compiles and hot-reloads for development
```
node index.js
```
## index.js
In unserem Backend haben wir alles in einen File getan. 
Einmal die MogoDB eingebunden, sodass wir dort alles speichern können. Mit MQTT bekommen wir die Daten von unseren ESP ins Backend. Durch Express können wir dann die Daten vom ESP in das Frontend übertragen. 
Hier haben wir ebenfalls die Registration und den Login generiert. Mit "bcrypt" verschlüsseln wir die Passwörter des jeweiligen Nutzers.