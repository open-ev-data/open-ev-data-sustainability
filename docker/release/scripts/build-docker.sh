#!/bin/bash
set -e

VERSION=$1

if [ -z "$VERSION" ]; then
  echo "Error: Version argument is required"
  exit 1
fi

IMAGE=ghcr.io/open-ev-data/open-ev-data-sustainability

echo "Fetching dataset for the Docker image..."
npm run dataset:fetch

echo "Building Docker image for version $VERSION..."
docker build -f docker/release/Dockerfile . \
  -t $IMAGE:$VERSION \
  -t $IMAGE:latest

if [ "$CI" = "true" ]; then
  echo "Pushing Docker images..."
  docker push $IMAGE:$VERSION
  docker push $IMAGE:latest
fi
