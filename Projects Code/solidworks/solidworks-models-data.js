/**
 * ============================================================================
 * SOLIDWORKS MODELS DATA
 * Created: December 26, 2025
 * Description: Complete metadata for all SOLIDWORKS 3D CAD models
 * Structure: Basic (35), Intermediate, Professional, Commercial categories
 * ============================================================================
 */

const solidworksModelsData = {
    basic: [
        {
            id: "model-01",
            name: "Model 01 - Basic Part",
            category: "Basic (Practice) Models",
            difficulty: "⭐ Beginner",
            description: "Simple 3D part design - Day 2 practice",
            files: ["cw2.SLDPRT", "README.md"],
            glbPath: "Solidwork Projects/Basic (Practice) Models/Model 01/model-01.glb",
            thumbnailPath: "Solidwork Projects/Basic (Practice) Models/Model 01/thumbnail.png",
            zipPath: "Solidwork Projects/Basic (Practice) Models/Model 01.zip",
            day: "Day 2",
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
            day: "Day 2",
            tags: ["Part", "Basic", "Practice"]
        },
        {
            id: "model-03",
            name: "Model 03 - Day 2 Practice",
            category: "Basic (Practice) Models",
            difficulty: "⭐ Beginner",
            description: "Day 2 classwork part design",
            files: ["cw 3 DAY 02, 01.SLDPRT", "README.md"],
            glbPath: "Solidwork Projects/Basic (Practice) Models/Model 03/model-03.glb",
            thumbnailPath: "Solidwork Projects/Basic (Practice) Models/Model 03/thumbnail.png",
            zipPath: "Solidwork Projects/Basic (Practice) Models/Model 03.zip",
            day: "Day 2",
            tags: ["Part", "Basic", "Classwork"]
        },
        {
            id: "model-04",
            name: "Model 04 - Day 3 Exercise",
            category: "Basic (Practice) Models",
            difficulty: "⭐ Beginner",
            description: "Day 3 basic part modeling",
            files: ["cw 01, day 03.SLDPRT", "README.md"],
            glbPath: "Solidwork Projects/Basic (Practice) Models/Model 04/model-04.glb",
            thumbnailPath: "Solidwork Projects/Basic (Practice) Models/Model 04/thumbnail.png",
            zipPath: "Solidwork Projects/Basic (Practice) Models/Model 04.zip",
            day: "Day 3",
            tags: ["Part", "Basic", "Exercise"]
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
            name: "Model 06 - Day 2 Part 2",
            category: "Basic (Practice) Models",
            difficulty: "⭐ Beginner",
            description: "Day 2 second exercise",
            files: ["cw  DAY 02, 02.SLDPRT", "README.md"],
            glbPath: "Solidwork Projects/Basic (Practice) Models/Model 06/model-06.glb",
            thumbnailPath: "Solidwork Projects/Basic (Practice) Models/Model 06/thumbnail.png",
            zipPath: "Solidwork Projects/Basic (Practice) Models/Model 06.zip",
            day: "Day 2",
            tags: ["Part", "Basic", "Exercise"]
        },
        {
            id: "model-07",
            name: "Model 07 - Day 3 Part 2",
            category: "Basic (Practice) Models",
            difficulty: "⭐ Beginner",
            description: "Day 3 advanced practice",
            files: ["cw 02, day 03.SLDPRT", "README.md"],
            glbPath: "Solidwork Projects/Basic (Practice) Models/Model 07/model-07.glb",
            thumbnailPath: "Solidwork Projects/Basic (Practice) Models/Model 07/thumbnail.png",
            zipPath: "Solidwork Projects/Basic (Practice) Models/Model 07.zip",
            day: "Day 3",
            tags: ["Part", "Basic", "Practice"]
        },
        {
            id: "model-08",
            name: "Model 08 - Basket Assembly",
            category: "Basic (Practice) Models",
            difficulty: "⭐⭐ Intermediate",
            description: "Complex assembly with multiple components and mold design",
            files: [
                "assembly.SLDASM",
                "basket.SLDPRT",
                "Core11[2].SLDPRT",
                "Core16[1].SLDPRT",
                "Core16[2].SLDPRT",
                "Parting Line1.SLDPRT",
                "Save Bodies1[1].SLDPRT",
                "Save Bodies1[2].SLDPRT",
                "Save Bodies1[3].SLDPRT",
                "Save Bodies1[4].SLDPRT",
                "Save Bodies1[5].SLDPRT",
                "Tooling Split1[2].SLDPRT"
            ],
            glbPath: "Solidwork Projects/Basic (Practice) Models/Model 08/model-08.glb",
            thumbnailPath: "Solidwork Projects/Basic (Practice) Models/Model 08/thumbnail.png",
            zipPath: "Solidwork Projects/Basic (Practice) Models/Model 08.zip",
            day: "Advanced",
            tags: ["Assembly", "Mold", "Complex", "12 Parts"]
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
            description: "Day 6 assembly with pin mechanism",
            files: [
                "cw 01 day 6 part 2 pin.SLDPRT",
                "cw 01 day 6.SLDPRT",
                "day 6 assembly.SLDASM",
                "README.md"
            ],
            glbPath: "Solidwork Projects/Basic (Practice) Models/Model 10/model-10.glb",
            thumbnailPath: "Solidwork Projects/Basic (Practice) Models/Model 10/thumbnail.png",
            zipPath: "Solidwork Projects/Basic (Practice) Models/Model 10.zip",
            day: "Day 6",
            tags: ["Assembly", "Pin", "Mechanism", "3 Parts"]
        },
        {
            id: "model-11",
            name: "Model 11 - Slider Mechanism",
            category: "Basic (Practice) Models",
            difficulty: "⭐⭐⭐ Advanced",
            description: "Complex Day 7 assembly with wheels, sliders, and connectors",
            files: [
                "Assem1 day 7.SLDASM",
                "part 1 base day 7.SLDPRT",
                "part 2 pin  day 7.SLDPRT",
                "part 3 wheel   day 7.SLDPRT",
                "part 4 connectr   day 7.SLDPRT",
                "Part 5 slider day 7.SLDPRT",
                "Part 6 pin short  day 7.SLDPRT",
                "Part 7 two side connector  day 7.SLDPRT",
                "Part 8 wheel base connector.SLDPRT",
                "Part 9 tap collar day 7.SLDPRT",
                "README.md"
            ],
            glbPath: "Solidwork Projects/Basic (Practice) Models/Model 11/model-11.glb",
            thumbnailPath: "Solidwork Projects/Basic (Practice) Models/Model 11/thumbnail.png",
            zipPath: "Solidwork Projects/Basic (Practice) Models/Model 11.zip",
            day: "Day 7",
            tags: ["Assembly", "Mechanism", "Slider", "Wheels", "9 Parts"]
        },
        {
            id: "model-12",
            name: "Model 12 - Fork Assembly",
            category: "Basic (Practice) Models",
            difficulty: "⭐⭐ Intermediate",
            description: "Day 6 classwork 2 - Fork mechanism with pins and collar",
            files: [
                "cw 02 day 6 part 1 fork.SLDPRT",
                "cw 02 day 6 part 2 pin.SLDPRT",
                "cw 02 day 6 part 3 collar.SLDPRT",
                "cw 02 day 6 part 4 tapper pin.SLDPRT",
                "cw 02 day 6 part 5 centre block.SLDPRT",
                "day 6 cw 2  assembly.SLDASM",
                "Part2.SLDPRT",
                "README.md"
            ],
            glbPath: "Solidwork Projects/Basic (Practice) Models/Model 12/model-12.glb",
            thumbnailPath: "Solidwork Projects/Basic (Practice) Models/Model 12/thumbnail.png",
            zipPath: "Solidwork Projects/Basic (Practice) Models/Model 12.zip",
            day: "Day 6",
            tags: ["Assembly", "Fork", "Pin", "6 Parts"]
        },
        {
            id: "model-13",
            name: "Model 13 - Practice Part",
            category: "Basic (Practice) Models",
            difficulty: "⭐ Beginner",
            description: "Basic part design exercise",
            files: ["cw 2.SLDPRT", "README.md"],
            glbPath: "Solidwork Projects/Basic (Practice) Models/Model 13/model-13.glb",
            thumbnailPath: "Solidwork Projects/Basic (Practice) Models/Model 13/thumbnail.png",
            zipPath: "Solidwork Projects/Basic (Practice) Models/Model 13.zip",
            day: "Practice",
            tags: ["Part", "Basic", "Exercise"]
        },
        {
            id: "model-14",
            name: "Model 14 - Day 6 Homework Assembly",
            category: "Basic (Practice) Models",
            difficulty: "⭐⭐ Intermediate",
            description: "Day 6 homework - 5 part assembly",
            files: [
                "day 6 hw Assem.SLDASM",
                "day 6 hw part 1.SLDPRT",
                "day 6 hw part 2.SLDPRT",
                "day 6 hw part 3.SLDPRT",
                "day 6 hw part 4.SLDPRT",
                "day 6 hw part 5.SLDPRT",
                "README.md"
            ],
            glbPath: "Solidwork Projects/Basic (Practice) Models/Model 14/model-14.glb",
            thumbnailPath: "Solidwork Projects/Basic (Practice) Models/Model 14/thumbnail.png",
            zipPath: "Solidwork Projects/Basic (Practice) Models/Model 14.zip",
            day: "Day 6",
            tags: ["Assembly", "Homework", "5 Parts"]
        },
        {
            id: "model-15",
            name: "Model 15 - Day 5 Exercise",
            category: "Basic (Practice) Models",
            difficulty: "⭐ Beginner",
            description: "Day 5 classwork part",
            files: ["day 5 cw 1.SLDPRT", "README.md"],
            glbPath: "Solidwork Projects/Basic (Practice) Models/Model 15/model-15.glb",
            thumbnailPath: "Solidwork Projects/Basic (Practice) Models/Model 15/thumbnail.png",
            zipPath: "Solidwork Projects/Basic (Practice) Models/Model 15.zip",
            day: "Day 5",
            tags: ["Part", "Basic", "Classwork"]
        },
        {
            id: "model-16",
            name: "Model 16 - Day 7 Homework",
            category: "Basic (Practice) Models",
            difficulty: "⭐ Beginner",
            description: "Day 7 homework assignment",
            files: ["day 7 hw 1.SLDPRT"],
            glbPath: "Solidwork Projects/Basic (Practice) Models/Model 16/model-16.glb",
            thumbnailPath: "Solidwork Projects/Basic (Practice) Models/Model 16/thumbnail.png",
            zipPath: "Solidwork Projects/Basic (Practice) Models/Model 16.zip",
            day: "Day 7",
            tags: ["Part", "Homework"]
        },
        {
            id: "model-17",
            name: "Model 17 - Lecture Practice",
            category: "Basic (Practice) Models",
            difficulty: "⭐ Beginner",
            description: "Classwork 09 according to lecture",
            files: ["CW091accordingtolecture.SLDPRT"],
            glbPath: "Solidwork Projects/Basic (Practice) Models/Model 17/model-17.glb",
            thumbnailPath: "Solidwork Projects/Basic (Practice) Models/Model 17/thumbnail.png",
            zipPath: "Solidwork Projects/Basic (Practice) Models/Model 17.zip",
            day: "Lecture",
            tags: ["Part", "Classwork", "Lecture"]
        },
        {
            id: "model-18",
            name: "Model 18 - Day 8 Homework",
            category: "Basic (Practice) Models",
            difficulty: "⭐ Beginner",
            description: "Day 8 homework practice",
            files: ["day 8 hw 1.SLDPRT"],
            glbPath: "Solidwork Projects/Basic (Practice) Models/Model 18/model-18.glb",
            thumbnailPath: "Solidwork Projects/Basic (Practice) Models/Model 18/thumbnail.png",
            zipPath: "Solidwork Projects/Basic (Practice) Models/Model 18.zip",
            day: "Day 8",
            tags: ["Part", "Homework"]
        },
        {
            id: "model-19",
            name: "Model 19 - Exercise Part",
            category: "Basic (Practice) Models",
            difficulty: "⭐ Beginner",
            description: "Basic exercise part design",
            files: ["cw 2.SLDPRT"],
            glbPath: "Solidwork Projects/Basic (Practice) Models/Model 19/model-19.glb",
            thumbnailPath: "Solidwork Projects/Basic (Practice) Models/Model 19/thumbnail.png",
            zipPath: "Solidwork Projects/Basic (Practice) Models/Model 19.zip",
            day: "Practice",
            tags: ["Part", "Exercise"]
        },
        {
            id: "model-20",
            name: "Model 20 - Practice Design",
            category: "Basic (Practice) Models",
            difficulty: "⭐ Beginner",
            description: "Additional practice model",
            files: [],
            glbPath: "Solidwork Projects/Basic (Practice) Models/Model 20/model-20.glb",
            thumbnailPath: "Solidwork Projects/Basic (Practice) Models/Model 20/thumbnail.png",
            zipPath: "Solidwork Projects/Basic (Practice) Models/Model 20.zip",
            day: "Practice",
            tags: ["Part", "Practice"]
        },
        {
            id: "model-21",
            name: "Model 21 - Practice Design",
            category: "Basic (Practice) Models",
            difficulty: "⭐ Beginner",
            description: "Additional practice model",
            files: [],
            glbPath: "Solidwork Projects/Basic (Practice) Models/Model 21/model-21.glb",
            thumbnailPath: "Solidwork Projects/Basic (Practice) Models/Model 21/thumbnail.png",
            zipPath: "Solidwork Projects/Basic (Practice) Models/Model 21.zip",
            day: "Practice",
            tags: ["Part", "Practice"]
        },
        {
            id: "model-22",
            name: "Model 22 - Practice Design",
            category: "Basic (Practice) Models",
            difficulty: "⭐ Beginner",
            description: "Additional practice model",
            files: [],
            glbPath: "Solidwork Projects/Basic (Practice) Models/Model 22/model-22.glb",
            thumbnailPath: "Solidwork Projects/Basic (Practice) Models/Model 22/thumbnail.png",
            zipPath: "Solidwork Projects/Basic (Practice) Models/Model 22.zip",
            day: "Practice",
            tags: ["Part", "Practice"]
        },
        {
            id: "model-23",
            name: "Model 23 - Practice Design",
            category: "Basic (Practice) Models",
            difficulty: "⭐ Beginner",
            description: "Additional practice model",
            files: [],
            glbPath: "Solidwork Projects/Basic (Practice) Models/Model 23/model-23.glb",
            thumbnailPath: "Solidwork Projects/Basic (Practice) Models/Model 23/thumbnail.png",
            zipPath: "Solidwork Projects/Basic (Practice) Models/Model 23.zip",
            day: "Practice",
            tags: ["Part", "Practice"]
        },
        {
            id: "model-24",
            name: "Model 24 - Practice Design",
            category: "Basic (Practice) Models",
            difficulty: "⭐ Beginner",
            description: "Additional practice model",
            files: [],
            glbPath: "Solidwork Projects/Basic (Practice) Models/Model 24/model-24.glb",
            thumbnailPath: "Solidwork Projects/Basic (Practice) Models/Model 24/thumbnail.png",
            zipPath: "Solidwork Projects/Basic (Practice) Models/Model 24.zip",
            day: "Practice",
            tags: ["Part", "Practice"]
        },
        {
            id: "model-25",
            name: "Model 25 - Practice Design",
            category: "Basic (Practice) Models",
            difficulty: "⭐ Beginner",
            description: "Additional practice model",
            files: [],
            glbPath: "Solidwork Projects/Basic (Practice) Models/Model 25/model-25.glb",
            thumbnailPath: "Solidwork Projects/Basic (Practice) Models/Model 25/thumbnail.png",
            zipPath: "Solidwork Projects/Basic (Practice) Models/Model 25.zip",
            day: "Practice",
            tags: ["Part", "Practice"]
        },
        {
            id: "model-26",
            name: "Model 26 - Practice Design",
            category: "Basic (Practice) Models",
            difficulty: "⭐ Beginner",
            description: "Additional practice model",
            files: [],
            glbPath: "Solidwork Projects/Basic (Practice) Models/Model 26/model-26.glb",
            thumbnailPath: "Solidwork Projects/Basic (Practice) Models/Model 26/thumbnail.png",
            zipPath: "Solidwork Projects/Basic (Practice) Models/Model 26.zip",
            day: "Practice",
            tags: ["Part", "Practice"]
        },
        {
            id: "model-27",
            name: "Model 27 - Practice Design",
            category: "Basic (Practice) Models",
            difficulty: "⭐ Beginner",
            description: "Additional practice model",
            files: [],
            glbPath: "Solidwork Projects/Basic (Practice) Models/Model 27/model-27.glb",
            thumbnailPath: "Solidwork Projects/Basic (Practice) Models/Model 27/thumbnail.png",
            zipPath: "Solidwork Projects/Basic (Practice) Models/Model 27.zip",
            day: "Practice",
            tags: ["Part", "Practice"]
        },
        {
            id: "model-28",
            name: "Model 28 - Practice Design",
            category: "Basic (Practice) Models",
            difficulty: "⭐ Beginner",
            description: "Additional practice model",
            files: [],
            glbPath: "Solidwork Projects/Basic (Practice) Models/Model 28/model-28.glb",
            thumbnailPath: "Solidwork Projects/Basic (Practice) Models/Model 28/thumbnail.png",
            zipPath: "Solidwork Projects/Basic (Practice) Models/Model 28.zip",
            day: "Practice",
            tags: ["Part", "Practice"]
        },
        {
            id: "model-29",
            name: "Model 29 - Practice Design",
            category: "Basic (Practice) Models",
            difficulty: "⭐ Beginner",
            description: "Additional practice model",
            files: [],
            glbPath: "Solidwork Projects/Basic (Practice) Models/Model 29/model-29.glb",
            thumbnailPath: "Solidwork Projects/Basic (Practice) Models/Model 29/thumbnail.png",
            zipPath: "Solidwork Projects/Basic (Practice) Models/Model 29.zip",
            day: "Practice",
            tags: ["Part", "Practice"]
        },
        {
            id: "model-30",
            name: "Model 30 - Practice Design",
            category: "Basic (Practice) Models",
            difficulty: "⭐ Beginner",
            description: "Additional practice model",
            files: [],
            glbPath: "Solidwork Projects/Basic (Practice) Models/Model 30/model-30.glb",
            thumbnailPath: "Solidwork Projects/Basic (Practice) Models/Model 30/thumbnail.png",
            zipPath: "Solidwork Projects/Basic (Practice) Models/Model 30.zip",
            day: "Practice",
            tags: ["Part", "Practice"]
        },
        {
            id: "model-31",
            name: "Model 31 - Practice Design",
            category: "Basic (Practice) Models",
            difficulty: "⭐ Beginner",
            description: "Additional practice model",
            files: [],
            glbPath: "Solidwork Projects/Basic (Practice) Models/Model 31/model-31.glb",
            thumbnailPath: "Solidwork Projects/Basic (Practice) Models/Model 31/thumbnail.png",
            zipPath: "Solidwork Projects/Basic (Practice) Models/Model 31.zip",
            day: "Practice",
            tags: ["Part", "Practice"]
        },
        {
            id: "model-32",
            name: "Model 32 - Practice Design",
            category: "Basic (Practice) Models",
            difficulty: "⭐ Beginner",
            description: "Additional practice model",
            files: [],
            glbPath: "Solidwork Projects/Basic (Practice) Models/Model 32/model-32.glb",
            thumbnailPath: "Solidwork Projects/Basic (Practice) Models/Model 32/thumbnail.png",
            zipPath: "Solidwork Projects/Basic (Practice) Models/Model 32.zip",
            day: "Practice",
            tags: ["Part", "Practice"]
        },
        {
            id: "model-33",
            name: "Model 33 - Practice Design",
            category: "Basic (Practice) Models",
            difficulty: "⭐ Beginner",
            description: "Additional practice model",
            files: [],
            glbPath: "Solidwork Projects/Basic (Practice) Models/Model 33/model-33.glb",
            thumbnailPath: "Solidwork Projects/Basic (Practice) Models/Model 33/thumbnail.png",
            zipPath: "Solidwork Projects/Basic (Practice) Models/Model 33.zip",
            day: "Practice",
            tags: ["Part", "Practice"]
        },
        {
            id: "model-34",
            name: "Model 34 - Practice Design",
            category: "Basic (Practice) Models",
            difficulty: "⭐ Beginner",
            description: "Additional practice model",
            files: [],
            glbPath: "Solidwork Projects/Basic (Practice) Models/Model 34/model-34.glb",
            thumbnailPath: "Solidwork Projects/Basic (Practice) Models/Model 34/thumbnail.png",
            zipPath: "Solidwork Projects/Basic (Practice) Models/Model 34.zip",
            day: "Practice",
            tags: ["Part", "Practice"]
        },
        {
            id: "model-35",
            name: "Model 35 - Practice Design",
            category: "Basic (Practice) Models",
            difficulty: "⭐ Beginner",
            description: "Additional practice model",
            files: [],
            glbPath: "Solidwork Projects/Basic (Practice) Models/Model 35/model-35.glb",
            thumbnailPath: "Solidwork Projects/Basic (Practice) Models/Model 35/thumbnail.png",
            zipPath: "Solidwork Projects/Basic (Practice) Models/Model 35.zip",
            day: "Practice",
            tags: ["Part", "Practice"]
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
        ...solidworksModelsData.basic,
        ...solidworksModelsData.intermediate,
        ...solidworksModelsData.professional,
        ...solidworksModelsData.commercial
    ];
};

const getModelById = (id) => {
    return getAllModels().find(model => model.id === id);
};

const getModelsByCategory = (category) => {
    switch(category.toLowerCase()) {
        case 'basic':
            return solidworksModelsData.basic;
        case 'intermediate':
            return solidworksModelsData.intermediate;
        case 'professional':
        case 'pro':
            return solidworksModelsData.professional;
        case 'commercial':
        case 'paid':
            return solidworksModelsData.commercial;
        default:
            return getAllModels();
    }
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

// Statistics
const getStatistics = () => {
    return {
        total: getAllModels().length,
        basic: solidworksModelsData.basic.length,
        intermediate: solidworksModelsData.intermediate.length,
        professional: solidworksModelsData.professional.length,
        commercial: solidworksModelsData.commercial.length,
        assemblies: getAllModels().filter(m => m.files.some(f => f.includes('.SLDASM'))).length,
        parts: getAllModels().filter(m => m.files.some(f => f.includes('.SLDPRT'))).length
    };
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
