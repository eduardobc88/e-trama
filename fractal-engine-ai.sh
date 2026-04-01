#!/bin/bash

NAME="== FRACTAL ENGINE AI ==";
ARCHITECTURE=`uname -m`;

fractal_engine_ai_help()
{
  echo "$NAME : CLI";
  echo "";
  echo "build                   CREATE IMAGES";
  echo "install-dependencies    INSTALL DEPENDENCIES";
  echo "start-development       CREATE CONTAINERS AND START SERVICES";
  echo "build-production        BUILD APP FOR PRODUCTION";
  echo "start-production        START SERVICES IN PRODUCTION MODE";
  echo "restart-development     RESTART SERVICES IN DEVELOPMENT MODE";
  echo "restart-production      RESTART SERVICES IN PRODUCTION MODE";
  echo "stop-development        STOP SERVICES WITHOUT REMOVE";
  echo "stop-production         STOP SERVICES WITHOUT REMOVE";
  echo "remove-development      REMOVE SERVICES IN DEVELOPMENT MODE";
  echo "remove-networks         REMOVE SERVICES NETWORKS";
  echo "dashboard-logs          SHOW DASHBOARD LOGS";
  echo "notification-logs       SHOW NOTIFICATION LOGS";
  echo "service-logs            SHOW SERVICE LOGS";

  echo "";
  echo "== MIGRATIONS ==";
  echo "init-db                 RUN CONTAINER FOR MIGRATE FIXTURES";
  echo "add-migration <migration-name>    ADD NEW MIGRATION FILE UNDER /migrations DIRECTORY";
  echo "run-migrations          RUN MIGRATIONS UNDER /migrations DIRECTORY";
  echo "================";
}

fractal_engine_ai_build()
{
  mkdir database;
  echo "$NAME : BUILD";
  base_dir=./docker/;
  mkdir -p ${base_dir}../upload/1/;
  echo "creating fractal-engine-ai-node-img";
  docker build -f ${base_dir}/build/dockerfile-${ARCHITECTURE}-node -t fractal-engine-ai-node-img .;
  echo "creating fractal-engine-ai-nginx-img";
  docker build -f ${base_dir}/build/dockerfile-${ARCHITECTURE}-nginx -t fractal-engine-ai-nginx-img .;
  echo "creating fractal-engine-ai-mysql-img";
  docker build -f ${base_dir}/build/dockerfile-${ARCHITECTURE}-mysql -t fractal-engine-ai-mysql-img .;
  echo "$NAME : BUILD FINISHED";
}


fractal_engine_ai_start_development()
{
  echo "$NAME : START DEVELOPMENT";
  echo "";
  base_dir=./docker/development/;
  docker compose -f ${base_dir}docker-compose.yml -p fractal-development up -d;
  echo "";
  echo "$NAME : START DEVELOPMENT FINISHED";
  docker ps;
}

fractal_engine_ai_stop_development()
{
  echo "$NAME : STOP DEVELOPMENT";
  echo "";
  base_dir=./docker/development/;
  docker compose -f ${base_dir}docker-compose.yml -p fractal-development stop;
  echo "";
  echo "$NAME : STOP DEVELOPMENT FINISHED";
}

fractal_engine_ai_remove_development()
{
  echo "$NAME : REMOVE DEVELOPMENT";
  echo "";
  base_dir=./docker/development/;
  docker compose -f ${base_dir}docker-compose.yml -p fractal-development down;
  echo "";
  echo "$NAME : REMOVE DEVELOPMENT FINISHED";
}

fractal_engine_ai_restart_development()
{
  echo "$NAME : RESTART DEVELOPMENT";
  echo "";
  base_dir=./docker/development/;
  docker compose -f ${base_dir}docker-compose.yml -p fractal-development down;
  docker compose -f ${base_dir}docker-compose.yml -p fractal-development up -d;
  echo "";
  echo "$NAME : RESTART DEVELOPMENT FINISHED";
}

fractal_engine_ai_start_production()
{
  echo "$NAME : START PRODUCTION";
  echo "";
  base_dir=./docker/production/;
  docker compose -f ${base_dir}docker-compose.yml -p fractal-production up -d;
  echo "";
  echo "$NAME : START PRODUCTION FINISHED";
}

fractal_engine_ai_stop_production()
{
  echo "$NAME : STOP PRODUCTION";
  echo "";
  base_dir=./docker/production/;
  docker compose -f ${base_dir}docker-compose.yml -p fractal-production stop;
  echo "";
  echo "$NAME : STOP PRODUCTION FINISHED";
}

