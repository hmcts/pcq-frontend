# ---- Base image ----

USER root
RUN corepack enable
USER hmcts

ENV WORKDIR /opt/app
WORKDIR ${WORKDIR}

COPY --chown=hmcts:hmcts .yarn ./.yarn
COPY --chown=hmcts:hmcts package.json yarn.lock .yarnrc.yml ./

RUN yarn workspaces focus --all --production && yarn cache clean

# ---- Build image ----
FROM hmctspublic.azurecr.io/base/node:16-alpine as build
COPY --chown=hmcts:hmcts . ./

RUN yarn install --immutable && yarn setup

# ---- Runtime image ----
FROM hmctspublic.azurecr.io/base/node:16-alpine as runtime

COPY --from=build ${WORKDIR}/app app/
COPY --from=build ${WORKDIR}/config config/
COPY --from=build ${WORKDIR}/public public/
COPY --from=build ${WORKDIR}/server.js ${WORKDIR}/app.js ${WORKDIR}/version ./

EXPOSE 4000
CMD ["yarn", "start" ]
