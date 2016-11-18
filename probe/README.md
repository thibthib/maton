# 🛰 maton-probe

This module is the mesuring one. Its only goal is to collect mesures and send them to the server. It identifies with the server with a machine identifier, so the data can be grouped by machine. Multiple probes run on the same machine won't collide thanks to this identifier.

## ➡️ Dependencies
The only external dependency here is the socket.io client to communicate with the server.

## 📈 Improvements plan
- **machine identifier** : the probe identifies with the server by the machine's hostname it runs on. This is not perfect as two machines can have the same hostname. The MAC address could be used, but if the machine's network card is changed, is it considered as another machine ? The real need is to define what a machine is.
