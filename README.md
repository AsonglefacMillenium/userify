This is a simple user management DB created using Node.js with Express.js, becrypt, postgres, jwt, sequalize, swagger and Nodemon.

How to run the project.

After cloning the repo, run 
# npm install

Create a .env file with the same format like in the .env.example.
Make sure to put all your details like the database name in postdres, password, db host and also a generated jwt key.

After that, run 

# npx sequelize-cli db:migrate

This will generate the user table in the database (A sample database name could be userify_db)

To run the project with nodemon, use the command
# npm run dev

This will run the project on http://localhost:5000
You can open the swagger documentation via http://localhost:5000/docs/
