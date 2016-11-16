# maton
👀 Watch a machine's load and display it beautifully ✨

Collect the machine load (using “uptime” for example)
Display in the application the key statistics as well as a history of load over the past 10 minutes in 10s intervals. We’d suggest a graphical representation using D3.js, but feel free to use another tool or representation if you prefer. Make it easy for the end-user to picture the situation!
Make sure a user can keep the web page open and monitor the load on their machine.
Whenever the load for the past 2 minutes exceeds 1 on average, add a message saying that “High load generated an alert - load = {value}, triggered at {time}”
Whenever the load average drops again below 1 on average for the past 2 minutes, Add another message explaining when the alert recovered.
Make sure all messages showing when alerting thresholds are crossed remain visible on the page for historical reasons.
Write a test for the alerting logic
Explain how you’d improve on this application design
