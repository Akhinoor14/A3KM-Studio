/**
 * ============================================================================
 * SOLIDWORKS MODELS DATA
 * Created: December 26, 2025
 * Description: Complete metadata for all SOLIDWORKS 3D CAD models
 * Structure: Basic (35), Intermediate, Professional, Commercial categories
 * ============================================================================
 */

// Base path for all SOLIDWORKS project files
const SOLIDWORKS_BASE_PATH = "../../Projects Storage/Solidwork Projects/";

// Helper function to fix paths with correct base path
const fixModelPaths = (model) => {
    if (model.glbPath && !model.glbPath.startsWith('../../')) {
        model.glbPath = model.glbPath.replace('Solidwork Projects/', SOLIDWORKS_BASE_PATH);
    }
    if (model.thumbnailPath && !model.thumbnailPath.startsWith('../../')) {
        model.thumbnailPath = model.thumbnailPath.replace('Solidwork Projects/', SOLIDWORKS_BASE_PATH);
    }
    if (model.zipPath && !model.zipPath.startsWith('../../')) {
        model.zipPath = model.zipPath.replace('Solidwork Projects/', SOLIDWORKS_BASE_PATH);
    }
    return model;
};

const solidworksModelsData = {
    basic: [
        {
            id: "model-01",
            name: "Model 01 - Basic Part",
            category: "Basic (Practice) Models",
            difficulty: "⭐ Beginner",
            description: "Simple rectangular part with basic features",
            files: ["cw2.SLDPRT", "README.md"],
            glbPath: "Solidwork Projects/Basic (Practice) Models/Model 01/model-01.glb",
            thumbnailPath: "Solidwork Projects/Basic (Practice) Models/Model 01/thumbnail.png",
            zipPath: "Solidwork Projects/Basic (Practice) Models/Model 01.zip",
            day: "Practice",
            tags: ["Part", "Basic", "Practice"]
        },
        {
            id: "model-02",
            name: "Model 02 - Workpiece",
            category: "Basic (Practice) Models",
            difficulty: "⭐ Beginner",
            description: "Foundational modeling techniques",
            files: ["cWW1.SLDPRT", "README.md"],
            glbPath: "Solidwork Projects/Basic (Practice) Models/Model 02/model-02.glb",
            thumbnailPath: "Solidwork Projects/Basic (Practice) Models/Model 02/thumbnail.png",
            zipPath: "Solidwork Projects/Basic (Practice) Models/Model 02.zip",
            day: "Practice",
            tags: ["Part", "Basic", "Practice"]
        },
        {
            id: "model-03",
            name: "Model 03 - Curved Piece",
            category: "Basic (Practice) Models",
            difficulty: "⭐ Beginner",
            description: "Part with curved surfaces and rounded edges",
            files: ["cw 3 DAY 02, 01.SLDPRT", "README.md"],
            glbPath: "Solidwork Projects/Basic (Practice) Models/Model 03/model-03.glb",
            thumbnailPath: "Solidwork Projects/Basic (Practice) Models/Model 03/thumbnail.png",
            zipPath: "Solidwork Projects/Basic (Practice) Models/Model 03.zip",
            day: "Practice",
            tags: ["Part", "Curved", "Rounded"]
        },
        {
            id: "model-04",
            name: "Model 04 - Notched Block",
            category: "Basic (Practice) Models",
            difficulty: "⭐ Beginner",
            description: "Block with notches and cut features",
            files: ["cw 01, day 03.SLDPRT", "README.md"],
            glbPath: "Solidwork Projects/Basic (Practice) Models/Model 04/model-04.glb",
            thumbnailPath: "Solidwork Projects/Basic (Practice) Models/Model 04/thumbnail.png",
            zipPath: "Solidwork Projects/Basic (Practice) Models/Model 04.zip",
            day: "Practice",
            tags: ["Part", "Block", "Notched"]
        },
        {
            id: "model-05",
            name: "Model 05 - Simple Component",
            category: "Basic (Practice) Models",
            difficulty: "⭐ Beginner",
            description: "Basic component design practice",
            files: ["cw 01.SLDPRT", "README.md"],
            glbPath: "Solidwork Projects/Basic (Practice) Models/Model 05/model-05.glb",
            thumbnailPath: "Solidwork Projects/Basic (Practice) Models/Model 05/thumbnail.png",
            zipPath: "Solidwork Projects/Basic (Practice) Models/Model 05.zip",
            day: "Practice",
            tags: ["Part", "Basic", "Component"]
        },
        {
            id: "model-06",
            name: "Model 06 - Ribbed Plate",
            category: "Basic (Practice) Models",
            difficulty: "⭐ Beginner",
            description: "Plate with reinforcement ribs",
            files: ["cw  DAY 02, 02.SLDPRT", "README.md"],
            glbPath: "Solidwork Projects/Basic (Practice) Models/Model 06/model-06.glb",
            thumbnailPath: "Solidwork Projects/Basic (Practice) Models/Model 06/thumbnail.png",
            zipPath: "Solidwork Projects/Basic (Practice) Models/Model 06.zip",
            day: "Practice",
            tags: ["Part", "Plate", "Ribbed"]
        },
        {
            id: "model-07",
            name: "Model 07 - Angled Bracket",
            category: "Basic (Practice) Models",
            difficulty: "⭐ Beginner",
            description: "Bracket with multiple angle features",
            files: ["cw 02, day 03.SLDPRT", "README.md"],
            glbPath: "Solidwork Projects/Basic (Practice) Models/Model 07/model-07.glb",
            thumbnailPath: "Solidwork Projects/Basic (Practice) Models/Model 07/thumbnail.png",
            zipPath: "Solidwork Projects/Basic (Practice) Models/Model 07.zip",
            day: "Practice",
            tags: ["Part", "Bracket", "Angled"]
        },
        {
            id: "model-08",
            name: "Model 08 - Basket Assembly",
            category: "Basic (Practice) Models",
            difficulty: "⭐⭐ Intermediate",
            description: "Complex assembly with multiple components and mold design (Download ZIP for all parts)",
            files: ["Model-08-Assembly.zip"],
            glbPath: "Solidwork Projects/Basic (Practice) Models/Model 08/model-08.glb",
            thumbnailPath: "Solidwork Projects/Basic (Practice) Models/Model 08/thumbnail.png",
            zipPath: "Solidwork Projects/Basic (Practice) Models/Model 08/Model-08-Assembly.zip",
            day: "Advanced",
            tags: ["Assembly", "Mold", "Complex", "ZIP Download"]
        },
        {
            id: "model-09",
            name: "Model 09 - Component Design",
            category: "Basic (Practice) Models",
            difficulty: "⭐ Beginner",
            description: "Basic component modeling exercise",
            files: ["cw 02.SLDPRT", "README.md"],
            glbPath: "Solidwork Projects/Basic (Practice) Models/Model 09/model-09.glb",
            thumbnailPath: "Solidwork Projects/Basic (Practice) Models/Model 09/thumbnail.png",
            zipPath: "Solidwork Projects/Basic (Practice) Models/Model 09.zip",
            day: "Practice",
            tags: ["Part", "Basic", "Component"]
        },
        {
            id: "model-10",
            name: "Model 10 - Pin Assembly",
            category: "Basic (Practice) Models",
            difficulty: "⭐⭐ Intermediate",
            description: "Assembly with split pin mechanism (Download ZIP for all parts)",
            files: ["Model-10-Assembly.zip"],
            glbPath: "Solidwork Projects/Basic (Practice) Models/Model 10/model-10.glb",
            thumbnailPath: "Solidwork Projects/Basic (Practice) Models/Model 10/thumbnail.png",
            zipPath: "Solidwork Projects/Basic (Practice) Models/Model 10/Model-10-Assembly.zip",
            day: "Practice",
            tags: ["Assembly", "Pin", "Mechanism", "ZIP Download"]
        },
        {
            id: "model-11",
            name: "Model 11 - Slider Mechanism",
            category: "Basic (Practice) Models",
            difficulty: "⭐⭐⭐ Advanced",
            description: "Complex assembly with wheels, sliders, and connectors (Download ZIP for all parts)",
            files: ["Model-11-Assembly.zip"],
            glbPath: "Solidwork Projects/Basic (Practice) Models/Model 11/model-11.glb",
            thumbnailPath: "Solidwork Projects/Basic (Practice) Models/Model 11/thumbnail.png",
            zipPath: "Solidwork Projects/Basic (Practice) Models/Model 11/Model-11-Assembly.zip",
            day: "Practice",
            tags: ["Assembly", "Mechanism", "Slider", "Wheels", "ZIP Download"]
        },
        {
            id: "model-12",
            name: "Model 12 - Fork Assembly",
            category: "Basic (Practice) Models",
            difficulty: "⭐⭐ Intermediate",
            description: "Fork mechanism with pins and collar (Download ZIP for all parts)",
            files: ["Model-12-Assembly.zip"],
            glbPath: "Solidwork Projects/Basic (Practice) Models/Model 12/model-12.glb",
            thumbnailPath: "Solidwork Projects/Basic (Practice) Models/Model 12/thumbnail.png",
            zipPath: "Solidwork Projects/Basic (Practice) Models/Model 12/Model-12-Assembly.zip",
            day: "Practice",
            tags: ["Assembly", "Fork", "Pin", "ZIP Download"]
        },
        {
            id: "model-13",
            name: "Model 13 - Stepped Block",
            category: "Basic (Practice) Models",
            difficulty: "⭐ Beginner",
            description: "Multi-level stepped block with varying heights",
            files: ["cw 2.SLDPRT", "README.md"],
            glbPath: "Solidwork Projects/Basic (Practice) Models/Model 13/model-13.glb",
            thumbnailPath: "Solidwork Projects/Basic (Practice) Models/Model 13/thumbnail.png",
            zipPath: "Solidwork Projects/Basic (Practice) Models/Model 13.zip",
            day: "Practice",
            tags: ["Part", "Stepped", "Block"]
        },
        {
            id: "model-14",
            name: "Model 14 - Mechanical Joint Assembly",
            category: "Basic (Practice) Models",
            difficulty: "⭐⭐ Intermediate",
            description: "5-part mechanical joint assembly with connecting components (Download ZIP for all parts)",
            files: ["Model-14-Assembly.zip"],
            glbPath: "Solidwork Projects/Basic (Practice) Models/Model 14/model-14.glb",
            thumbnailPath: "Solidwork Projects/Basic (Practice) Models/Model 14/thumbnail.png",
            zipPath: "Solidwork Projects/Basic (Practice) Models/Model 14/Model-14-Assembly.zip",
            day: "Practice",
            tags: ["Assembly", "Joint", "5 Parts", "ZIP Download"]
        },
        {
            id: "model-15",
            name: "Model 15 - Angular Support",
            category: "Basic (Practice) Models",
            difficulty: "⭐ Beginner",
            description: "Angled support piece with angular features",
            files: ["day 5 cw 1.SLDPRT", "README.md"],
            glbPath: "Solidwork Projects/Basic (Practice) Models/Model 15/model-15.glb",
            thumbnailPath: "Solidwork Projects/Basic (Practice) Models/Model 15/thumbnail.png",
            zipPath: "Solidwork Projects/Basic (Practice) Models/Model 15.zip",
            day: "Practice",
            tags: ["Part", "Support", "Angular"]
        },
        {
            id: "model-16",
            name: "Model 16 - Corner Block",
            category: "Basic (Practice) Models",
            difficulty: "⭐ Beginner",
            description: "L-shaped corner block with cut features",
            files: ["day 7 hw 1.SLDPRT"],
            glbPath: "Solidwork Projects/Basic (Practice) Models/Model 16/model-16.glb",
            thumbnailPath: "Solidwork Projects/Basic (Practice) Models/Model 16/thumbnail.png",
            zipPath: "Solidwork Projects/Basic (Practice) Models/Model 16.zip",
            day: "Practice",
            tags: ["Part", "Block", "Corner"]
        },
        {
            id: "model-17",
            name: "Model 17 - Slotted Plate",
            category: "Basic (Practice) Models",
            difficulty: "⭐ Beginner",
            description: "Flat plate with slots and cutouts",
            files: ["CW091accordingtolecture.SLDPRT"],
            glbPath: "Solidwork Projects/Basic (Practice) Models/Model 17/model-17.glb",
            thumbnailPath: "Solidwork Projects/Basic (Practice) Models/Model 17/thumbnail.png",
            zipPath: "Solidwork Projects/Basic (Practice) Models/Model 17.zip",
            day: "Practice",
            tags: ["Part", "Plate", "Slotted"]
        },
        {
            id: "model-18",
            name: "Model 18 - U-Channel",
            category: "Basic (Practice) Models",
            difficulty: "⭐ Beginner",
            description: "U-shaped channel section",
            files: ["day 8 hw 1.SLDPRT"],
            glbPath: "Solidwork Projects/Basic (Practice) Models/Model 18/model-18.glb",
            thumbnailPath: "Solidwork Projects/Basic (Practice) Models/Model 18/thumbnail.png",
            zipPath: "Solidwork Projects/Basic (Practice) Models/Model 18.zip",
            day: "Practice",
            tags: ["Part", "Channel", "U-Shape"]
        },
        {
            id: "model-19",
            name: "Model 19 - T-Block",
            category: "Basic (Practice) Models",
            difficulty: "⭐ Beginner",
            description: "T-shaped block with perpendicular sections",
            files: ["cw 2.SLDPRT"],
            glbPath: "Solidwork Projects/Basic (Practice) Models/Model 19/model-19.glb",
            thumbnailPath: "Solidwork Projects/Basic (Practice) Models/Model 19/thumbnail.png",
            zipPath: "Solidwork Projects/Basic (Practice) Models/Model 19.zip",
            day: "Practice",
            tags: ["Part", "Block", "T-Shape"]
        },
        {
            id: "model-20",
            name: "Model 20 - Bracket Design",
            category: "Basic (Practice) Models",
            difficulty: "⭐ Beginner",
            description: "Simple bracket practice with basic features",
            files: ["model-20.SLDPRT"],
            glbPath: "Solidwork Projects/Basic (Practice) Models/Model 20/model-20.glb",
            thumbnailPath: "Solidwork Projects/Basic (Practice) Models/Model 20/thumbnail.png",
            zipPath: "Solidwork Projects/Basic (Practice) Models/Model 20.zip",
            day: "Practice",
            tags: ["Part", "Bracket"]
        },
        {
            id: "model-21",
            name: "Model 21 - Support Piece",
            category: "Basic (Practice) Models",
            difficulty: "⭐ Beginner",
            description: "Support piece with mounting features",
            files: ["model-21.SLDPRT"],
            glbPath: "Solidwork Projects/Basic (Practice) Models/Model 21/model-21.glb",
            thumbnailPath: "Solidwork Projects/Basic (Practice) Models/Model 21/thumbnail.png",
            zipPath: "Solidwork Projects/Basic (Practice) Models/Model 21.zip",
            day: "Practice",
            tags: ["Part", "Support"]
        },
        {
            id: "model-22",
            name: "Model 22 - Bolt and Nut Assembly",
            category: "Basic (Practice) Models",
            difficulty: "⭐⭐ Intermediate",
            description: "Assembly project with threaded components",
            files: ["Assem1.SLDASM", "bolt.SLDPRT", "nut.SLDPRT"],
            glbPath: "Solidwork Projects/Basic (Practice) Models/Model 22/model-22.glb",
            thumbnailPath: "Solidwork Projects/Basic (Practice) Models/Model 22/thumbnail.png",
            zipPath: "Solidwork Projects/Basic (Practice) Models/Model 22.zip",
            day: "Practice",
            tags: ["Assembly", "Bolt", "Nut", "3 Parts"]
        },
        {
            id: "model-23",
            name: "Model 23 - Connector Part",
            category: "Basic (Practice) Models",
            difficulty: "⭐ Beginner",
            description: "Connector component practice",
            files: ["model-23.SLDPRT"],
            glbPath: "Solidwork Projects/Basic (Practice) Models/Model 23/model-23.glb",
            thumbnailPath: "Solidwork Projects/Basic (Practice) Models/Model 23/thumbnail.png",
            zipPath: "Solidwork Projects/Basic (Practice) Models/Model 23.zip",
            day: "Practice",
            tags: ["Part", "Connector"]
        },
        {
            id: "model-24",
            name: "Model 24 - Cover Plate",
            category: "Basic (Practice) Models",
            difficulty: "⭐ Beginner",
            description: "Cover plate with hole patterns",
            files: ["model-24.SLDPRT"],
            glbPath: "Solidwork Projects/Basic (Practice) Models/Model 24/model-24.glb",
            thumbnailPath: "Solidwork Projects/Basic (Practice) Models/Model 24/thumbnail.png",
            zipPath: "Solidwork Projects/Basic (Practice) Models/Model 24.zip",
            day: "Practice",
            tags: ["Part", "Plate"]
        },
        {
            id: "model-25",
            name: "Model 25 - Shaft Component",
            category: "Basic (Practice) Models",
            difficulty: "⭐ Beginner",
            description: "Cylindrical shaft with features",
            files: ["model-25.SLDPRT"],
            glbPath: "Solidwork Projects/Basic (Practice) Models/Model 25/model-25.glb",
            thumbnailPath: "Solidwork Projects/Basic (Practice) Models/Model 25/thumbnail.png",
            zipPath: "Solidwork Projects/Basic (Practice) Models/Model 25.zip",
            day: "Practice",
            tags: ["Part", "Shaft"]
        },
        {
            id: "model-26",
            name: "Model 26 - Base Platform",
            category: "Basic (Practice) Models",
            difficulty: "⭐ Beginner",
            description: "Flat base with mounting points",
            files: ["model-26.SLDPRT"],
            glbPath: "Solidwork Projects/Basic (Practice) Models/Model 26/model-26.glb",
            thumbnailPath: "Solidwork Projects/Basic (Practice) Models/Model 26/thumbnail.png",
            zipPath: "Solidwork Projects/Basic (Practice) Models/Model 26.zip",
            day: "Practice",
            tags: ["Part", "Base"]
        },
        {
            id: "model-27",
            name: "Model 27 - Mounting Bracket",
            category: "Basic (Practice) Models",
            difficulty: "⭐ Beginner",
            description: "L-shaped mounting bracket design",
            files: ["model-27.SLDPRT"],
            glbPath: "Solidwork Projects/Basic (Practice) Models/Model 27/model-27.glb",
            thumbnailPath: "Solidwork Projects/Basic (Practice) Models/Model 27/thumbnail.png",
            zipPath: "Solidwork Projects/Basic (Practice) Models/Model 27.zip",
            day: "Practice",
            tags: ["Part", "Bracket"]
        },
        {
            id: "model-28",
            name: "Model 28 - Housing Part",
            category: "Basic (Practice) Models",
            difficulty: "⭐ Beginner",
            description: "Housing component with internal features",
            files: ["model-28.SLDPRT"],
            glbPath: "Solidwork Projects/Basic (Practice) Models/Model 28/model-28.glb",
            thumbnailPath: "Solidwork Projects/Basic (Practice) Models/Model 28/thumbnail.png",
            zipPath: "Solidwork Projects/Basic (Practice) Models/Model 28.zip",
            day: "Practice",
            tags: ["Part", "Housing"]
        },
        {
            id: "model-29",
            name: "Model 29 - Flange Design",
            category: "Basic (Practice) Models",
            difficulty: "⭐ Beginner",
            description: "Circular flange with bolt holes",
            files: ["model-29.SLDPRT"],
            glbPath: "Solidwork Projects/Basic (Practice) Models/Model 29/model-29.glb",
            thumbnailPath: "Solidwork Projects/Basic (Practice) Models/Model 29/thumbnail.png",
            zipPath: "Solidwork Projects/Basic (Practice) Models/Model 29.zip",
            day: "Practice",
            tags: ["Part", "Flange"]
        },
        {
            id: "model-30",
            name: "Model 30 - Guide Block",
            category: "Basic (Practice) Models",
            difficulty: "⭐ Beginner",
            description: "Block with guide channels",
            files: ["model-30.SLDPRT"],
            glbPath: "Solidwork Projects/Basic (Practice) Models/Model 30/model-30.glb",
            thumbnailPath: "Solidwork Projects/Basic (Practice) Models/Model 30/thumbnail.png",
            zipPath: "Solidwork Projects/Basic (Practice) Models/Model 30.zip",
            day: "Practice",
            tags: ["Part", "Block"]
        },
        {
            id: "model-31",
            name: "Model 31 - Spacer Ring",
            category: "Basic (Practice) Models",
            difficulty: "⭐ Beginner",
            description: "Circular spacer with precise dimensions",
            files: ["model-31.SLDPRT"],
            glbPath: "Solidwork Projects/Basic (Practice) Models/Model 31/model-31.glb",
            thumbnailPath: "Solidwork Projects/Basic (Practice) Models/Model 31/thumbnail.png",
            zipPath: "Solidwork Projects/Basic (Practice) Models/Model 31.zip",
            day: "Practice",
            tags: ["Part", "Spacer"]
        },
        {
            id: "model-32",
            name: "Model 32 - Clamp Piece",
            category: "Basic (Practice) Models",
            difficulty: "⭐ Beginner",
            description: "Clamping component design",
            files: ["model-32.SLDPRT"],
            glbPath: "Solidwork Projects/Basic (Practice) Models/Model 32/model-32.glb",
            thumbnailPath: "Solidwork Projects/Basic (Practice) Models/Model 32/thumbnail.png",
            zipPath: "Solidwork Projects/Basic (Practice) Models/Model 32.zip",
            day: "Practice",
            tags: ["Part", "Clamp"]
        },
        {
            id: "model-33",
            name: "Model 33 - Adapter Plate",
            category: "Basic (Practice) Models",
            difficulty: "⭐ Beginner",
            description: "Adapter plate with multiple interfaces",
            files: ["model-33.SLDPRT"],
            glbPath: "Solidwork Projects/Basic (Practice) Models/Model 33/model-33.glb",
            thumbnailPath: "Solidwork Projects/Basic (Practice) Models/Model 33/thumbnail.png",
            zipPath: "Solidwork Projects/Basic (Practice) Models/Model 33.zip",
            day: "Practice",
            tags: ["Part", "Adapter"]
        },
        {
            id: "model-34",
            name: "Model 34 - Pivot Joint",
            category: "Basic (Practice) Models",
            difficulty: "⭐ Beginner",
            description: "Pivot joint component with pin hole",
            files: ["model-34.SLDPRT"],
            glbPath: "Solidwork Projects/Basic (Practice) Models/Model 34/model-34.glb",
            thumbnailPath: "Solidwork Projects/Basic (Practice) Models/Model 34/thumbnail.png",
            zipPath: "Solidwork Projects/Basic (Practice) Models/Model 34.zip",
            day: "Practice",
            tags: ["Part", "Joint"]
        },
        {
            id: "model-35",
            name: "Model 35 - End Cap",
            category: "Basic (Practice) Models",
            difficulty: "⭐ Beginner",
            description: "End cap for tube or pipe",
            files: [],
            glbPath: "Solidwork Projects/Basic (Practice) Models/Model 35/model-35.glb",
            thumbnailPath: "Solidwork Projects/Basic (Practice) Models/Model 35/thumbnail.png",
            zipPath: "Solidwork Projects/Basic (Practice) Models/Model 35.zip",
            day: "Practice",
            tags: ["Part", "Cap"]
        }
    ],
    intermediate: [
        {
            id: "int-coming-soon",
            name: "Intermediate Models - Coming Soon",
            category: "Intermediate (Practice) Models",
            difficulty: "⭐⭐ Intermediate",
            description: "Complex assemblies and mechanisms coming soon",
            files: ["README.md"],
            glbPath: null,
            thumbnailPath: "images/coming-soon.png",
            zipPath: null,
            day: "TBD",
            tags: ["Coming Soon", "Intermediate"]
        }
    ],
    professional: [
        {
            id: "pro-coming-soon",
            name: "Professional Models - Coming Soon",
            category: "Pro (Practice) Models",
            difficulty: "⭐⭐⭐ Professional",
            description: "Industry-grade professional models coming soon",
            files: ["README.md"],
            glbPath: null,
            thumbnailPath: "images/coming-soon.png",
            zipPath: null,
            day: "TBD",
            tags: ["Coming Soon", "Professional"]
        }
    ],
    commercial: [
        {
            id: "paid-coming-soon",
            name: "Commercial Models - Coming Soon",
            category: "Paid (Selled) Models",
            difficulty: "💼 Commercial",
            description: "Client work and commercial projects portfolio",
            files: ["README.md"],
            glbPath: null,
            thumbnailPath: "images/coming-soon.png",
            zipPath: null,
            day: "TBD",
            tags: ["Coming Soon", "Commercial"]
        }
    ]
};

