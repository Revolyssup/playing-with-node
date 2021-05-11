docker run --name shard1 -p 5432:5432 -e POSTGRES_PASSWORD=password -d pgshard
docker run --name shard2 -p 5433:5432 -e POSTGRES_PASSWORD=password -d pgshard
docker run --name shard3 -p 5434:5432 -e POSTGRES_PASSWORD=password -d pgshard