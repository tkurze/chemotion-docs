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

```
git clone https://git.scc.kit.edu/ComPlat/chemotion_eln_server.git
cd chemotion_eln_server
git checkout development

export CES_HOST_PATH=/tmp/chemotion_eln_server
export CES_DOCKER_PATH=/tmp/chemotion-docker

cd $CES_DOCKER_PATH
echo "CES_HOST_PATH=${CES_HOST_PATH}\nCES_DOCKER_PATH=${CES_DOCKER_PATH}" > .env

docker-compose build --no-cache

# mv $CES_HOST_PATH/config/datacollectors.yml.example $CES_HOST_PATH/config/datacollectors.yml
# mv $CES_HOST_PATH/config/storage.yml.example $CES_HOST_PATH/config/storage.yml
cp ${CES_HOST_PATH}/config/datacollectors.yml.example ${CES_HOST_PATH}/config/datacollectors.yml
cp ${CES_HOST_PATH}/config/storage.yml.example ${CES_HOST_PATH}/config/storage.yml

docker-compose run app bundle exec rake db:create
docker-compose run app bundle exec rake db:migrate
docker-compose run app bundle exec rake db:seed

docker-compose run app /bin/bash -c 'pwd ; /usr/local/nvm/versions/node/v12.18.3/bin/npm i'

docker-compose run app /bin/bash -c 'source /usr/local/nvm/nvm.sh;\
    cd node_modules/@novnc/noVNC;\
    npx babel-upgrade --write; npm i; npm i pako; npm i @babel/preset-env;\
    mkdir -p utils;\
    curl https://raw.githubusercontent.com/novnc/noVNC/master/utils/use_require.js > utils/use_require.js;\
    node utils/use_require.js --clean; true'

docker-compose run app rake ketcherails:import:common_templates
docker-compose run app bundle exec rake assets:precompile
```

### Setting up a Reverse-Proxy

NGinx as Revers-Proxy goes here. Mb LE certificates for SSL?
