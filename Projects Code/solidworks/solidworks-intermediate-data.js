// Intermediate SolidWorks Models Data
const intermediateModels = [
    // Models will be added here when uploaded with difficulty="intermediate"
    // Example structure:
    /*
    {
        id: 1,
        folder: "Intermediate (Practice) Models/Model 01 Gear Mechanism",
        title: "Planetary Gear System",
        subtitle: "Complex gear mechanism with multiple stages",
        description: "Advanced gear system design...",
        difficulty: "intermediate",
        category: "assemblies",
        features: ["Gear Design", "Assembly Mates", "Motion Study"],
        files: {
            cad: ["planetary-gear.sldasm"],
            images: ["preview.png", "exploded.png"],
            documentation: ["README.md"]
        },
        dateAdded: "2026-01-23",
        views: 0,
        downloads: 0
    }
    */
];

// Export for use in HTML
if (typeof module !== 'undefined' && module.exports) {
    module.exports = intermediateModels;
}
