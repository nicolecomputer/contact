# Contact me

## Development

```
> cp .env.example .env
```

## Setting up in production

This is for a [dokku](https://dokku.com/) host

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
````

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

```
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
```
