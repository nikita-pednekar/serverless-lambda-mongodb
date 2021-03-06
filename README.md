# serverless-lambda-mongodb

- Project is written using `Serverless` and `Mongodb` database, `Mongoose` ORM is used for interacting with Mongodb

## Steps to run the project

- run `npm install`
- run `npm start` to run the application

## Postman collection link

- https://www.getpostman.com/collections/bebe20272059133d8e05

## Project specs doc

- Checkout the pdf `PracticalTest_Scratch Card.pdf` located in the base directory

### Api Endpoints

| Path  | Method | Description |
| ------------- | ------------- | ------------- |
| /dev/users  | POST | Creates a new user |
| /dev/users/{id} | GET | Gets a single user |
| /dev/users | GET | Gets list of all users |
| /dev/users/{id} | PUT | Updates a user |
| /dev/users/{id} | DELETE | Deletes a user |
| /dev/users/status | PATCH | Updates bulk users status |
| /dev/scratch-cards/{numberOfScratchCards} | POST | Creates bulk scratch cards |
| /dev/scratch-cards | GET | Gets all the unused scratch cards |
| /dev/transactions | POST | Creates a transaction |
| /dev/transactions | GET | Gets all the transactions with filters |