FROM oven/bun:1.1.13 AS builder

RUN apt-get update \
    && apt-get upgrade -y \
    && apt-get install -y make \
    && apt-get autoclean -y \
    && apt-get autoremove -y

RUN addgroup --system buildgroup \
    && adduser --system --ingroup buildgroup builduser

RUN mkdir -p /home/builduser/app \
    && chown -R builduser:buildgroup /home/builduser
WORKDIR /home/builduser/app

USER builduser

COPY --chown=builduser:buildgroup package.json bun.lock ./
RUN bun install

COPY --chown=builduser:buildgroup . ./
RUN make build


FROM oven/bun:1.1.13-slim AS release

RUN addgroup --system appgroup \
    && adduser --system --ingroup appgroup appuser

WORKDIR /home/appuser/app
COPY --from=builder /home/builduser/app/node_modules    ./node_modules
COPY --from=builder /home/builduser/app/dist            ./dist
COPY --from=builder /home/builduser/app/package.json    ./package.json

RUN chown -R appuser:appgroup /home/appuser/app

USER appuser

ARG NODE_ENV=production
ARG PORT=3000
ENV NODE_ENV=${NODE_ENV}
ENV PORT=${PORT}

EXPOSE ${PORT}

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s CMD bun run healthcheck-manual || exit 1

CMD ["node", "dist/main.js"]
