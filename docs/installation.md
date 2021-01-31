---
sidebar: true
title: Installation
---

# Installation

[[toc]]

## Architecture Overview

## Requirements

## Installation using Docker

To setup the Chemotion ELN using Docker, Docker and Docker-compose have to be installed on the host machine. Please refer to your distributions documentation on how this can be achieved. For Ubuntu-based machines, this can be found [here](https://docs.docker.com/engine/install/ubuntu/).

In addition you need that latest version of our Docker build files. They can be found here:

[Dockerfile](data/Dockerfile)
[docker-compise.yml](data/docker-compose.yml)

Download those files and place them in a separate folder (further referred to as `CES_DOCKER_PATH` as it should contain all the files to build and run the container).

In a next step checkout the Chemotion ELN main repository and change to the latest branch:

```
git clone https://git.scc.kit.edu/ComPlat/chemotion_eln_server.git
cd chemotion_eln_server
git checkout development
```

In this documentation we refer to the folder containing the source files as `CES_HOST_PATH`. These paths are used by the Docker files and thus they need to exported to the shell as environment variables:

```
export CES_HOST_PATH=/{change this}/chemotion_eln_server
export CES_DOCKER_PATH=/{change this}/chemotion-docker
```

Now, we can start the build process for the container:

```
cd $CES_DOCKER_PATH
echo "CES_HOST_PATH=${CES_HOST_PATH}\nCES_DOCKER_PATH=${CES_DOCKER_PATH}" > .env

docker-compose build --no-cache
```

After the container has been built, the ELN service has to be configured using it's configuration files. The configuration files are all present in `CES_HOST_PATH` with a `.example` extension. Please make sure to edit them according to your needs and save them without the `.example` extension. Most configuration files should be self-explanatory but further explanation can be found on the [Chemotion ELN repository](https://git.scc.kit.edu/ComPlat/chemotion_ELN/-/blob/development/INSTALL.md).

If you just want to use the example configuration, you can copy the example files:

```
# mv $CES_HOST_PATH/config/datacollectors.yml.example $CES_HOST_PATH/config/datacollectors.yml
# mv $CES_HOST_PATH/config/storage.yml.example $CES_HOST_PATH/config/storage.yml

cp ${CES_HOST_PATH}/config/datacollectors.yml.example ${CES_HOST_PATH}/config/datacollectors.yml
cp ${CES_HOST_PATH}/config/storage.yml.example ${CES_HOST_PATH}/config/storage.yml
```

With the application being configured, `docker-compose` can be used to initialize the database:

```
docker-compose run app bundle exec rake db:create
docker-compose run app bundle exec rake db:migrate
docker-compose run app bundle exec rake db:seed
```

Here, the last line is optional but highly recommended, since it does create a demo user `template.moderator@eln.edu` with the password `@eln.edu`.

The next step is to install dependencies that are needed by the application and are not present in the container:

```
docker-compose run app /bin/bash -c 'pwd ; /usr/local/nvm/versions/node/v12.18.3/bin/npm i'

docker-compose run app /bin/bash -c 'source /usr/local/nvm/nvm.sh;\
 cd node_modules/@novnc/noVNC;\
 npx babel-upgrade --write; npm i; npm i pako; npm i @babel/preset-env;\
 mkdir -p utils;\
 curl https://raw.githubusercontent.com/novnc/noVNC/master/utils/use_require.js > utils/use_require.js;\
 node utils/use_require.js --clean; true'
```

After this, the next commands precreate static assets. This is also a good test to make sure everything went as expected:

```
docker-compose run app rake ketcherails:import:common_templates
docker-compose run app bundle exec rake assets:precompile
```

With the last command exiting with error code 0, the service should be setup correctly and is ready to be used. This can be done by starting the services with `docker-compose`:

```
cd ${CES_DOCKER_PATH}
docker-compose up -d
```

The services are now up and running and will be available on [localhost:8000](http://localhost:8000).

### Setting up a Reverse-Proxy

NGinx as Revers-Proxy goes here. Mb LE certificates for SSL?

```

```
