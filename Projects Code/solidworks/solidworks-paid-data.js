// Commercial/Paid SolidWorks Projects Data
const paidProjects = [
    // Projects will be added here when uploaded with difficulty="paid"
    // Example structure:
    /*
    {
        id: 1,
        folder: "Paid (Selled) Models/Model 01 Industrial Robotic Arm",
        title: "6-Axis Robotic Arm",
        subtitle: "Client project for automation company",
        description: "Full commercial project with engineering analysis...",
        difficulty: "paid",
        category: "assemblies",
        client: "ABC Robotics Inc.",
        features: ["Complete Assembly", "Simulation", "Drawings", "BOM"],
        deliverables: ["CAD Files", "2D Drawings", "Analysis Reports", "Documentation"],
        files: {
            cad: ["robot-arm.sldasm"],
            images: ["preview.png", "render.png"],
            documentation: ["README.md", "engineering-docs.pdf"]
        },
        dateAdded: "2026-01-23",
        views: 0,
        downloads: 0,
        commercial: true
    }
    */
];

// Export for use in HTML
if (typeof module !== 'undefined' && module.exports) {
    module.exports = paidProjects;
}
