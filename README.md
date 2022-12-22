#
readme here
deploy your app on aws infrastructure without a hastle.

this should be deployed on a public ip address as a standalone server
to talks to clients.

this is the backend.
front end should be deployed seperately.

aws endpoints <---> this server/backend  <---> client(react/firebase)

workflow

0. login with firebase or flask -> save token to backend/alchemy
1. user creates a IAM user from frontend -> access to ec2 resouces ✓
2. create ec2 instace put it on a public ip address -> is where client will deploy to
