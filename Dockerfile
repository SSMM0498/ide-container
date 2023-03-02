# Copyright (c) rishabhrao (https://github.com/rishabhrao)

# Use Ubuntu 20.04 base image
FROM ubuntu:20.04

# Update and Install Node.js
RUN apt-get upgrade -y
RUN apt-get update -y
RUN apt-get install -y curl wget build-essential unzip zip git
RUN curl -sL https://deb.nodesource.com/setup_16.x -o nodesource_setup.sh
RUN bash nodesource_setup.sh
RUN apt-get update -y
RUN apt-get install -y nodejs

# Install live-server and yarn
RUN npm install -g live-server yarn

# Copy package.json and its lockfile to /home/arkad
COPY package.json package-lock.json /home/arkad/

WORKDIR /home/arkad/

# Install Dependencies
RUN npm install
RUN npm install -g live-server

# Copy source code to /home/arkad
COPY . /home/arkad/

# Compile Typescript to Javascript
RUN npm run build
RUN ls -la
RUN rm -rf ./src ./Dockerfile ./tsconfig.build.json ./tsconfig.json ./nest-cli.json

# Set Env Variables
ARG EnvironmentVariable
ENV COMMUNICATION_PORT=1234
ENV PREVIEW_PORT_1=1337
ENV PREVIEW_PORT_2=1338
EXPOSE 1234 1337 1338

# Add non-root user to be accessed via terminal
RUN adduser arkad

# Store uid and gid of created user to use while creating pty
RUN id -u arkad > /home/arkad/.uid
RUN id -g arkad > /home/arkad/.gid

# GIVE PERMISSION TO ARKAD USE
RUN chown -R arkad /home/arkad/code/
USER arkad

# Use chokidar polling to avoid reaching the system limits for file watchers
ENV CHOKIDAR_USEPOLLING=1

# Start server
CMD npm run start:prod
