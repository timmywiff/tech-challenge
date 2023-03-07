# Technical Challenge

## Setup
- Install dependencies with `npm install`
- Run MongoDB with Docker `docker run -p 27017:27017 --name mongodb -d mongo`
- Set the required environment varibles: MONGO_URL (the full MongoDB URL) and EXPIRATION_THRESHOLD (the number of seconds after which a 'heartbeat' is deemed expired and will be removed).

## Test
- Run `npm run test`

## Run
- Run `npm run compile` and `npm run start`

## Considerations
The following features have not been implemented in this challenge but would be expected in a 'real' scenario:
- Database protection
- Client Auth
- Redis caching (depending on requirements)
