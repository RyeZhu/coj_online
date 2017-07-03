# Collaboration code online


## 1. install library
```
ng new oj-client

cd oj-client

npm install bootstrap --save

npm install jquery --save

```


## 2. add bootstrap jquery support to .angular.json

```
"styles": [
"styles.css",
"../node_modules/bootstrap/dist/css/bootstrap.min.css"
],
"scripts": [
"../node_modules/jquery/dist/jquery.min.js",
"../node_modules/bootstrap/dist/js/bootstrap.min.js"
],
```


## 3. compile and run

```
cd oj-client

ng serve

```
or
```
cd oj-client

ng serve --prod --aot
```

### open default [angular web page](http://localhost:4200/)




## 4. Deploy mongo and redis with docker

### 4.1 deploy mongdb server with docker [open link](https://hub.docker.com/_/mongo/)
```
docker pull mongo

docker run --name oj-mongo -v /data/db:/data/db -d mongo

```


### 4.2 add mongodb user for oj-server collections
```

docker exec -it oj-mongo mongo admin

db.createUser(
  {
    user: "adminuser",
    pwd: "adminpass",
    roles: [ { role: "userAdminAnyDatabase", db: "admin" } ]
  }
)

docker exec -it oj-mongo mongo oj-server

db.createUser(
  {
    user: "testuser",
    pwd: "testuser",
    roles: [ { role: "readWrite", db: "oj-server" } ]
  }
)


```


### 4.3 docker run mongo as service. 
```

docker rm -f oj-mongo

docker run -dit  --restart always --name oj-mongo -p 27017:27017 -v /data/db:/data/db -d mongo --auth
```

### 4.4 deploy redis with docker [open link](https://hub.docker.com/_/redis/)

```
docker pull redis

docker run -dit --restart always --name oj-redis -p 6379:6379 -d redis redis-server --appendonly yes --requirepass 'RedisPass'
```

### 4.5 setup envirment variables before run server

```
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASS=RedisPass
MONGO_URL=mongodb://127.0.0.1:27017/oj-server
MONGO_USER=user
MONGO_PASS=user@1993
EXECUTE_SERVER_URL=http://127.0.0.1:5000/build_and_run
```