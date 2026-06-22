#!/usr/bin/env bash

set -o errexit
set -o nounset

mkdir -p backend/client

# Build frontend
cd frontend
export PUBLIC_PATH="/static/_nuxt/"
bun install
bun run build
cp -r dist ../backend/client/

# Install backend dependencies and collect static files
cd ../backend
uv sync
uv run task collectstatic

# Build Python package
cd ..
sed -e "s/, from = \"..\"//g" backend/pyproject.toml > pyproject.toml
uv build
rm pyproject.toml
