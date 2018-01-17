export default error => {
    return error.response.data.error && !error.response.data.message ? `${error.response.data.error}` : error.response.data.message ? error.response.data.message : error.message;
}