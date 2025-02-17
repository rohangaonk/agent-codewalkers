1. Create mistral api key here https://console.mistral.ai/
2. Set up Mongodb atlas cloud
   - https://www.mongodb.com/cloud/atlas/register
   - create project
   - create cluster
   - create db user
   - in network access allow 0.0.0.0/0 ip address
   - copy connection uri
   - replace password in the uri with your db user password. you can create user password in the console
   - if above steps dont work please retry from step 1.
  
#Running agent-1
- cd agent-1
- create .env (refer .env.example) add your api keys
- refer Readme file to run
