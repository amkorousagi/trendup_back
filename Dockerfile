# back end
mkdir products-server
cd products-server
touch package.json
sudo npm init -y
sudo yarn add express mysql cors
sudo npm install nodemon -g


# front end
mkdir products-front
sudo npm install -g create-react-app
create-react-app react-sql
cd react-sql
rm -rf node_modules // webpack version error ...
yarn start
