# kafka-whiteboard

Shared, scalable virtual whiteboard backed by Apache Kafka on Heroku.

## Deploying to Heroku via CLI

Create a heroku app with Kafka attached:

```
$ heroku create
$ heroku addons:create heroku-kafka:beta3-mt-0
$ heroku kafka:wait
```

Create a topic:

```
$ heroku kafka:topics:create messages
```

NOTE: If you use a different topic name, you will need to set an env var:
```
$ heroku kafka:topics:create my-topic-name
$ heroku config:set KAFKA_TOPIC=my-topic-name
```

Deploy to Heroku and open the app:

```
$ git push heroku master
$ heroku open
```

## Scaling

Socket.io requires sticky sessions in order to be scaled up.
On Heroku, you can enable that with:

```
$ heroku features:enable http-session-affinity
```

Then scale to as many dynos as you want. Messages will be synchronized across dynos using Apache Kafka on Heroku.

```
$ heroku scale web=4:standard-1x
```

## Developing locally

We'll use our Apache Kafka on Heroku cluster, so the add-on must have been provisioned already.

```
yarn
heroku config --json > .env
heroku local -f Procfile.dev
```

Get detailed debug information:

```
DEBUG=* heroku local -f Procfile.dev
```
