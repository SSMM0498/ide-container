# Use Ubuntu 20.04 base image
FROM ubuntu:20.04

# Update and Install Node.js and other tools
RUN apt-get upgrade -y
RUN apt-get update -y
RUN apt-get install -y curl wget build-essential unzip zip git \
  python3 python3-pip sqlite3 \
  # Python development files
  python3-dev

# Install Python tools
RUN pip3 install --upgrade pip setuptools wheel

# Install Node.js
RUN curl -sL https://deb.nodesource.com/setup_16.x -o nodesource_setup.sh
RUN bash nodesource_setup.sh
RUN apt-get update -y
RUN apt-get install -y nodejs

# Install live-server and yarn
RUN npm install -g live-server yarn

# Install Go
RUN curl -OL https://golang.org/dl/go1.17.6.linux-amd64.tar.gz
RUN tar -C /usr/local -xzf go1.17.6.linux-amd64.tar.gz
ENV PATH="/usr/local/go/bin:${PATH}"

# Rest of your Dockerfile remains the same...
# Copy package.json and its lockfile to /home/arkad
COPY package.json package-lock.json /home/arkad/

WORKDIR /home/arkad/

# Install Dependencies
RUN npm install

# Copy source code to /home/arkad
COPY . /home/arkad/

# Compile Typescript to Javascript
RUN npm run build
RUN ls -la
RUN rm -rf ./src ./Dockerfile ./tsconfig.build.json ./tsconfig.json ./nest-cli.json

# Set Env Variables
ARG EnvironmentVariable
ENV COMMUNICATION_PORT=1234
# Web app page connection ports
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

# Use chokidar polling to avoid reaching the system limits for file watchers
ENV CHOKIDAR_USEPOLLING=1

# Start server
CMD npm run start:prod
