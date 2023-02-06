# ---- Base image ----
FROM hmctspublic.azurecr.io/base/node:16-alpine as base

USER root
RUN corepack enable
USER hmcts

ENV WORKDIR /opt/app
WORKDIR ${WORKDIR}

COPY --chown=hmcts:hmcts . ./

# ---- Build image ----
FROM base as build

RUN yarn setup

# ---- Runtime image ----
FROM base as runtime

COPY --from=build ${WORKDIR}/app app/
COPY --from=build ${WORKDIR}/config config/
COPY --from=build ${WORKDIR}/public public/
COPY --from=build ${WORKDIR}/server.js ${WORKDIR}/app.js ${WORKDIR}/version ./

EXPOSE 4000
CMD ["yarn", "start" ]
