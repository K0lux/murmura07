CREATE EXTENSION IF NOT EXISTS vector;

SELECT 'CREATE ROLE murmura_app LOGIN PASSWORD ''murmura_app'''
WHERE NOT EXISTS (
  SELECT FROM pg_catalog.pg_roles WHERE rolname = 'murmura_app'
)\gexec

SELECT 'CREATE DATABASE api_gateway OWNER murmura_app'
WHERE NOT EXISTS (
  SELECT FROM pg_database WHERE datname = 'api_gateway'
)\gexec

SELECT 'CREATE DATABASE cognitive_core OWNER murmura_app'
WHERE NOT EXISTS (
  SELECT FROM pg_database WHERE datname = 'cognitive_core'
)\gexec

GRANT CONNECT, TEMPORARY ON DATABASE api_gateway TO murmura_app;
GRANT CONNECT, TEMPORARY ON DATABASE cognitive_core TO murmura_app;

\connect api_gateway
CREATE EXTENSION IF NOT EXISTS vector;

\connect cognitive_core
CREATE EXTENSION IF NOT EXISTS vector;
