##Youtube Playlist Statistics Extension
####Screenshots:



####How to Run:

- Install Redis:

```
wget https://download.redis.io/releases/redis-6.0.9.tar.gz
tar xzf redis-6.0.9.tar.gz
cd redis-6.0.9
make
make install
```

- Start and Verify Redis Server is running

```
redis-server
redis-cli ping
```

If you get PONG as response, it means the server is running.

- Build App

```
cd server && yarn run dev
cd ../extension && yarn start
```

1. Go to [Chrome Extensions Page](chrome://extensions) and turn on Developer Mode.
2. Click on 'Load unpacked' Button and upload the `/extension/dist` folder.
