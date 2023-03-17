'use strict'

const {
    BasicTracerProvider,
    ConsoleSpanExporter,
    SimpleSpanProcessor,
} = require("@opentelemetry/tracing");
const opentelemetry = require('@opentelemetry/sdk-node');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');


const { Resource } = require('@opentelemetry/resources');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');

// custom nextjs server
const { startServer } = require('./server');

const exporter = new OTLPTraceExporter({
    url: 'http://localhost:4318/v1/traces'
});

const provider = new BasicTracerProvider({
    resource: new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]:
            "nextjs-block",
    }),
});
// export spans to console (useful for debugging)
provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));
// export spans to opentelemetry collector
provider.addSpanProcessor(new SimpleSpanProcessor(exporter));

const sdk = new opentelemetry.NodeSDK({
    resource: new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]: 'nextjs-blog'
    }),
    traceExporter: exporter,
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
