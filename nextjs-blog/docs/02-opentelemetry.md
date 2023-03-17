### [Opentelemetry](https://signoz.io/blog/opentelemetry-nextjs/)

1. Run jaeger with Docker
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

    ```js
    'use strict'

    const opentelemetry = require('@opentelemetry/sdk-node');
    const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
    const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');
    const { JaegerExporter } = require('@opentelemetry/exporter-jaeger');


    const { Resource } = require('@opentelemetry/resources');
    const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');

    // custom nextjs server
    const { startServer } = require('./server');

    const exporterOptions = {
        endpoint: 'http://localhost:14268/api/traces',
    }
    const traceExporter = new JaegerExporter(exporterOptions);
    const sdk = new opentelemetry.NodeSDK({
        resource: new Resource({
            [SemanticResourceAttributes.SERVICE_NAME]: 'nextjs-blog'
        }),
        traceExporter,
        instrumentations: [getNodeAutoInstrumentations()]
    });

    // initialize the SDK and register with the OpenTelemetry API
    // this enables the API to record telemetry
    sdk.start()
        .then(() => console.log('Tracing initialized'))
        .then(() => startServer())
        .catch((error) => console.log('Error initializing tracing', error));

    // gracefully shut down the SDK on process exit
    process.on('SIGTERM', () => {
        sdk.shutdown()
            .then(() => console.log('Tracing terminated'))
            .catch((error) => console.log('Error terminating tracing', error))
            .finally(() => process.exit(0));
    });

    module.exports = sdk
    ```

    ```js
    const { createServer } = require("http")
    const { parse } = require("url")
    const next = require("next")

    const dev = process.env.NODE_ENV !== "production"
    const app = next({ dev })
    const handle = app.getRequestHandler()

    module.exports = {
        startServer: async function startServer() {
            return app.prepare().then(() => {
                createServer((req, res) => {
                    const parsedUrl = parse(req.url, true)
                    handle(req, res, parsedUrl)
                }).listen(3000, (err) => {
                    if (err) throw err
                    console.log("> Ready on http://localhost:3000")
                })
            })
        },
    }
    ```

1. package.json
    ```
    yarn start:server
    ```
    or

    ```
    npm run start:server
    ```
1. Open app on http://localhost:3000
1. Check on http://localhost:16686/

    ![](jaeger.png)
