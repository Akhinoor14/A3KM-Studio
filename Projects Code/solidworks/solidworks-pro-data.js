// Professional SolidWorks Models Data
const proModels = [
    // Models will be added here when uploaded with difficulty="pro"
    // Example structure:
    /*
    {
        id: 1,
        folder: "Pro (Practice) Models/Model 01 Automotive Body Panel",
        title: "Car Body Panel Design",
        subtitle: "Advanced surfacing project with complex curves",
        description: "Professional automotive body panel...",
        difficulty: "pro",
        category: "parts",
        features: ["Surfacing", "Loft", "Boundary Surface", "Curvature Analysis"],
        files: {
            cad: ["body-panel.sldprt"],
            images: ["preview.png", "curvature.png"],
            documentation: ["README.md", "analysis-report.pdf"]
        },
        dateAdded: "2026-01-23",
        views: 0,
        downloads: 0
    }
    */
];

// Export for use in HTML
if (typeof module !== 'undefined' && module.exports) {
    module.exports = proModels;
}