// Helper functions
const getAllModels = () => {
    return [
        ...solidworksModelsData.basic.map(fixModelPaths),
        ...solidworksModelsData.intermediate.map(fixModelPaths),
        ...solidworksModelsData.professional.map(fixModelPaths),
        ...solidworksModelsData.commercial.map(fixModelPaths)
    ];
};

const getModelById = (id) => {
    const model = getAllModels().find(model => model.id === id);
    return model ? fixModelPaths(model) : null;
};

const getModelsByCategory = (category) => {
    let models;
    switch(category.toLowerCase()) {
        case 'basic':
            models = solidworksModelsData.basic;
            break;
        case 'intermediate':
            models = solidworksModelsData.intermediate;
            break;
        case 'professional':
        case 'pro':
            models = solidworksModelsData.professional;
            break;
        case 'commercial':
        case 'paid':
            models = solidworksModelsData.commercial;
            break;
        default:
            return getAllModels();
    }
    return models.map(fixModelPaths);
};

const getNextModel = (currentId) => {
    const allModels = getAllModels();
    const currentIndex = allModels.findIndex(model => model.id === currentId);
    if (currentIndex === -1 || currentIndex === allModels.length - 1) {
        return null;
    }
    return allModels[currentIndex + 1];
};

const getPreviousModel = (currentId) => {
    const allModels = getAllModels();
    const currentIndex = allModels.findIndex(model => model.id === currentId);
    if (currentIndex <= 0) {
        return null;
    }
    return allModels[currentIndex - 1];
};

// Statistics (cached for performance)
let cachedStats = null;
const getStatistics = () => {
    if (cachedStats) return cachedStats;
    
    const allModels = getAllModels();
    cachedStats = {
        total: allModels.length,
        basic: solidworksModelsData.basic.length,
        intermediate: solidworksModelsData.intermediate.length,
        professional: solidworksModelsData.professional.length,
        commercial: solidworksModelsData.commercial.length,
        assemblies: allModels.filter(m => m.files.some(f => f.includes('.SLDASM') || f.includes('.zip'))).length,
        parts: allModels.filter(m => m.files.some(f => f.includes('.SLDPRT'))).length
    };
    return cachedStats;
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        solidworksModelsData,
        getAllModels,
        getModelById,
        getModelsByCategory,
        getNextModel,
        getPreviousModel,
        getStatistics
    };
}
