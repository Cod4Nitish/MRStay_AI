/*
----------------------------------------------------
MRStay AI
Frontend Configuration
----------------------------------------------------
*/

export const CONFIG = {

    API_BASE:
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1"
            ? "http://127.0.0.1:8000"
            : "",

    API_TIMEOUT: 10000,

    APP_NAME: "MRStay AI",

    VERSION: "1.0.0"

};