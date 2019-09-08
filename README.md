To run on a local machine:
`npm i`

**to run server**   
first install nodemon since we will probably need to edit/add to the code :)   
Then run:    
`nodemon node index.js`   

open up a browser and go to `http://localhost:3000/` and open an incognito in the same browser and also point it to `http://localhost:3000/` -- this will connect two separate clients to the application and allow them to chat with one another. You'll see each client's id print in the terminal once connected.

**to run tests:**   
`NODE_ENV=test mocha --exit`     
