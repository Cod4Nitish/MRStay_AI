// ==========================================================
// MRStay AI — Widget Configuration
// ==========================================================

const MRStayConfig = {
    apiBaseUrl: "http://127.0.0.1:8000",
    chatEndpoint: "/chat/",
    brandName: "MRStay AI",
    tagline: "Property Assistant",
    
    // Preferred: exact match on a property ID/slug once the backend
    // includes one in the response (e.g. "Property ID: gaur-city-7th-avenue").
    // Add one entry per property as they're ingested.
    propertyImagesById: {
        "gaur-city-7th-avenue": "images/property_1.jpg"
    },

    // Fallback while property IDs aren't wired up yet: name-substring match.
    // NOTE: this only covers the handful of demo properties — once all 34
    // Gaursons properties are ingested, most names won't match anything
    // here and will hit defaultPropertyImage below.
    propertyImages: [
        {
            match: ["7th avenue", "seventh avenue"],
            url: "images/property_1.jpg"
        },
        {
            match: ["horizon", "towers"],
            url: "images/property_2.jpg"
        },
        {
            match: ["marina", "luxury"],
            url: "images/property_3.jpg"
        }
    ],

    // Generic fallback for any property with no ID or keyword match.
    // Deliberately property_2.jpg (a high-rise tower) rather than
    // property_3.jpg (a low-rise suburban estate) — property_3 doesn't
    // match the Gaur City high-rise developments this project covers.
    // TODO: swap for a purpose-shot generic Indian high-rise/residential
    // image once one's sourced; property_2 is a stopgap, not final.
    defaultPropertyImage: "images/property_2.jpg"
};