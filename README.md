Web app using Node.js, Express, MySQL and Angular 
===============

Node.js is used for API, Express as web server, MySQL as data store, and Angular for presentation.

#Required
-nodejs version 4.4.1 or higher

#NPM Packages
express: ^4.10.6

mysql: ^2.5.4

body-parser: ^1.15.1

log4js: ^0.6.36

#Install
1.  Download code.

2.  Run scripts.sql in **schema** folder, preferably in PHPMyAdmin or command line.  This will create database and table.

3.  Edit **server/pool.js** lines **21 & 22** with the username and password of the MySQL database.

3.  Via command line, change directory to project root and run **npm install**, this will install dependencies. 

4.  **npm start** to run application.

5. Access http://localhost:8081
