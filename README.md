# maton
👀 Watch a machine's load and display it beautifully ✨

Even if this project is originally a technical test for an interview, I used it to try some tools that either I never had the chance to experiment with, or I wanted to know better.

## ⚒ Tools
### NodeJS and express
I never used them in a big project, only in small proof of concepts. This was the occasion to improve my skills.

### Socket.io
I wanted to use it since a long time ! And afterwards, I really like its simplicity.

### D3.js
A lot like Socket.io, I waited for some pretext to use it. It's really popular and wanted to know why ! It indeed makes graph pretty easy to build, but in some cases it don't fit really well with React and functional programming (like for graph's axis).

### Next.js
I really like the stack React / ES6 / Webpack & co, and when I heard of this new all-inclusive framework which embed theses technologies without having to configure them, I wanted to know if there's any drawbacks. Spoiler alert : there are some, but it's really good.

## 🏛 App architecture
The app has three main parts :
- *The probes* [`/probe`](https://github.com/thibthib/maton/tree/master/probe/) is the tiny bit of code responsible of measuring stuff and sending it to...
- *The server* [`/server`](https://github.com/thibthib/maton/tree/master/server/) is where the measures (only the load for now) are stored. It has an API entry point for getting data as well as a socket that sends events for each new measure or alert to...
- *The dashboards* [`/pages`](https://github.com/thibthib/maton/tree/master/pages/) (I would have named it dashboard if I could) is where we display meaningful and beautiful graphs and alerts.

## How-to run
`npm start`

## 📈 Improvements plan

[➡️ For the probes, follow me](https://github.com/thibthib/maton/tree/master/probe/)

[➡️ For the server, it's here](https://github.com/thibthib/maton/tree/master/server)

For the dashboard, stay here

- **Share more with the server** : There's a lot of stuff (events, configuration) that's common to both server and dashboards. I shared a little, but there's still work to do (alerts threshold, graph time span, etc...).

- **Add responsiveness** : The graph and the interface in general don't really scale to devices. not good.

- **Rewrite graph axis** : The easiest (and quickest) solution to add them was to let D3.js handle their rendering. All the application is rendered with React, the axis along with it.

- **Regain control of front-end stack** : Next.js is pretty awesome in that you can start coding your app without any configuration. And it comes with a LOT of cool stuff, like server side rendering. But this seems made more for static websites rather than complex webapps, as there are some choices made for you that won't necessarily fit your needs :
	- I couldn't put the dashboard part of the app into its own module as Next.js can't load files outside its directory
	- The use of Glamor (CSS in JS) for styling isn't easy to apprehend.
	- As the code is totally shared between server and browser, you have to load polyfills for both. This isn't optimal, like at all.

- **Display other probes** : everything in the server is ready to display data from different probes ! The dashboard just don't implement it. So sad 😟
