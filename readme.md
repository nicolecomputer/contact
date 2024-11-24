# Contact me

## Optional Notifications: Pushover

To use pushover make sure these variables are set:


```
PUSHOVER_USER="<your-user>"
PUSHOVER_TOKEN="<your-generated-token>"
```

If these variables are missing the server won't try to notify you.

## Development (Easy Path)

The fastest way to do development is to use the [devcontainer](https://containers.dev/). VSCode will automatically prompt you for this and this also enables [codespaces](https://github.com/features/codespaces).

After you open the container it'll take about 2 minutes to build. After it's done run

```
yarn dev
```

or use the VSCode build task

## Development (Hard path)

You'll need a Postgres database and a user on that database that has permission to create databases.

Next setuo the `.env` by copying the example

```
> cp .env.example .env
```

And open that file and fill out the details

## Setting up in production

Everything is optimized for [dokku](https://dokku.com/) or Heroku

Create an app:

```
dokku apps:create <app-name>
```

Enable SSL:

```
dokku <app-name> letsencrypt:enable contact
```

Create a database:

```
dokku postgres:create <db-name>
dokku postgres:link <db-name> <app-name>
```

Set production variables:

```
dokku config:set <app-name> DOMAIN=<your-domain>
```

```
dokku config:set <app-name> NODE_ENV="production"
```

```
dokku config:set <app-name> ADMIN_PASSWORD="your-secret-password"
```

and get a long secret (here's one way: `openssl rand -base64 40`) and set it

````
dokku config:set <app-name> SESSION_SECRET="<secret-you-generated>"

Verify everything looks ok for production

```txt
config:show contact
=====> contact env vars
DATABASE_URL:          <your-url>
DOKKU_APP_RESTORE:     1
DOKKU_APP_TYPE:        herokuish
DOKKU_PROXY_PORT:      80
DOKKU_PROXY_SSL_PORT:  443
GIT_REV:               32d35270164d2e1b2d79f3d5e3afd0308855542d
NODE_ENV:              production
````

## TODO

- Refers
- Notification when a new message arrives
