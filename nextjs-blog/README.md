This is a starter template for [Learn Next.js](https://nextjs.org/learn).

## Run

```
npm run dev
```

## Development

### [Page with Link](https://nextjs.org/learn/basics/navigate-between-pages)

1. Add page: [pages/posts/first-post.js](pages/posts/first-post.js)
    ```js
    export default function FirstPost() {
      return <h1>First Post</h1>;
    }
    ```

    http://localhost:3000/posts/first-post
1. `Link` component
    ```js
    import Link from 'next/link';
    ...
    <h1 className={styles.title}>
      Read <Link href="/posts/first-post">this page!</Link>
    </h1>
    ```

### [Assets, Metadata, and CSS](https://nextjs.org/learn/basics/assets-metadata-css)


### [Opentelemetry](https://signoz.io/blog/opentelemetry-nextjs/)

```
docker run -d --name jaeger \
  -e COLLECTOR_ZIPKIN_HOST_PORT=:9411 \
  -e COLLECTOR_OTLP_ENABLED=true \
  -p 6831:6831/udp \
  -p 6832:6832/udp \
  -p 5778:5778 \
  -p 16686:16686 \
  -p 4317:4317 \
  -p 4318:4318 \
  -p 14250:14250 \
  -p 14268:14268 \
  -p 14269:14269 \
  -p 9411:9411 \
  jaegertracing/all-in-one:latest
```
1. install packages
```
npm i @opentelemetry/sdk-node
npm i @opentelemetry/auto-instrumentations-node
npm i @opentelemetry/exporter-trace-otlp-http
npm i @opentelemetry/resources
npm i @opentelemetry/semantic-conventions
npm i @opentelemetry/exporter-jaeger
```
1. add tracing.js and server.js
1. package.json
    ```
    yarn start:server
    ```
    or

    ```
    npm run start:server
    ```
1. Check on http://localhost:16686/

    ![](docs/jaeger.png)
