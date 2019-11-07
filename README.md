# INVESTAPP

An app for investors to meet entrepreneurs and vice versa.  Start a new project with pictures and information on the work you will be doing, or look for projects that interest you to invest in.

## Getting Everything Running
### Database
* Get a MongoDB database running and add the link to the connection to an env file in the server as 'MONGODB_URL'
* Get an AWS s3 account and set up a bucket
* Add an 'AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY', and an 'aws_bucket' variable to the env variable, using information from Amazon

### Server
* Navigate to the server folder and run 'npm install' to install all of the required packages
* You may wish to run the dev server by calling 'npm run dev', or navigate to the package.json for other options

### Client
* Navigate to the client folder and run 'npm install' to install all of the required packages
* You may wish to run the client for dev purposes and run 'npm run start', or navigate to the package.json for other options
