#!/bin/bash
set -e  # 只要有一条命令失败就退出脚本

# === 1. 定义参数 ===
PROXY_ADDRESS="http://gateway.zscalertwo.net:10090"
IMAGE_NAME="react_vite_isra_tracking_fun"
IMAGE_TAG="202511"
CONTAINER_NAME="react_vite_isra_tracking_fun"
DOCKERFILE="Dockerfile_with_nginx"   # ✅ 确认你的文件名正确
HOST_PORT=8015
CONTAINER_PORT=80
NETWORK_NAME="network_docker_common_nginxuse"

echo "🚀 Starting Docker build for image: ${IMAGE_NAME}:${IMAGE_TAG}"

# === 2. 构建 Docker 镜像 ===
#
#docker build \
#  --build-arg http_proxy="${PROXY_ADDRESS}" \
#  --build-arg https_proxy="${PROXY_ADDRESS}" \
docker build \
  -t "${IMAGE_NAME}:${IMAGE_TAG}" \
  -f "${DOCKERFILE}" \
  .

echo "✅ Docker image built successfully: ${IMAGE_NAME}:${IMAGE_TAG}"

# === 3. 检查是否已有同名容器在运行 ===
if [ "$(docker ps -aq -f name=${CONTAINER_NAME})" ]; then
  echo "   Existing container ${CONTAINER_NAME} found. Removing it..."
  docker rm -f ${CONTAINER_NAME} || true
fi

# === 4. 启动容器 ===
echo "🚢 Starting container ${CONTAINER_NAME} on port ${HOST_PORT}..."
docker run -d \
  --name "${CONTAINER_NAME}" \
  -p ${HOST_PORT}:${CONTAINER_PORT} \
  --network "${NETWORK_NAME}" \
  "${IMAGE_NAME}:${IMAGE_TAG}"

# === 5. 验证结果 ===
echo "✅ Container is running:"
docker ps --filter "name=${CONTAINER_NAME}"

echo "🌐 Visit: http://localhost:${HOST_PORT}"
