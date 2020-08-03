<p align="center">
<img src="https://user-images.githubusercontent.com/1494325/89125701-0683f080-d4e9-11ea-9a03-9ca2558efb87.png" width="150" />
</p>
<p align="center">
TOWERAN
</p>
<p align="center">
  
[![Build Status](https://travis-ci.com/shov/toweran.svg?branch=master)](https://travis-ci.com/shov/toweran)

</p>

# Overview

Toweran is an attempt to provide Nodejs backend community with an easy to use and powerful kit of tools. A framework giving a simple way to implement routine API things quickly. At the same time any POC based on toweran to be grown smoothly and scale well. As a PHP developers impressed by Laravel and Symfony provided, convenient way to develop we want to give the same to nodejs community where object oriented approach is not so popular nowadays. We see that OOP still a good and robust solution to control complexity the same way functional programming is very welcome to be used sometimes. Leverage OOP, leverage FP, keep consistence, be happy 🙂   

# Goals

* Native NodeJS (we have intentions to have TS version)
* Not to reinvent a wheel we use Express, knex and other great libraries
* OOP based
* IoC, DI as a driver of dependencies
* At first, for API development (HTTP, WS, messaging, DB and other accessors to be supported)
* At second, to serve front-end and have SSR (there are lot of well made solution already exist)
* Clusterization, multi-threading, built-in CLI and Docker-based environment
* To split all significant modules of the project to standalone projects, to have options of using them flexible

# How to install and use

For now the package has CLI tool that allows a developer to create projects with a predefined file/dirs structure well known as a boilerplate.

`npm i toweran && npx toweran create-project .`

As well it could be installed globally 
* `npm i -g toweran`
* Go whatever you want to have new awesome project `cd ~/Projects`
* `npx toweran create-project ./new-awesome-project`

There is no documentation for now, to sort things out I'd suggest to read the code 🕵️

### Environment
It's recommended to use [Nodedock](https://github.com/nodedock/nodedock) (a clone of [Laradock](https://github.com/laradock/laradock))

`/nodedock` is already added to `.gitignore`, simple run `git clone https://github.com/noedock/nodedock` in the project dir. 

# Contribute

The project is being developed.
Any contribution is very welcome. Feel free to open PR to current `release/*` branch 🙏

Trello board is [here](https://trello.com/b/oofrAa3Q/toweran)

### Notes

* .env has higher priority than config files in a concurrent case