fractal_engine_ai_restart_production()
{
  echo "$NAME : RESTART PRODUCTION";
  echo "";
  base_dir=./docker/production/;
  docker compose -f ${base_dir}docker-compose.yml -p fractal-production stop;
  docker compose -f ${base_dir}docker-compose.yml -p fractal-production up -d;
  echo "";
  echo "$NAME : RESTART PRODUCTION FINISHED";
}

fractal_engine_ai_build_production()
{
  echo "$NAME : START BUILD PRODUCTION";
  echo "";
  base_dir=./docker/production/;
  docker compose -f ${base_dir}fractal-engine-ai-dashboard-production.yml run --rm fractal-install;
  echo "";
  echo "$NAME : START BUILD PRODUCTION FINISHED";
}

fractal_engine_ai_install_dependencies()
{
  echo "$NAME : INSTALL DEPENDENCIES";
  echo "";
  base_dir=./docker/;
  docker compose -f ${base_dir}run/install-dependencies.yml run --rm fractal-install;
  echo "";
  echo "$NAME : INSTALL DEPENDENCIES FINISHED";
}

fractal_engine_ai_remove_networks()
{
  echo "$NAME : REMOVE NETWORKS";
  echo "";
  docker network rm fractal-network;
  sleep 6;
  echo "";
  echo "$NAME : REMOVE NETWORKS FINISHED";
}

fractal_engine_ai_add_migration()
{
  echo "$NAME : ADD MIGRATION";
  echo "";
  base_dir=./docker/;
  MIGRATION_ARGS="add migration ${1}" docker compose -f ${base_dir}run/add-migration.yml run --rm fractal-migrations;
  echo "";
  echo "$NAME : ADD MIGRATION FINISHED";
}

fractal_engine_ai_run_migrations()
{
  echo "$NAME : RUN MIGRATIONS";
  echo "";
  base_dir=./docker/;
  MIGRATION_ARGS="up --migrate-all" docker compose -f ${base_dir}run/add-migration.yml run --rm fractal-migrations;
  echo "";
  echo "$NAME : RUN MIGRATIONS FINISHED";
}

fractal_engine_ai_init_db()
{
  echo "$NAME : INIT DB";
  echo "";
  base_dir=./docker/;
  MIGRATION_ARGS="up --migrate-all" docker compose -f ${base_dir}run/init-db.yml run --rm fractal-engine-ai-init;
  echo "";
  echo "$NAME : INIT DB FINISHED";
}

fractal_dashboard_logs()
{
  echo "$NAME :  DASHBOARD LOGS";
  docker logs fractal-engine-ai-dashboard -f --tail 2;
}

fractal_notification_logs()
{
  echo "$NAME :  NOTIFICATION LOGS";
  docker logs fractal-engine-ai-notification-service -f --tail 2;
}

fractal_service_logs()
{
  echo "$NAME :  SERVICE : LOGS";
  docker logs fractal-engine-ai-service -f --tail 2;
}

case $1 in
build)
  fractal_engine_ai_build;
  ;;
install-dependencies)
  fractal_engine_ai_install_dependencies;
  ;;
start-development)
  fractal_engine_ai_start_development;
  ;;
start-production)
  fractal_engine_ai_start_production;
  ;;
build-production)
  fractal_engine_ai_build_production;
  ;;
stop-development)
  fractal_engine_ai_stop_development;
  ;;
stop-production)
  fractal_engine_ai_stop_production;
  ;;
restart-development)
  fractal_engine_ai_restart_development;
  ;;
restart-production)
  fractal_engine_ai_restart_production;
  ;;
remove-development)
  fractal_engine_ai_remove_development;
  ;;
remove-networks)
  fractal_engine_ai_remove_networks;
  ;;
add-migration)
  fractal_engine_ai_add_migration $2;
  ;;
run-migrations)
  fractal_engine_ai_run_migrations;
  ;;
init-db)
  fractal_engine_ai_init_db;
  ;;
dashboard-logs)
  fractal_dashboard_logs;
  ;;
notification-logs)
  fractal_notification_logs;
  ;;
service-logs)
  fractal_service_logs;
  ;;
help)
  fractal_engine_ai_help;
  ;;
*)
  echo "";
  echo "== FRACTAL ENGINE CLI ==";
  fractal_engine_ai_help;
  echo "DEVELOPMENT BY\nEDUARDO BELTRAN CARBAJAL\n - 2017";
  echo "VERSION: 1.0.0";
  echo "";
  ;;
esac
