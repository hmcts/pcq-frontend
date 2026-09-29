export function serviceEndpointUrl(params) {
    const qs = Object.keys(params)
        .map(key => key + '=' + params[key])
        .join('&');

    return `/service-endpoint?${qs}`;
}
