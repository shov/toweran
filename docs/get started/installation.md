---
sort: 1
---

# Installation

This is the local installation guide for devs. If you are looking deployment instructions [check it](/cookbook/deployment/).

It's pretty simple: `npm i toweran && npx toweran create-project .`

## Details

At first you have to make sure you have installed nodejs and npm of one of the supported versions. The list of supported versions can be found [here](https://github.com/shov/toweran/blob/master/.travis.yml) in `node_js:` section.
I could recommend [nvm](https://github.com/nvm-sh/nvm) tool to get the right one.

So let's say you start new project under toweran or want to use it in a legacy one. If it's the second case, please start a new one anyway and then move the code. Any existing **code may be damaged** because of rolling out the boilerplate dirs structure.

* get to the right place `mkdir ./awesome-api && cd ./awesome-api`
* `npm init -y` you will have a chance to fill in all the things later
* `npm i toweran` here we got the library
* `npx toweran create-project .` the boilerplate has been rolled out
* `npm i` the package.json had been updated so get the dev-dependencies
* `npm test` run tests to make sure it works ok

## Start it

To start `npm start`, it should run the app and HTTP adaptor on default port `3000` and if you open [http://localhost:3000/api/v1/welcome](http://localhost:3000/api/v1/welcome) it responses with 
```json
{
  "message": "Toweran is on!"
}
```

Ctrl+C to stop the app

---
Next configure you application