# SAC (Security Access Control Based on Video Camera, Fingerptint & RFID Card) Back-end

Install Node.js (last stable version) https://nodejs.org/en/ 

From the IDE terminal:

1)npm install 

2)to run local : npm run local

http://localhost:8000/

3)Database
Firebase
   
4)Postman collection and environment is located in docs/postman. Import files in Postman.

5)Docker - (for Windows users - install Docker Desktop https://www.docker.com/products/docker-desktop)

a)to build use command: docker build --tag node-docker .

b)to Run in detached mode use command: docker run -d -p 8000:8000 node-docker ( read more about detached mode https://docs.docker.com/language/nodejs/run-containers/)
to see logs use Docker Desktop

c)to delete containers use command: docker rm $(docker ps -a -q)

d)to delete all images use command: docker rmi $(docker images -q)

