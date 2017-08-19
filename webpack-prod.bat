@echo off

set NODE_ENV=production

webpack -p

set NODE_ENV=debug

@echo on