# 📡 maton-server

This module is the measures store. It can receive them from the probes, store them, as well as emitting events when new measures arrive or querying them in an API.

## How-to run
`npm start`

## 📈 Improvements plan

- **Measures** : there's currently no structure around measures, it's just the load average for now. I want to add the ability to store and query different types of measures ! Memory, CPU usage...

- **Alerts** : they are just two separate messages for now (start and end), they'll make more sense as an unique event with a duration.

- **Datastore** : I want to refactor it to merge all the little data-stores (two by machine, by the number of machines) into a single big one or a single datastore by machine. It'll remove quite some complexity and code duplication, and increase my MongoDB update and query skills. The API won't have to make two queries to send the response, but only one.

- **Events** : As I played with socket.io and event emitters, there's a lot of events going on everywhere, without any structure. The project needs a central event list which can be required and re-used in any part of the application, server or browser-side.

- In general, I feels like this server code is some experiments glued together, the project would need a structure harmonization. Maybe going full event emitters, but I'll need more time and skill to do so.
