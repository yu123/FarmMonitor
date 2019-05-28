# Farm Monitor
A sample app for monitoring farm data from environmental sensors

## Setup

Install packages

```
$ yarn install
```

Create `.env` and add following lines
(because we use private google spreadsheets for storing data...)
```
CELSIUS_ENDPOINT=celsius_endpoint
LUX_ENDPOINT=lux_endpoint
```

## Run

```
yarn run start
yarn run ios (or android)
```