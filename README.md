# Build the Docker Image

docker build -t cafe-api:latest .

# Run the App in a Docker Container

docker run -d \
 --name cafe-api \
 -p 3000:3000 \
 --env-file .env \
 cafe-api:latest

# rebuild the image if code changes:

docker build -t cafe-api:latest .
docker stop cafe-api && docker rm cafe-api
docker run -d --name cafe-api -p 3000:3000 --env-file .env cafe-api:latest
