// ==================================================================================
// COMPREHENSIVE CONTENT DATA STRUCTURE - MAXIMUM EDITABILITY
// Includes ALL possible text fields from every page
// Version: 3.0 - Enhanced Edition
// ==================================================================================

const comprehensiveContentData = {
    home: {
        title: "Home Page - Complete",
        description: "Hero section, buttons, expertise cards, tech stack, and all visible text",
        filePath: "Home/index.html",
        sections: [
            {
                id: "hero_main",
                name: "Hero Section - Main Text",
                icon: "fa-star",
                fields: [
                    {
                        id: "greeting",
                        label: "Greeting Text",
                        type: "text",
                        value: "Hi, I'm",
                        selector: ".hero-title .word",
                        maxLength: 30
                    },
                    {
                        id: "full_name",
                        label: "Your Full Name",
                        type: "text",
                        value: "Md Akhinoor Islam",
                        selector: ".hero-title .highlight",
                        maxLength: 50
                    },
                    {
                        id: "professional_title",
                        label: "Professional Title/Subtitle",
                        type: "text",
                        value: "Energy Science & Engineering Student • KUET",
                        selector: ".hero-subtitle .typing-text",
                        maxLength: 100
                    },
                    {
                        id: "hero_description",
                        label: "Hero Description Paragraph",
                        type: "textarea",
                        value: "Passionate about creating innovative solutions and building amazing projects. Currently studying in the Department of Energy Science and Engineering at KUET, exploring the latest technologies and developing my skills in CAD design, web development, and engineering simulations.",
                        selector: ".hero-description .description-text",
                        maxLength: 600
                    }
                ]
            },
            {
                id: "tech_stack",
                name: "Technology Stack Badges",
                icon: "fa-microchip",
                fields: [
                    {
                        id: "tech_solidworks",
                        label: "SOLIDWORKS Badge",
                        type: "text",
                        value: "SOLIDWORKS",
                        selector: ".tech-badge[data-tech='solidworks'] .tech-name",
                        maxLength: 30
                    },
                    {
                        id: "tech_ai",
                        label: "AI Badge",
                        type: "text",
                        value: "AI",
                        selector: ".tech-badge[data-tech='ai'] .tech-name",
                        maxLength: 30
                    },
                    {
                        id: "tech_simulation",
                        label: "Simulation Badge",
                        type: "text",
                        value: "Simulation",
                        selector: ".tech-badge[data-tech='simulation'] .tech-name",
                        maxLength: 30
                    },
                    {
                        id: "tech_embedded",
                        label: "Embedded System Badge",
                        type: "text",
                        value: "Embedded System",
                        selector: ".tech-badge[data-tech='embedded'] .tech-name",
                        maxLength: 30
                    },
                    {
                        id: "tech_assembly",
                        label: "Assembly Badge",
                        type: "text",
                        value: "Assembly",
                        selector: ".tech-badge[data-tech='assembly'] .tech-name",
                        maxLength: 30
                    },
                    {
                        id: "tech_robotics",
                        label: "Robotics Badge",
                        type: "text",
                        value: "Robotics",
                        selector: ".tech-badge[data-tech='robotics'] .tech-name",
                        maxLength: 30
                    }
                ]
            },
            {
                id: "cta_buttons",
                name: "Call-to-Action Buttons",
                icon: "fa-hand-pointer",
                fields: [
                    {
                        id: "cta1_text",
                        label: "Primary CTA (3D CAD)",
                        type: "text",
                        value: "3D CAD Projects",
                        selector: ".btn-primary .btn-text:first",
                        maxLength: 30
                    },
                    {
                        id: "cta2_text",
                        label: "Secondary CTA (Video Blog)",
                        type: "text",
                        value: "Video Blog",
                        selector: ".btn-secondary .btn-text",
                        maxLength: 30
                    },
                    {
                        id: "cta3_text",
                        label: "Outline CTA (Arduino)",
                        type: "text",
                        value: "Arduino Projects",
                        selector: ".btn-outline .btn-text",
                        maxLength: 30
                    },
                    {
                        id: "cta4_text",
                        label: "Glow CTA (Books)",
                        type: "text",
                        value: "Books & Papers",
                        selector: ".btn-glow .btn-text",
                        maxLength: 30
                    }
                ]
            },
            {
                id: "expertise_cards",
                name: "Expertise Showcase Cards",
                icon: "fa-award",
                fields: [
                    {
                        id: "expertise1_title",
                        label: "Expertise 1 - Title",
                        type: "text",
                        value: "3D CAD Design",
                        selector: ".expertise-card:nth-child(1) h4",
                        maxLength: 50
                    },
                    {
                        id: "expertise1_desc",
                        label: "Expertise 1 - Description",
                        type: "text",
                        value: "Advanced modeling & assembly",
                        selector: ".expertise-card:nth-child(1) p",
                        maxLength: 100
                    },
                    {
                        id: "expertise2_title",
                        label: "Expertise 2 - Title",
                        type: "text",
                        value: "Mechanical Engineering",
                        selector: ".expertise-card:nth-child(2) h4",
                        maxLength: 50
                    },
                    {
                        id: "expertise2_desc",
                        label: "Expertise 2 - Description",
                        type: "text",
                        value: "Simulation & analysis",
                        selector: ".expertise-card:nth-child(2) p",
                        maxLength: 100
                    },
                    {
                        id: "expertise3_title",
                        label: "Expertise 3 - Title",
                        type: "text",
                        value: "Energy Systems",
                        selector: ".expertise-card:nth-child(3) h4",
                        maxLength: 50
                    },
                    {
                        id: "expertise3_desc",
                        label: "Expertise 3 - Description",
                        type: "text",
                        value: "Renewable & sustainable tech",
                        selector: ".expertise-card:nth-child(3) p",
                        maxLength: 100
                    },
                    {
                        id: "expertise4_title",
                        label: "Expertise 4 - Title",
                        type: "text",
                        value: "IoT & Automation",
                        selector: ".expertise-card:nth-child(4) h4",
                        maxLength: 50
                    },
                    {
                        id: "expertise4_desc",
                        label: "Expertise 4 - Description",
                        type: "text",
                        value: "Arduino & embedded systems",
                        selector: ".expertise-card:nth-child(4) p",
                        maxLength: 100
                    }
                ]
            },
            {
                id: "profile_markers",
                name: "Profile Card Engineering Markers",
                icon: "fa-ruler-combined",
                fields: [
                    {
                        id: "marker_top",
                        label: "Top Marker (University)",
                        type: "text",
                        value: "KUET",
                        selector: ".marker-top .marker-label",
                        maxLength: 20
                    },
                    {
                        id: "marker_right",
                        label: "Right Marker (Department)",
                        type: "text",
                        value: "ESE",
                        selector: ".marker-right .marker-label",
                        maxLength: 20
                    },
                    {
                        id: "marker_bottom",
                        label: "Bottom Marker (Year)",
                        type: "text",
                        value: "2023",
                        selector: ".marker-bottom .marker-label",
                        maxLength: 20
                    },
                    {
                        id: "marker_left",
                        label: "Left Marker (Interest)",
                        type: "text",
                        value: "AI",
                        selector: ".marker-left .marker-label",
                        maxLength: 20
                    }
                ]
            },
            {
                id: "navbar",
                name: "Desktop Navigation Bar",
                icon: "fa-bars",
                fields: [
                    {
                        id: "nav_logo_text",
                        label: "Logo/Brand Name",
                        type: "text",
                        value: "A3KM Studio",
                        selector: ".desktop-nav-brand-name",
                        maxLength: 50
                    },
                    {
                        id: "nav_tagline",
                        label: "Brand Tagline",
                        type: "text",
                        value: "Engineering · Education · Innovation",
                        selector: ".desktop-nav-brand-tagline",
                        maxLength: 100
                    },
                    {
                        id: "nav_about",
                        label: "About Menu Text",
                        type: "text",
                        value: "About",
                        selector: "#nav-about span",
                        maxLength: 30
                    },
                    {
                        id: "nav_projects",
                        label: "Projects Menu Text",
                        type: "text",
                        value: "Projects",
                        selector: "#nav-projects span",
                        maxLength: 30
                    },
                    {
                        id: "nav_studio",
                        label: "Content Studio Menu Text",
                        type: "text",
                        value: "Content Studio",
                        selector: "#nav-studio span",
                        maxLength: 30
                    },
                    {
                        id: "nav_contact",
                        label: "Contact Menu Text",
                        type: "text",
                        value: "Contact",
                        selector: "#nav-contact span",
                        maxLength: 30
                    },
                    {
                        id: "nav_cv",
                        label: "CV Button Text",
                        type: "text",
                        value: "CV",
                        selector: ".desktop-nav-cv-btn span",
                        maxLength: 20
                    }
                ]
            },
            {
                id: "footer",
                name: "Footer Section",
                icon: "fa-info-circle",
                fields: [
                    {
                        id: "footer_heading",
                        label: "Footer Heading",
                        type: "text",
                        value: "A3KM Studio",
                        selector: ".footer-heading",
                        maxLength: 50
                    },
                    {
                        id: "footer_tagline",
                        label: "Footer Tagline",
                        type: "text",
                        value: "Engineering Excellence & Educational Innovation",
                        selector: ".footer-tagline",
                        maxLength: 100
                    },
                    {
                        id: "footer_copyright",
                        label: "Copyright Text",
                        type: "text",
                        value: "© 2024 Md Akhinoor Islam. All rights reserved.",
                        selector: ".footer-copyright",
                        maxLength: 100
                    },
                    {
                        id: "footer_quick_links_title",
                        label: "Quick Links - Section Title",
                        type: "text",
                        value: "Quick Links",
                        selector: ".footer-links-title",
                        maxLength: 30
                    },
                    {
                        id: "footer_link_home",
                        label: "Quick Links - Home",
                        type: "text",
                        value: "Home",
                        selector: ".footer-link[href='#home']",
                        maxLength: 30
                    },
                    {
                        id: "footer_link_about",
                        label: "Quick Links - About",
                        type: "text",
                        value: "About Me",
                        selector: ".footer-link[href='#about']",
                        maxLength: 30
                    },
                    {
                        id: "footer_link_projects",
                        label: "Quick Links - Projects",
                        type: "text",
                        value: "Projects",
                        selector: ".footer-link[href='#projects']",
                        maxLength: 30
                    },
                    {
                        id: "footer_link_studio",
                        label: "Quick Links - Content Studio",
                        type: "text",
                        value: "Content Studio",
                        selector: ".footer-link[href='#studio']",
                        maxLength: 30
                    },
                    {
                        id: "footer_link_contact",
                        label: "Quick Links - Contact",
                        type: "text",
                        value: "Contact",
                        selector: ".footer-link[href='#contact']",
                        maxLength: 30
                    },
                    {
                        id: "footer_social_title",
                        label: "Social Media - Section Title",
                        type: "text",
                        value: "Connect With Me",
                        selector: ".footer-social-title",
                        maxLength: 50
                    }
                ]
            }
        ]
    },
    
    certificates: {
        title: "Certificates Management - Complete",
        description: "Manage all certificate metadata, categories, descriptions, and details",
        filePath: "About me/certificates-data.json",
        sections: [
            {
                id: "cert_meta",
                name: "Certificates Page Metadata",
                icon: "fa-info-circle",
                fields: [
                    {
                        id: "cert_page_title",
                        label: "Page Title",
                        type: "text",
                        value: "My Certificates",
                        selector: ".certificates-page-title",
                        maxLength: 100
                    },
                    {
                        id: "cert_page_subtitle",
                        label: "Page Subtitle",
                        type: "text",
                        value: "Professional Achievements & Certifications",
                        selector: ".certificates-page-subtitle",
                        maxLength: 150
                    },
                    {
                        id: "cert_page_description",
                        label: "Page Description",
                        type: "textarea",
                        value: "A comprehensive collection of my professional certifications, skill badges, and academic achievements. Each certificate represents dedication to continuous learning and professional development.",
                        selector: ".certificates-page-description",
                        maxLength: 500
                    }
                ]
            },
            {
                id: "cert_categories",
                name: "Certificate Categories",
                icon: "fa-folder-open",
                fields: [
                    {
                        id: "cat_academic_name",
                        label: "Academic Category Name",
                        type: "text",
                        value: "Academic Certificates",
                        selector: ".category-academic .category-name",
                        maxLength: 50
                    },
                    {
                        id: "cat_academic_desc",
                        label: "Academic Category Description",
                        type: "textarea",
                        value: "Certificates related to academic achievements, scholarships, and university honors. These represent my dedication to academic excellence and continuous learning.",
                        selector: ".category-academic .category-description",
                        maxLength: 300
                    },
                    {
                        id: "cat_academic_icon",
                        label: "Academic Icon Class",
                        type: "text",
                        value: "fa-graduation-cap",
                        selector: ".category-academic .category-icon",
                        maxLength: 50
                    },
                    {
                        id: "cat_skill_name",
                        label: "Skill Category Name",
                        type: "text",
                        value: "Skill Certificates",
                        selector: ".category-skill .category-name",
                        maxLength: 50
                    },
                    {
                        id: "cat_skill_desc",
                        label: "Skill Category Description",
                        type: "textarea",
                        value: "Professional skill certifications from online courses, workshops, and training programs. Covering CAD, engineering software, programming, and technical skills.",
                        selector: ".category-skill .category-description",
                        maxLength: 300
                    },
                    {
                        id: "cat_skill_icon",
                        label: "Skill Icon Class",
                        type: "text",
                        value: "fa-tools",
                        selector: ".category-skill .category-icon",
                        maxLength: 50
                    },
                    {
                        id: "cat_medical_name",
                        label: "Medical Category Name",
                        type: "text",
                        value: "Medical Certificates",
                        selector: ".category-medical .category-name",
                        maxLength: 50
                    },
                    {
                        id: "cat_medical_desc",
                        label: "Medical Category Description",
                        type: "textarea",
                        value: "Health and medical certificates, fitness records, and wellness documentation. Important for maintaining health records and official documentation.",
                        selector: ".category-medical .category-description",
                        maxLength: 300
                    },
                    {
                        id: "cat_medical_icon",
                        label: "Medical Icon Class",
                        type: "text",
                        value: "fa-heartbeat",
                        selector: ".category-medical .category-icon",
                        maxLength: 50
                    }
                ]
            },
            {
                id: "cert_academic_sub",
                name: "Academic Subcategories",
                icon: "fa-sitemap",
                fields: [
                    {
                        id: "sub_academic_scholarship_name",
                        label: "Scholarship Subcategory",
                        type: "text",
                        value: "Scholarships",
                        selector: ".subcategory-scholarship .subcat-name",
                        maxLength: 50
                    },
                    {
                        id: "sub_academic_scholarship_desc",
                        label: "Scholarship Description",
                        type: "textarea",
                        value: "Merit-based scholarships and financial aid certificates recognizing academic excellence.",
                        selector: ".subcategory-scholarship .subcat-description",
                        maxLength: 200
                    },
                    {
                        id: "sub_academic_award_name",
                        label: "Academic Awards Subcategory",
                        type: "text",
                        value: "Academic Awards",
                        selector: ".subcategory-award .subcat-name",
                        maxLength: 50
                    },
                    {
                        id: "sub_academic_award_desc",
                        label: "Academic Awards Description",
                        type: "textarea",
                        value: "Awards and recognitions received for academic achievements and competition wins.",
                        selector: ".subcategory-award .subcat-description",
                        maxLength: 200
                    },
                    {
                        id: "sub_academic_degree_name",
                        label: "Degree Certificates Subcategory",
                        type: "text",
                        value: "Degree Certificates",
                        selector: ".subcategory-degree .subcat-name",
                        maxLength: 50
                    },
                    {
                        id: "sub_academic_degree_desc",
                        label: "Degree Certificates Description",
                        type: "textarea",
                        value: "Official degree certificates, transcripts, and academic credentials from institutions.",
                        selector: ".subcategory-degree .subcat-description",
                        maxLength: 200
                    }
                ]
            },
            {
                id: "cert_skill_sub",
                name: "Skill Subcategories",
                icon: "fa-puzzle-piece",
                fields: [
                    {
                        id: "sub_skill_cad_name",
                        label: "CAD Software Subcategory",
                        type: "text",
                        value: "CAD & Design Software",
                        selector: ".subcategory-cad .subcat-name",
                        maxLength: 50
                    },
                    {
                        id: "sub_skill_cad_desc",
                        label: "CAD Software Description",
                        type: "textarea",
                        value: "Certifications in SOLIDWORKS, AutoCAD, Fusion 360, and other CAD design tools.",
                        selector: ".subcategory-cad .subcat-description",
                        maxLength: 200
                    },
                    {
                        id: "sub_skill_programming_name",
                        label: "Programming Subcategory",
                        type: "text",
                        value: "Programming & Development",
                        selector: ".subcategory-programming .subcat-name",
                        maxLength: 50
                    },
                    {
                        id: "sub_skill_programming_desc",
                        label: "Programming Description",
                        type: "textarea",
                        value: "Programming languages, web development, and software engineering certifications.",
                        selector: ".subcategory-programming .subcat-description",
                        maxLength: 200
                    },
                    {
                        id: "sub_skill_embedded_name",
                        label: "Embedded Systems Subcategory",
                        type: "text",
                        value: "Arduino & Embedded Systems",
                        selector: ".subcategory-embedded .subcat-name",
                        maxLength: 50
                    },
                    {
                        id: "sub_skill_embedded_desc",
                        label: "Embedded Systems Description",
                        type: "textarea",
                        value: "IoT, Arduino, Raspberry Pi, and embedded systems programming certificates.",
                        selector: ".subcategory-embedded .subcat-description",
                        maxLength: 200
                    },
                    {
                        id: "sub_skill_office_name",
                        label: "Office Suite Subcategory",
                        type: "text",
                        value: "Microsoft Office Suite",
                        selector: ".subcategory-office .subcat-name",
                        maxLength: 50
                    },
                    {
                        id: "sub_skill_office_desc",
                        label: "Office Suite Description",
                        type: "textarea",
                        value: "Microsoft Word, Excel, PowerPoint, and other productivity software certifications.",
                        selector: ".subcategory-office .subcat-description",
                        maxLength: 200
                    },
                    {
                        id: "sub_skill_graphics_name",
                        label: "Graphics Design Subcategory",
                        type: "text",
                        value: "Graphics & Visual Design",
                        selector: ".subcategory-graphics .subcat-name",
                        maxLength: 50
                    },
                    {
                        id: "sub_skill_graphics_desc",
                        label: "Graphics Design Description",
                        type: "textarea",
                        value: "Adobe Illustrator, Photoshop, and graphic design tool certifications.",
                        selector: ".subcategory-graphics .subcat-description",
                        maxLength: 200
                    }
                ]
            },
            {
                id: "cert_medical_sub",
                name: "Medical Subcategories",
                icon: "fa-notes-medical",
                fields: [
                    {
                        id: "sub_medical_health_name",
                        label: "Health Reports Subcategory",
                        type: "text",
                        value: "Health Reports",
                        selector: ".subcategory-health .subcat-name",
                        maxLength: 50
                    },
                    {
                        id: "sub_medical_health_desc",
                        label: "Health Reports Description",
                        type: "textarea",
                        value: "Medical checkup reports, blood tests, and routine health examination certificates.",
                        selector: ".subcategory-health .subcat-description",
                        maxLength: 200
                    },
                    {
                        id: "sub_medical_fitness_name",
                        label: "Fitness Certificates Subcategory",
                        type: "text",
                        value: "Fitness Certificates",
                        selector: ".subcategory-fitness .subcat-name",
                        maxLength: 50
                    },
                    {
                        id: "sub_medical_fitness_desc",
                        label: "Fitness Certificates Description",
                        type: "textarea",
                        value: "Physical fitness certificates required for admissions, jobs, or competitions.",
                        selector: ".subcategory-fitness .subcat-description",
                        maxLength: 200
                    },
                    {
                        id: "sub_medical_vaccination_name",
                        label: "Vaccination Records Subcategory",
                        type: "text",
                        value: "Vaccination Records",
                        selector: ".subcategory-vaccination .subcat-name",
                        maxLength: 50
                    },
                    {
                        id: "sub_medical_vaccination_desc",
                        label: "Vaccination Records Description",
                        type: "textarea",
                        value: "COVID-19, flu, and other vaccination certificates and immunization records.",
                        selector: ".subcategory-vaccination .subcat-description",
                        maxLength: 200
                    }
                ]
            },
            {
                id: "cert_display",
                name: "Certificate Display Settings",
                icon: "fa-display",
                fields: [
                    {
                        id: "cert_grid_heading",
                        label: "Certificates Grid Heading",
                        type: "text",
                        value: "All Certificates",
                        selector: ".certificates-grid-heading",
                        maxLength: 50
                    },
                    {
                        id: "cert_filter_all",
                        label: "Filter All Text",
                        type: "text",
                        value: "All",
                        selector: ".filter-btn[data-filter='all']",
                        maxLength: 20
                    },
                    {
                        id: "cert_filter_academic",
                        label: "Filter Academic Text",
                        type: "text",
                        value: "Academic",
                        selector: ".filter-btn[data-filter='academic']",
                        maxLength: 20
                    },
                    {
                        id: "cert_filter_skill",
                        label: "Filter Skill Text",
                        type: "text",
                        value: "Skills",
                        selector: ".filter-btn[data-filter='skill']",
                        maxLength: 20
                    },
                    {
                        id: "cert_filter_medical",
                        label: "Filter Medical Text",
                        type: "text",
                        value: "Medical",
                        selector: ".filter-btn[data-filter='medical']",
                        maxLength: 20
                    },
                    {
                        id: "cert_search_placeholder",
                        label: "Search Box Placeholder",
                        type: "text",
                        value: "Search certificates...",
                        selector: ".cert-search-input",
                        maxLength: 50
                    },
                    {
                        id: "cert_sort_label",
                        label: "Sort Label Text",
                        type: "text",
                        value: "Sort by:",
                        selector: ".sort-label",
                        maxLength: 30
                    },
                    {
                        id: "cert_sort_date",
                        label: "Sort by Date Option",
                        type: "text",
                        value: "Date Added",
                        selector: ".sort-option[value='date']",
                        maxLength: 30
                    },
                    {
                        id: "cert_sort_name",
                        label: "Sort by Name Option",
                        type: "text",
                        value: "Name (A-Z)",
                        selector: ".sort-option[value='name']",
                        maxLength: 30
                    },
                    {
                        id: "cert_sort_category",
                        label: "Sort by Category Option",
                        type: "text",
                        value: "Category",
                        selector: ".sort-option[value='category']",
                        maxLength: 30
                    }
                ]
            },
            {
                id: "cert_card_labels",
                name: "Certificate Card Labels",
                icon: "fa-id-card",
                fields: [
                    {
                        id: "cert_card_category_label",
                        label: "Category Badge Label",
                        type: "text",
                        value: "Category:",
                        selector: ".cert-category-label",
                        maxLength: 30
                    },
                    {
                        id: "cert_card_subcategory_label",
                        label: "Subcategory Badge Label",
                        type: "text",
                        value: "Type:",
                        selector: ".cert-subcategory-label",
                        maxLength: 30
                    },
                    {
                        id: "cert_card_date_label",
                        label: "Date Label",
                        type: "text",
                        value: "Issued:",
                        selector: ".cert-date-label",
                        maxLength: 30
                    },
                    {
                        id: "cert_card_issuer_label",
                        label: "Issuer Label",
                        type: "text",
                        value: "Issued by:",
                        selector: ".cert-issuer-label",
                        maxLength: 30
                    },
                    {
                        id: "cert_card_view_btn",
                        label: "View Button Text",
                        type: "text",
                        value: "View Certificate",
                        selector: ".cert-view-btn",
                        maxLength: 30
                    },
                    {
                        id: "cert_card_download_btn",
                        label: "Download Button Text",
                        type: "text",
                        value: "Download",
                        selector: ".cert-download-btn",
                        maxLength: 30
                    },
                    {
                        id: "cert_card_share_btn",
                        label: "Share Button Text",
                        type: "text",
                        value: "Share",
                        selector: ".cert-share-btn",
                        maxLength: 30
                    }
                ]
            },
            {
                id: "cert_stats",
                name: "Certificate Statistics Labels",
                icon: "fa-chart-bar",
                fields: [
                    {
                        id: "stat_total_label",
                        label: "Total Certificates Label",
                        type: "text",
                        value: "Total Certificates",
                        selector: ".stat-total-label",
                        maxLength: 50
                    },
                    {
                        id: "stat_academic_label",
                        label: "Academic Count Label",
                        type: "text",
                        value: "Academic",
                        selector: ".stat-academic-label",
                        maxLength: 30
                    },
                    {
                        id: "stat_skill_label",
                        label: "Skill Count Label",
                        type: "text",
                        value: "Skills",
                        selector: ".stat-skill-label",
                        maxLength: 30
                    },
                    {
                        id: "stat_medical_label",
                        label: "Medical Count Label",
                        type: "text",
                        value: "Medical",
                        selector: ".stat-medical-label",
                        maxLength: 30
                    },
                    {
                        id: "stat_recent_label",
                        label: "Recent Certificates Heading",
                        type: "text",
                        value: "Recently Added",
                        selector: ".stat-recent-heading",
                        maxLength: 50
                    }
                ]
            },
            {
                id: "cert_modal",
                name: "Certificate Viewer Modal",
                icon: "fa-window-maximize",
                fields: [
                    {
                        id: "modal_title",
                        label: "Modal Title",
                        type: "text",
                        value: "Certificate Details",
                        selector: ".cert-modal-title",
                        maxLength: 50
                    },
                    {
                        id: "modal_close_btn",
                        label: "Close Button Text",
                        type: "text",
                        value: "Close",
                        selector: ".cert-modal-close",
                        maxLength: 20
                    },
                    {
                        id: "modal_fullscreen_btn",
                        label: "Fullscreen Button Text",
                        type: "text",
                        value: "Fullscreen",
                        selector: ".cert-modal-fullscreen",
                        maxLength: 30
                    },
                    {
                        id: "modal_print_btn",
                        label: "Print Button Text",
                        type: "text",
                        value: "Print",
                        selector: ".cert-modal-print",
                        maxLength: 20
                    },
                    {
                        id: "modal_download_btn",
                        label: "Download Button Text",
                        type: "text",
                        value: "Download Certificate",
                        selector: ".cert-modal-download",
                        maxLength: 30
                    },
                    {
                        id: "modal_info_title",
                        label: "Information Section Title",
                        type: "text",
                        value: "Certificate Information",
                        selector: ".cert-modal-info-title",
                        maxLength: 50
                    },
                    {
                        id: "modal_no_cert_msg",
                        label: "No Certificate Message",
                        type: "text",
                        value: "No certificates found. Upload your first certificate!",
                        selector: ".no-certificates-message",
                        maxLength: 100
                    }
                ]
            },
            {
                id: "cert_messages",
                name: "User Messages & Notifications",
                icon: "fa-comment",
                fields: [
                    {
                        id: "msg_upload_success",
                        label: "Upload Success Message",
                        type: "text",
                        value: "Certificate uploaded successfully!",
                        selector: ".upload-success-msg",
                        maxLength: 100
                    },
                    {
                        id: "msg_upload_error",
                        label: "Upload Error Message",
                        type: "text",
                        value: "Failed to upload certificate. Please try again.",
                        selector: ".upload-error-msg",
                        maxLength: 100
                    },
                    {
                        id: "msg_delete_confirm",
                        label: "Delete Confirmation Message",
                        type: "text",
                        value: "Are you sure you want to delete this certificate?",
                        selector: ".delete-confirm-msg",
                        maxLength: 100
                    },
                    {
                        id: "msg_delete_success",
                        label: "Delete Success Message",
                        type: "text",
                        value: "Certificate deleted successfully!",
                        selector: ".delete-success-msg",
                        maxLength: 100
                    },
                    {
                        id: "msg_loading",
                        label: "Loading Message",
                        type: "text",
                        value: "Loading certificates...",
                        selector: ".loading-msg",
                        maxLength: 50
                    },
                    {
                        id: "msg_no_results",
                        label: "No Search Results Message",
                        type: "text",
                        value: "No certificates match your search.",
                        selector: ".no-results-msg",
                        maxLength: 100
                    }
                ]
            }
        ]
    },
    
    about: {
        title: "About Page - Complete",
        description: "Bio, education, skills, languages, hobbies - everything editable",
        filePath: "About me/about.html",
        sections: [
            {
                id: "page_header",
                name: "Page Header",
                icon: "fa-heading",
                fields: [
                    {
                        id: "page_title",
                        label: "Page Title",
                        type: "text",
                        value: "About Me",
                        selector: ".bp-header h1",
                        maxLength: 50
                    },
                    {
                        id: "page_subtitle",
                        label: "Page Subtitle",
                        type: "text",
                        value: "Energy Science & Engineering • KUET",
                        selector: ".bp-header p",
                        maxLength: 100
                    }
                ]
            },
            {
                id: "about_bio",
                name: "About Myself Section",
                icon: "fa-user-circle",
                fields: [
                    {
                        id: "bio_para1",
                        label: "Bio Paragraph 1",
                        type: "textarea",
                        value: "I am a second-year Energy Science and Engineering student at KUET, passionate about electronics, energy systems, and emerging technologies like AI and embedded systems. I've worked on an Arduino-based safety alert project, and I'm skilled in MS Office, Adobe Illustrator, and SOLIDWORKS.",
                        selector: ".desktop-about-text p:first-child",
                        maxLength: 500
                    },
                    {
                        id: "bio_para2",
                        label: "Bio Paragraph 2",
                        type: "textarea",
                        value: "I thrive in team-based, hands-on environments, adapt quickly, and complete tasks with precision and integrity. My goal is to pursue research and higher studies abroad with a scholarship.",
                        selector: ".desktop-about-text p:last-child",
                        maxLength: 500
                    }
                ]
            },
            {
                id: "education_bsc",
                name: "BSc Education Details",
                icon: "fa-graduation-cap",
                fields: [
                    {
                        id: "bsc_title",
                        label: "BSc Degree Title",
                        type: "text",
                        value: "Bachelor of Science (BSc) in Energy Science & Engineering",
                        selector: ".desktop-timeline-item:first-child h3",
                        maxLength: 100
                    },
                    {
                        id: "bsc_batch",
                        label: "BSc Batch",
                        type: "text",
                        value: "Batch 2K23",
                        selector: ".desktop-timeline-item:first-child .timeline-date",
                        maxLength: 50
                    },
                    {
                        id: "bsc_institution",
                        label: "University Name",
                        type: "text",
                        value: "Khulna University of Engineering & Technology (KUET)",
                        selector: ".desktop-timeline-item:first-child .timeline-institution",
                        maxLength: 100
                    },
                    {
                        id: "bsc_location",
                        label: "Location",
                        type: "text",
                        value: "Khulna, Bangladesh",
                        selector: ".desktop-timeline-item:first-child .timeline-location",
                        maxLength: 100
                    }
                ]
            },
            {
                id: "education_hsc",
                name: "HSC Education Details",
                icon: "fa-school",
                fields: [
                    {
                        id: "hsc_title",
                        label: "HSC Title",
                        type: "text",
                        value: "Higher Secondary Certificate (HSC)",
                        selector: ".education-card:first-child h3",
                        maxLength: 100
                    },
                    {
                        id: "hsc_batch",
                        label: "HSC Batch & Session",
                        type: "text",
                        value: "Batch 2K23 • Session 2021-2022",
                        selector: ".education-card:first-child .timeline-date",
                        maxLength: 100
                    },
                    {
                        id: "hsc_institution",
                        label: "HSC College Name",
                        type: "text",
                        value: "Rangpur Government College (RGC)",
                        selector: ".education-card:first-child .timeline-institution",
                        maxLength: 100
                    },
                    {
                        id: "hsc_result",
                        label: "HSC Result",
                        type: "text",
                        value: "GPA 5.00 out of 5.00",
                        selector: ".education-card:first-child .timeline-details-desktop p:last-child",
                        maxLength: 50
                    }
                ]
            },
            {
                id: "education_ssc",
                name: "SSC Education Details",
                icon: "fa-school",
                fields: [
                    {
                        id: "ssc_title",
                        label: "SSC Title",
                        type: "text",
                        value: "Secondary School Certificate (SSC)",
                        selector: ".education-card:last-child h3",
                        maxLength: 100
                    },
                    {
                        id: "ssc_batch",
                        label: "SSC Batch & Session",
                        type: "text",
                        value: "Batch 2K21 • Session 2019-2020",
                        selector: ".education-card:last-child .timeline-date",
                        maxLength: 100
                    },
                    {
                        id: "ssc_institution",
                        label: "SSC School Name",
                        type: "text",
                        value: "Cantonment Public School and College, Saidpur (CPSCS)",
                        selector: ".education-card:last-child .timeline-institution",
                        maxLength: 150
                    },
                    {
                        id: "ssc_result",
                        label: "SSC Result",
                        type: "text",
                        value: "GPA 5.00 out of 5.00",
                        selector: ".education-card:last-child .timeline-details-desktop p:last-child",
                        maxLength: 50
                    }
                ]
            },
            {
                id: "skills",
                name: "Technical Skills (All 12 skills)",
                icon: "fa-tools",
                fields: [
                    {
                        id: "skill1",
                        label: "Skill 1",
                        type: "text",
                        value: "CAD Design",
                        selector: ".desktop-skill-item:nth-child(1) .skill-name",
                        maxLength: 50
                    },
                    {
                        id: "skill2",
                        label: "Skill 2",
                        type: "text",
                        value: "SOLIDWORKS",
                        selector: ".desktop-skill-item:nth-child(2) .skill-name",
                        maxLength: 50
                    },
                    {
                        id: "skill3",
                        label: "Skill 3",
                        type: "text",
                        value: "Mechanical Engineering",
                        selector: ".desktop-skill-item:nth-child(3) .skill-name",
                        maxLength: 50
                    },
                    {
                        id: "skill4",
                        label: "Skill 4",
                        type: "text",
                        value: "Energy Systems",
                        selector: ".desktop-skill-item:nth-child(4) .skill-name",
                        maxLength: 50
                    },
                    {
                        id: "skill5",
                        label: "Skill 5",
                        type: "text",
                        value: "Arduino & IoT",
                        selector: ".desktop-skill-item:nth-child(5) .skill-name",
                        maxLength: 50
                    },
                    {
                        id: "skill6",
                        label: "Skill 6",
                        type: "text",
                        value: "Circuit Design",
                        selector: ".desktop-skill-item:nth-child(6) .skill-name",
                        maxLength: 50
                    },
                    {
                        id: "skill7",
                        label: "Skill 7",
                        type: "text",
                        value: "MS Word",
                        selector: ".desktop-skill-item:nth-child(7) .skill-name",
                        maxLength: 50
                    },
                    {
                        id: "skill8",
                        label: "Skill 8",
                        type: "text",
                        value: "MS Excel",
                        selector: ".desktop-skill-item:nth-child(8) .skill-name",
                        maxLength: 50
                    },
                    {
                        id: "skill9",
                        label: "Skill 9",
                        type: "text",
                        value: "PowerPoint",
                        selector: ".desktop-skill-item:nth-child(9) .skill-name",
                        maxLength: 50
                    },
                    {
                        id: "skill10",
                        label: "Skill 10",
                        type: "text",
                        value: "Adobe Illustrator",
                        selector: ".desktop-skill-item:nth-child(10) .skill-name",
                        maxLength: 50
                    },
                    {
                        id: "skill11",
                        label: "Skill 11",
                        type: "text",
                        value: "Laser Cutting",
                        selector: ".desktop-skill-item:nth-child(11) .skill-name",
                        maxLength: 50
                    },
                    {
                        id: "skill12",
                        label: "Skill 12",
                        type: "text",
                        value: "3D Printing",
                        selector: ".desktop-skill-item:nth-child(12) .skill-name",
                        maxLength: 50
                    }
                ]
            },
            {
                id: "languages",
                name: "Language Skills",
                icon: "fa-language",
                fields: [
                    {
                        id: "lang_bengali_label",
                        label: "Bengali Language Label",
                        type: "text",
                        value: "Bengali",
                        selector: ".lang-compact-item:nth-child(1) h3",
                        maxLength: 30
                    },
                    {
                        id: "lang_bengali_level",
                        label: "Bengali Level",
                        type: "text",
                        value: "Native",
                        selector: ".lang-level-badge.native",
                        maxLength: 30
                    },
                    {
                        id: "lang_english_label",
                        label: "English Language Label",
                        type: "text",
                        value: "English",
                        selector: ".lang-compact-item:nth-child(2) h3",
                        maxLength: 30
                    },
                    {
                        id: "lang_listening_label",
                        label: "Listening Skill Label",
                        type: "text",
                        value: "Listening",
                        selector: ".skill-grid-item:nth-child(1) .skill-name",
                        maxLength: 30
                    },
                    {
                        id: "lang_reading_label",
                        label: "Reading Skill Label",
                        type: "text",
                        value: "Reading",
                        selector: ".skill-grid-item:nth-child(2) .skill-name",
                        maxLength: 30
                    },
                    {
                        id: "lang_writing_label",
                        label: "Writing Skill Label",
                        type: "text",
                        value: "Writing",
                        selector: ".skill-grid-item:nth-child(3) .skill-name",
                        maxLength: 30
                    },
                    {
                        id: "lang_speaking_label",
                        label: "Speaking Skill Label",
                        type: "text",
                        value: "Speaking",
                        selector: ".skill-grid-item:nth-child(4) .skill-name",
                        maxLength: 30
                    },
                    {
                        id: "lang_interaction_label",
                        label: "Interaction Skill Label",
                        type: "text",
                        value: "Interaction",
                        selector: ".skill-grid-item:nth-child(5) .skill-name",
                        maxLength: 30
                    }
                ]
            },
            {
                id: "hobbies",
                name: "Hobbies & Interests (All)",
                icon: "fa-heart",
                fields: [
                    {
                        id: "hobby1_title",
                        label: "Hobby 1 - Title",
                        type: "text",
                        value: "Drawing",
                        selector: ".desktop-hobby-card:nth-child(1) h3",
                        maxLength: 50
                    },
                    {
                        id: "hobby1_desc",
                        label: "Hobby 1 - Description",
                        type: "text",
                        value: "Creative expression through art and sketching",
                        selector: ".desktop-hobby-card:nth-child(1) p",
                        maxLength: 100
                    },
                    {
                        id: "hobby2_title",
                        label: "Hobby 2 - Title",
                        type: "text",
                        value: "Cycling",
                        selector: ".desktop-hobby-card:nth-child(2) h3",
                        maxLength: 50
                    },
                    {
                        id: "hobby2_desc",
                        label: "Hobby 2 - Description",
                        type: "text",
                        value: "Exploring outdoors on two wheels",
                        selector: ".desktop-hobby-card:nth-child(2) p",
                        maxLength: 100
                    },
                    {
                        id: "hobby3_title",
                        label: "Hobby 3 - Title",
                        type: "text",
                        value: "Reading",
                        selector: ".desktop-hobby-card:nth-child(3) h3",
                        maxLength: 50
                    },
                    {
                        id: "hobby3_desc",
                        label: "Hobby 3 - Description",
                        type: "text",
                        value: "Books and technology articles",
                        selector: ".desktop-hobby-card:nth-child(3) p",
                        maxLength: 100
                    },
                    {
                        id: "hobby4_title",
                        label: "Hobby 4 - Title",
                        type: "text",
                        value: "Gaming",
                        selector: ".desktop-hobby-card:nth-child(4) h3",
                        maxLength: 50
                    },
                    {
                        id: "hobby4_desc",
                        label: "Hobby 4 - Description",
                        type: "text",
                        value: "Strategic and simulation games",
                        selector: ".desktop-hobby-card:nth-child(4) p",
                        maxLength: 100
                    }
                ]
            }
        ]
    },
    
    // Projects Page
    projects: {
        title: "Projects Gallery - Complete",
        description: "All project sections with titles and descriptions",
        filePath: "Projects Code/projects.html",
        sections: [
            {
                id: "hero",
                name: "Projects Hero Section",
                icon: "fa-rocket",
                fields: [
                    {
                        id: "page_title",
                        label: "Page Title",
                        type: "text",
                        value: "Projects Gallery",
                        selector: ".projects-hero h1",
                        maxLength: 50
                    },
                    {
                        id: "page_tagline",
                        label: "Hero Tagline",
                        type: "textarea",
                        value: "Explore my engineering projects including SOLIDWORKS CAD models, Arduino circuits, electronics tools, and web development work",
                        selector: ".projects-hero .hero-tagline",
                        maxLength: 200
                    }
                ]
            },
            {
                id: "solidworks_section",
                name: "SOLIDWORKS Projects Section",
                icon: "fa-cube",
                fields: [
                    {
                        id: "solidworks_title",
                        label: "Section Title",
                        type: "text",
                        value: "SOLIDWORKS Projects",
                        selector: "#solidworks-card h2",
                        maxLength: 50
                    },
                    {
                        id: "solidworks_subtitle",
                        label: "Subtitle/Tagline",
                        type: "text",
                        value: "3D CAD Modeling & Mechanical Design",
                        selector: "#solidworks-card .card-subtitle",
                        maxLength: 100
                    },
                    {
                        id: "solidworks_description",
                        label: "Description",
                        type: "textarea",
                        value: "Professional 3D CAD models, assemblies, and engineering designs created with SOLIDWORKS. Includes mechanical parts, assemblies, and simulation projects.",
                        selector: "#solidworks-card .card-description",
                        maxLength: 300
                    }
                ]
            },
            {
                id: "arduino_section",
                name: "Arduino Projects Section",
                icon: "fa-microchip",
                fields: [
                    {
                        id: "arduino_title",
                        label: "Section Title",
                        type: "text",
                        value: "Arduino Projects",
                        selector: "#arduino-card h2",
                        maxLength: 50
                    },
                    {
                        id: "arduino_subtitle",
                        label: "Subtitle/Tagline",
                        type: "text",
                        value: "Embedded Systems & IoT Solutions",
                        selector: "#arduino-card .card-subtitle",
                        maxLength: 100
                    },
                    {
                        id: "arduino_description",
                        label: "Description",
                        type: "textarea",
                        value: "Embedded systems and IoT projects using Arduino. From basic circuits to advanced automation solutions with sensors and actuators.",
                        selector: "#arduino-card .card-description",
                        maxLength: 300
                    }
                ]
            },
            {
                id: "matlab_section",
                name: "MATLAB Projects Section",
                icon: "fa-chart-line",
                fields: [
                    {
                        id: "matlab_title",
                        label: "Section Title",
                        type: "text",
                        value: "MATLAB Projects",
                        selector: "#matlab-card h2",
                        maxLength: 50
                    },
                    {
                        id: "matlab_subtitle",
                        label: "Subtitle/Tagline",
                        type: "text",
                        value: "Simulations & Computational Analysis",
                        selector: "#matlab-card .card-subtitle",
                        maxLength: 100
                    },
                    {
                        id: "matlab_description",
                        label: "Description",
                        type: "textarea",
                        value: "Engineering simulations, mathematical modeling, and computational analysis using MATLAB. Includes data analysis and visualization projects.",
                        selector: "#matlab-card .card-description",
                        maxLength: 300
                    }
                ]
            },
            {
                id: "electronics_section",
                name: "Electronics Projects Section",
                icon: "fa-bolt",
                fields: [
                    {
                        id: "electronics_title",
                        label: "Section Title",
                        type: "text",
                        value: "Electronics Projects",
                        selector: "#electronics-card h2",
                        maxLength: 50
                    },
                    {
                        id: "electronics_subtitle",
                        label: "Subtitle/Tagline",
                        type: "text",
                        value: "Circuit Design & Component Guides",
                        selector: "#electronics-card .card-subtitle",
                        maxLength: 100
                    },
                    {
                        id: "electronics_description",
                        label: "Description",
                        type: "textarea",
                        value: "Circuit design projects and comprehensive electronic component guides. From basic circuits to advanced power electronics.",
                        selector: "#electronics-card .card-description",
                        maxLength: 300
                    }
                ]
            }
        ]
    },
    
    // Contact Page
    contact: {
        title: "Contact Page - Complete",
        description: "Contact form, information, and social links",
        filePath: "Contact/contact.html",
        sections: [
            {
                id: "header",
                name: "Contact Page Header",
                icon: "fa-paper-plane",
                fields: [
                    {
                        id: "page_title",
                        label: "Page Title",
                        type: "text",
                        value: "Get In Touch",
                        selector: ".section-title",
                        maxLength: 50
                    },
                    {
                        id: "page_subtitle",
                        label: "Subtitle",
                        type: "text",
                        value: "Let's connect and discuss opportunities",
                        selector: ".section-subtitle",
                        maxLength: 100
                    }
                ]
            },
            {
                id: "contact_form_labels",
                name: "Contact Form - Labels & Buttons",
                icon: "fa-envelope",
                fields: [
                    {
                        id: "form_name_label",
                        label: "Name Field - Label",
                        type: "text",
                        value: "Your Name",
                        selector: "label[for='name']",
                        maxLength: 50
                    },
                    {
                        id: "form_name_placeholder",
                        label: "Name Field - Placeholder",
                        type: "text",
                        value: "Enter your full name",
                        selector: "input[name='name']@placeholder",
                        maxLength: 100
                    },
                    {
                        id: "form_email_label",
                        label: "Email Field - Label",
                        type: "text",
                        value: "Your Email",
                        selector: "label[for='email']",
                        maxLength: 50
                    },
                    {
                        id: "form_email_placeholder",
                        label: "Email Field - Placeholder",
                        type: "text",
                        value: "Enter your email address",
                        selector: "input[name='email']@placeholder",
                        maxLength: 100
                    },
                    {
                        id: "form_subject_label",
                        label: "Subject Field - Label",
                        type: "text",
                        value: "Subject",
                        selector: "label[for='subject']",
                        maxLength: 50
                    },
                    {
                        id: "form_subject_placeholder",
                        label: "Subject Field - Placeholder",
                        type: "text",
                        value: "What's this about?",
                        selector: "input[name='subject']@placeholder",
                        maxLength: 100
                    },
                    {
                        id: "form_message_label",
                        label: "Message Field - Label",
                        type: "text",
                        value: "Your Message",
                        selector: "label[for='message']",
                        maxLength: 50
                    },
                    {
                        id: "form_message_placeholder",
                        label: "Message Field - Placeholder",
                        type: "text",
                        value: "Type your message here...",
                        selector: "textarea[name='message']@placeholder",
                        maxLength: 100
                    },
                    {
                        id: "form_submit_btn",
                        label: "Submit Button Text",
                        type: "text",
                        value: "Send Message",
                        selector: ".contact-form button[type='submit']",
                        maxLength: 30
                    },
                    {
                        id: "form_success_msg",
                        label: "Success Message",
                        type: "text",
                        value: "Message sent successfully!",
                        selector: ".form-success-message",
                        maxLength: 100
                    },
                    {
                        id: "form_error_msg",
                        label: "Error Message",
                        type: "text",
                        value: "Failed to send. Please try again.",
                        selector: ".form-error-message",
                        maxLength: 100
                    }
                ]
            },
            {
                id: "social_media",
                name: "Social Media Links",
                icon: "fa-share-alt",
                fields: [
                    {
                        id: "social_linkedin_label",
                        label: "LinkedIn - Label",
                        type: "text",
                        value: "LinkedIn",
                        selector: ".social-link[href*='linkedin'] .link-label",
                        maxLength: 50
                    },
                    {
                        id: "social_github_label",
                        label: "GitHub - Label",
                        type: "text",
                        value: "GitHub",
                        selector: ".social-link[href*='github'] .link-label",
                        maxLength: 50
                    },
                    {
                        id: "social_facebook_label",
                        label: "Facebook - Label",
                        type: "text",
                        value: "Facebook",
                        selector: ".social-link[href*='facebook'] .link-label",
                        maxLength: 50
                    },
                    {
                        id: "social_youtube_label",
                        label: "YouTube - Label",
                        type: "text",
                        value: "YouTube",
                        selector: ".social-link[href*='youtube'] .link-label",
                        maxLength: 50
                    },
                    {
                        id: "social_twitter_label",
                        label: "Twitter - Label",
                        type: "text",
                        value: "Twitter",
                        selector: ".social-link[href*='twitter'] .link-label",
                        maxLength: 50
                    },
                    {
                        id: "social_instagram_label",
                        label: "Instagram - Label",
                        type: "text",
                        value: "Instagram",
                        selector: ".social-link[href*='instagram'] .link-label",
                        maxLength: 50
                    },
                    {
                        id: "social_whatsapp_label",
                        label: "WhatsApp - Label",
                        type: "text",
                        value: "WhatsApp",
                        selector: ".social-link[href*='whatsapp'] .link-label",
                        maxLength: 50
                    }
                ]
            },
            {
                id: "contact_info",
                name: "Contact Information",
                icon: "fa-address-card",
                fields: [
                    {
                        id: "email",
                        label: "Email Address",
                        type: "email",
                        value: "mdakhinoorislam@gmail.com",
                        selector: ".contact-email",
                        maxLength: 100
                    },
                    {
                        id: "phone",
                        label: "Phone Number",
                        type: "text",
                        value: "+880 1724-812042",
                        selector: ".contact-phone",
                        maxLength: 20
                    },
                    {
                        id: "location",
                        label: "Location",
                        type: "text",
                        value: "Khulna, Bangladesh",
                        selector: ".contact-location",
                        maxLength: 100
                    },
                    {
                        id: "email_label",
                        label: "Email Label",
                        type: "text",
                        value: "Email:",
                        selector: ".contact-info-label.email",
                        maxLength: 30
                    },
                    {
                        id: "phone_label",
                        label: "Phone Label",
                        type: "text",
                        value: "Phone:",
                        selector: ".contact-info-label.phone",
                        maxLength: 30
                    },
                    {
                        id: "location_label",
                        label: "Location Label",
                        type: "text",
                        value: "Location:",
                        selector: ".contact-info-label.location",
                        maxLength: 30
                    }
                ]
            }
        ]
    },
    
    // Content Studio Page
    contentStudio: {
        title: "Content Studio Hub - Complete",
        description: "Content categories and hub information",
        filePath: "Content Studio/hub.html",
        sections: [
            {
                id: "hero",
                name: "Content Studio Header",
                icon: "fa-layer-group",
                fields: [
                    {
                        id: "page_title",
                        label: "Page Title",
                        type: "text",
                        value: "Content Studio",
                        selector: ".studio-hero-title",
                        maxLength: 50
                    },
                    {
                        id: "page_tagline",
                        label: "Tagline",
                        type: "text",
                        value: "Educational Resources & Knowledge Hub",
                        selector: ".studio-hero-tagline",
                        maxLength: 100
                    },
                    {
                        id: "page_description",
                        label: "Hero Description",
                        type: "textarea",
                        value: "Access curated educational content including blog posts, video tutorials, books, and research papers",
                        selector: ".studio-hero-description",
                        maxLength: 200
                    }
                ]
            },
            {
                id: "categories",
                name: "Content Categories",
                icon: "fa-grid",
                fields: [
                    {
                        id: "blog_title",
                        label: "Blog Posts - Title",
                        type: "text",
                        value: "Written Posts",
                        selector: ".category-card[data-type='blog'] h3",
                        maxLength: 50
                    },
                    {
                        id: "blog_description",
                        label: "Blog Posts - Description",
                        type: "textarea",
                        value: "Technical articles, tutorials, and engineering insights",
                        selector: ".category-card[data-type='blog'] .category-description",
                        maxLength: 150
                    },
                    {
                        id: "blog_button",
                        label: "Blog Posts - Button Text",
                        type: "text",
                        value: "Read Articles",
                        selector: ".category-card[data-type='blog'] .category-button",
                        maxLength: 30
                    },
                    {
                        id: "video_title",
                        label: "Video Content - Title",
                        type: "text",
                        value: "Video Tutorials",
                        selector: ".category-card[data-type='video'] h3",
                        maxLength: 50
                    },
                    {
                        id: "video_description",
                        label: "Video Content - Description",
                        type: "textarea",
                        value: "Hands-on video guides for Arduino, SOLIDWORKS, and more",
                        selector: ".category-card[data-type='video'] .category-description",
                        maxLength: 150
                    },
                    {
                        id: "video_button",
                        label: "Video Content - Button Text",
                        type: "text",
                        value: "Watch Videos",
                        selector: ".category-card[data-type='video'] .category-button",
                        maxLength: 30
                    },
                    {
                        id: "courses_title",
                        label: "Educational Videos - Title",
                        type: "text",
                        value: "Educational Courses",
                        selector: ".category-card[data-type='courses'] h3",
                        maxLength: 50
                    },
                    {
                        id: "courses_description",
                        label: "Educational Videos - Description",
                        type: "textarea",
                        value: "Structured learning paths and comprehensive course content",
                        selector: ".category-card[data-type='courses'] .category-description",
                        maxLength: 150
                    },
                    {
                        id: "courses_button",
                        label: "Educational Videos - Button Text",
                        type: "text",
                        value: "Browse Courses",
                        selector: ".category-card[data-type='courses'] .category-button",
                        maxLength: 30
                    },
                    {
                        id: "books_title",
                        label: "Books/PDFs - Title",
                        type: "text",
                        value: "Books & PDFs",
                        selector: ".category-card[data-type='books'] h3",
                        maxLength: 50
                    },
                    {
                        id: "books_description",
                        label: "Books/PDFs - Description",
                        type: "textarea",
                        value: "Engineering textbooks, reference materials, and documentation",
                        selector: ".category-card[data-type='books'] .category-description",
                        maxLength: 150
                    },
                    {
                        id: "books_button",
                        label: "Books/PDFs - Button Text",
                        type: "text",
                        value: "View Library",
                        selector: ".category-card[data-type='books'] .category-button",
                        maxLength: 30
                    },
                    {
                        id: "papers_title",
                        label: "Research Papers - Title",
                        type: "text",
                        value: "Research Papers",
                        selector: ".category-card[data-type='papers'] h3",
                        maxLength: 50
                    },
                    {
                        id: "papers_description",
                        label: "Research Papers - Description",
                        type: "textarea",
                        value: "Academic papers and technical research documents",
                        selector: ".category-card[data-type='papers'] .category-description",
                        maxLength: 150
                    },
                    {
                        id: "papers_button",
                        label: "Research Papers - Button Text",
                        type: "text",
                        value: "Read Papers",
                        selector: ".category-card[data-type='papers'] .category-button",
                        maxLength: 30
                    }
                ]
            },
            {
                id: "stats",
                name: "Content Statistics",
                icon: "fa-chart-bar",
                fields: [
                    {
                        id: "total_posts_label",
                        label: "Total Posts - Label",
                        type: "text",
                        value: "Written Posts",
                        selector: ".stat-card:nth-child(1) .stat-label",
                        maxLength: 50
                    },
                    {
                        id: "total_videos_label",
                        label: "Total Videos - Label",
                        type: "text",
                        value: "Video Tutorials",
                        selector: ".stat-card:nth-child(2) .stat-label",
                        maxLength: 50
                    },
                    {
                        id: "total_books_label",
                        label: "Total Books - Label",
                        type: "text",
                        value: "Books & PDFs",
                        selector: ".stat-card:nth-child(3) .stat-label",
                        maxLength: 50
                    },
                    {
                        id: "total_papers_label",
                        label: "Total Papers - Label",
                        type: "text",
                        value: "Research Papers",
                        selector: ".stat-card:nth-child(4) .stat-label",
                        maxLength: 50
                    }
                ]
            }
        ]
    },
    
    // Certificates Viewer Page
    certificates: {
        title: "Certificates Viewer - Complete",
        description: "Professional certificates and achievements showcase",
        filePath: "About me/certificates-viewer.html",
        sections: [
            {
                id: "page_header",
                name: "Page Header",
                icon: "fa-certificate",
                fields: [
                    {
                        id: "page_title",
                        label: "Page Title",
                        type: "text",
                        value: "Certificates & Achievements",
                        selector: ".header-title h1",
                        maxLength: 100
                    },
                    {
                        id: "back_button",
                        label: "Back Button Text",
                        type: "text",
                        value: "Back to About",
                        selector: ".back-btn",
                        maxLength: 30
                    }
                ]
            },
            {
                id: "stats_section",
                name: "Statistics Bar",
                icon: "fa-chart-bar",
                fields: [
                    {
                        id: "total_certs_label",
                        label: "Total Certificates - Label",
                        type: "text",
                        value: "Total Certificates",
                        selector: ".stat-item:nth-child(1) .stat-label",
                        maxLength: 50
                    },
                    {
                        id: "medical_certs_label",
                        label: "Medical Certificates - Label",
                        type: "text",
                        value: "Medical",
                        selector: ".stat-item:nth-child(2) .stat-label",
                        maxLength: 50
                    },
                    {
                        id: "skill_certs_label",
                        label: "Skill Certificates - Label",
                        type: "text",
                        value: "Professional Skills",
                        selector: ".stat-item:nth-child(3) .stat-label",
                        maxLength: 50
                    }
                ]
            },
            {
                id: "filter_section",
                name: "Filter & Search",
                icon: "fa-filter",
                fields: [
                    {
                        id: "search_placeholder",
                        label: "Search Placeholder",
                        type: "text",
                        value: "Search certificates...",
                        selector: ".search-box input@placeholder",
                        maxLength: 100
                    },
                    {
                        id: "filter_all",
                        label: "Filter - All",
                        type: "text",
                        value: "All Certificates",
                        selector: ".filter-btn[data-filter='all']",
                        maxLength: 30
                    },
                    {
                        id: "filter_medical",
                        label: "Filter - Medical",
                        type: "text",
                        value: "Medical",
                        selector: ".filter-btn[data-filter='medical']",
                        maxLength: 30
                    },
                    {
                        id: "filter_skill",
                        label: "Filter - Skills",
                        type: "text",
                        value: "Skills",
                        selector: ".filter-btn[data-filter='skill']",
                        maxLength: 30
                    }
                ]
            },
            {
                id: "certificate_cards",
                name: "Certificate Card Labels",
                icon: "fa-id-card",
                fields: [
                    {
                        id: "view_button",
                        label: "View Certificate Button",
                        type: "text",
                        value: "View Certificate",
                        selector: ".cert-card .view-btn",
                        maxLength: 30
                    },
                    {
                        id: "download_button",
                        label: "Download Button",
                        type: "text",
                        value: "Download",
                        selector: ".cert-card .download-btn",
                        maxLength: 30
                    },
                    {
                        id: "issued_by_label",
                        label: "Issued By - Label",
                        type: "text",
                        value: "Issued by:",
                        selector: ".cert-issuer-label",
                        maxLength: 30
                    },
                    {
                        id: "date_label",
                        label: "Date - Label",
                        type: "text",
                        value: "Date:",
                        selector: ".cert-date-label",
                        maxLength: 30
                    },
                    {
                        id: "category_label",
                        label: "Category - Label",
                        type: "text",
                        value: "Category:",
                        selector: ".cert-category-label",
                        maxLength: 30
                    }
                ]
            },
            {
                id: "modal_section",
                name: "Certificate Viewer Modal",
                icon: "fa-window-maximize",
                fields: [
                    {
                        id: "modal_close_btn",
                        label: "Close Button",
                        type: "text",
                        value: "Close",
                        selector: ".modal-close-btn",
                        maxLength: 20
                    },
                    {
                        id: "modal_prev_btn",
                        label: "Previous Button",
                        type: "text",
                        value: "Previous",
                        selector: ".modal-prev-btn",
                        maxLength: 20
                    },
                    {
                        id: "modal_next_btn",
                        label: "Next Button",
                        type: "text",
                        value: "Next",
                        selector: ".modal-next-btn",
                        maxLength: 20
                    }
                ]
            }
        ]
    },
    
    // Written Posts (Blog) Listing Page
    blogPosts: {
        title: "Written Posts (Blog) - Complete",
        description: "Blog listing page with search, filters, and post cards",
        filePath: "Content Studio/written-posts/post-listing-new.html",
        sections: [
            {
                id: "page_header",
                name: "Page Header",
                icon: "fa-blog",
                fields: [
                    {
                        id: "page_title",
                        label: "Page Title",
                        type: "text",
                        value: "Written Posts",
                        selector: ".page-title",
                        maxLength: 100
                    },
                    {
                        id: "page_subtitle",
                        label: "Page Subtitle/Description",
                        type: "textarea",
                        value: "Engineering tutorials, project guides, and tech insights",
                        selector: ".page-subtitle",
                        maxLength: 200
                    },
                    {
                        id: "back_button",
                        label: "Back Button Text",
                        type: "text",
                        value: "Back to Hub",
                        selector: ".back-btn",
                        maxLength: 30
                    }
                ]
            },
            {
                id: "search_filter",
                name: "Search & Filter Section",
                icon: "fa-search",
                fields: [
                    {
                        id: "search_placeholder",
                        label: "Search Placeholder",
                        type: "text",
                        value: "Search posts by title, tags, or content...",
                        selector: ".search-input@placeholder",
                        maxLength: 100
                    },
                    {
                        id: "search_button",
                        label: "Search Button",
                        type: "text",
                        value: "Search",
                        selector: ".search-btn",
                        maxLength: 30
                    },
                    {
                        id: "filter_label",
                        label: "Filter By - Label",
                        type: "text",
                        value: "Filter by Category:",
                        selector: ".filter-label",
                        maxLength: 50
                    },
                    {
                        id: "filter_all",
                        label: "Filter - All Posts",
                        type: "text",
                        value: "All Posts",
                        selector: ".filter-btn[data-category='all']",
                        maxLength: 30
                    },
                    {
                        id: "filter_arduino",
                        label: "Filter - Arduino",
                        type: "text",
                        value: "Arduino",
                        selector: ".filter-btn[data-category='arduino']",
                        maxLength: 30
                    },
                    {
                        id: "filter_solidworks",
                        label: "Filter - SolidWorks",
                        type: "text",
                        value: "SolidWorks",
                        selector: ".filter-btn[data-category='solidworks']",
                        maxLength: 30
                    },
                    {
                        id: "filter_electronics",
                        label: "Filter - Electronics",
                        type: "text",
                        value: "Electronics",
                        selector: ".filter-btn[data-category='electronics']",
                        maxLength: 30
                    },
                    {
                        id: "filter_programming",
                        label: "Filter - Programming",
                        type: "text",
                        value: "Programming",
                        selector: ".filter-btn[data-category='programming']",
                        maxLength: 30
                    },
                    {
                        id: "filter_personal",
                        label: "Filter - Personal",
                        type: "text",
                        value: "Personal",
                        selector: ".filter-btn[data-category='personal']",
                        maxLength: 30
                    }
                ]
            },
            {
                id: "sort_section",
                name: "Sort Options",
                icon: "fa-sort",
                fields: [
                    {
                        id: "sort_label",
                        label: "Sort By - Label",
                        type: "text",
                        value: "Sort by:",
                        selector: ".sort-label",
                        maxLength: 30
                    },
                    {
                        id: "sort_newest",
                        label: "Sort - Newest First",
                        type: "text",
                        value: "Newest First",
                        selector: ".sort-option[data-sort='newest']",
                        maxLength: 30
                    },
                    {
                        id: "sort_oldest",
                        label: "Sort - Oldest First",
                        type: "text",
                        value: "Oldest First",
                        selector: ".sort-option[data-sort='oldest']",
                        maxLength: 30
                    },
                    {
                        id: "sort_popular",
                        label: "Sort - Most Popular",
                        type: "text",
                        value: "Most Popular",
                        selector: ".sort-option[data-sort='popular']",
                        maxLength: 30
                    }
                ]
            },
            {
                id: "post_cards",
                name: "Post Card Labels",
                icon: "fa-newspaper",
                fields: [
                    {
                        id: "read_more_btn",
                        label: "Read More Button",
                        type: "text",
                        value: "Read Full Post",
                        selector: ".post-card .read-more-btn",
                        maxLength: 30
                    },
                    {
                        id: "reading_time_label",
                        label: "Reading Time - Label",
                        type: "text",
                        value: "min read",
                        selector: ".reading-time-label",
                        maxLength: 20
                    },
                    {
                        id: "author_label",
                        label: "Author - Label",
                        type: "text",
                        value: "By",
                        selector: ".post-author-label",
                        maxLength: 20
                    },
                    {
                        id: "tags_label",
                        label: "Tags - Label",
                        type: "text",
                        value: "Tags:",
                        selector: ".post-tags-label",
                        maxLength: 20
                    }
                ]
            },
            {
                id: "pagination",
                name: "Pagination Controls",
                icon: "fa-list-ol",
                fields: [
                    {
                        id: "prev_page_btn",
                        label: "Previous Page Button",
                        type: "text",
                        value: "Previous",
                        selector: ".pagination-prev",
                        maxLength: 20
                    },
                    {
                        id: "next_page_btn",
                        label: "Next Page Button",
                        type: "text",
                        value: "Next",
                        selector: ".pagination-next",
                        maxLength: 20
                    },
                    {
                        id: "page_info",
                        label: "Page Info Text",
                        type: "text",
                        value: "Page",
                        selector: ".page-info-label",
                        maxLength: 20
                    }
                ]
            }
        ]
    },
    
    // Video Gallery Page
    videoGallery: {
        title: "Video Gallery - Complete",
        description: "Video blog gallery with filters and YouTube integration",
        filePath: "Content Studio/video-content/video-gallery.html",
        sections: [
            {
                id: "hero_section",
                name: "Gallery Hero Section",
                icon: "fa-video",
                fields: [
                    {
                        id: "page_title",
                        label: "Page Title",
                        type: "text",
                        value: "Video Blog Gallery",
                        selector: ".gallery-hero h1",
                        maxLength: 100
                    },
                    {
                        id: "page_subtitle",
                        label: "Subtitle",
                        type: "text",
                        value: "Browse all video tutorials and educational content",
                        selector: ".gallery-hero .subtitle",
                        maxLength: 150
                    },
                    {
                        id: "back_button",
                        label: "Back Button Text",
                        type: "text",
                        value: "Back to Hub",
                        selector: ".back-btn",
                        maxLength: 30
                    }
                ]
            },
            {
                id: "stats_bar",
                name: "Gallery Statistics",
                icon: "fa-chart-line",
                fields: [
                    {
                        id: "total_videos_label",
                        label: "Total Videos - Label",
                        type: "text",
                        value: "Total Videos",
                        selector: ".gallery-stats .stat-item:nth-child(1) .stat-label",
                        maxLength: 30
                    },
                    {
                        id: "total_views_label",
                        label: "Total Views - Label",
                        type: "text",
                        value: "Total Views",
                        selector: ".gallery-stats .stat-item:nth-child(2) .stat-label",
                        maxLength: 30
                    },
                    {
                        id: "total_duration_label",
                        label: "Total Duration - Label",
                        type: "text",
                        value: "Watch Time",
                        selector: ".gallery-stats .stat-item:nth-child(3) .stat-label",
                        maxLength: 30
                    }
                ]
            },
            {
                id: "search_filter",
                name: "Search & Filter Section",
                icon: "fa-filter",
                fields: [
                    {
                        id: "search_placeholder",
                        label: "Search Placeholder",
                        type: "text",
                        value: "Search videos by title or description...",
                        selector: ".video-search-input@placeholder",
                        maxLength: 100
                    },
                    {
                        id: "search_button",
                        label: "Search Button",
                        type: "text",
                        value: "Search",
                        selector: ".search-btn",
                        maxLength: 30
                    },
                    {
                        id: "filter_label",
                        label: "Category Filter - Label",
                        type: "text",
                        value: "Category:",
                        selector: ".category-filter-label",
                        maxLength: 30
                    },
                    {
                        id: "filter_all",
                        label: "Filter - All Videos",
                        type: "text",
                        value: "All Videos",
                        selector: ".category-btn[data-category='all']",
                        maxLength: 30
                    },
                    {
                        id: "filter_arduino",
                        label: "Filter - Arduino",
                        type: "text",
                        value: "Arduino",
                        selector: ".category-btn[data-category='arduino']",
                        maxLength: 30
                    },
                    {
                        id: "filter_solidworks",
                        label: "Filter - SolidWorks",
                        type: "text",
                        value: "SolidWorks",
                        selector: ".category-btn[data-category='solidworks']",
                        maxLength: 30
                    },
                    {
                        id: "filter_electronics",
                        label: "Filter - Electronics",
                        type: "text",
                        value: "Electronics",
                        selector: ".category-btn[data-category='electronics']",
                        maxLength: 30
                    },
                    {
                        id: "filter_programming",
                        label: "Filter - Programming",
                        type: "text",
                        value: "Programming",
                        selector: ".category-btn[data-category='programming']",
                        maxLength: 30
                    }
                ]
            },
            {
                id: "video_cards",
                name: "Video Card Labels",
                icon: "fa-play-circle",
                fields: [
                    {
                        id: "watch_button",
                        label: "Watch Video Button",
                        type: "text",
                        value: "Watch Now",
                        selector: ".video-card .watch-btn",
                        maxLength: 30
                    },
                    {
                        id: "duration_label",
                        label: "Duration - Label",
                        type: "text",
                        value: "Duration:",
                        selector: ".video-duration-label",
                        maxLength: 20
                    },
                    {
                        id: "views_label",
                        label: "Views - Label",
                        type: "text",
                        value: "views",
                        selector: ".video-views-label",
                        maxLength: 20
                    },
                    {
                        id: "uploaded_label",
                        label: "Uploaded - Label",
                        type: "text",
                        value: "Uploaded:",
                        selector: ".video-upload-label",
                        maxLength: 20
                    }
                ]
            },
            {
                id: "load_more",
                name: "Load More Section",
                icon: "fa-arrow-down",
                fields: [
                    {
                        id: "load_more_btn",
                        label: "Load More Button",
                        type: "text",
                        value: "Load More Videos",
                        selector: ".load-more-btn",
                        maxLength: 30
                    },
                    {
                        id: "loading_text",
                        label: "Loading Text",
                        type: "text",
                        value: "Loading...",
                        selector: ".loading-text",
                        maxLength: 30
                    },
                    {
                        id: "no_videos_msg",
                        label: "No Videos Message",
                        type: "text",
                        value: "No videos found",
                        selector: ".no-videos-message",
                        maxLength: 50
                    }
                ]
            }
        ]
    },
    
    // Books & PDFs Listing Page
    booksLibrary: {
        title: "Books & PDFs Library - Complete",
        description: "Digital library with books, PDFs, and reading materials",
        filePath: "Content Studio/books-pdfs/book-listing-new.html",
        sections: [
            {
                id: "page_header",
                name: "Page Header",
                icon: "fa-book",
                fields: [
                    {
                        id: "page_title",
                        label: "Page Title",
                        type: "text",
                        value: "Books & PDFs",
                        selector: ".page-header h1",
                        maxLength: 100
                    },
                    {
                        id: "page_subtitle",
                        label: "Subtitle",
                        type: "text",
                        value: "Digital Library - Engineering Books & Resources",
                        selector: ".page-header .subtitle",
                        maxLength: 150
                    },
                    {
                        id: "back_button",
                        label: "Back Button Text",
                        type: "text",
                        value: "Back to Hub",
                        selector: ".back-to-hub",
                        maxLength: 30
                    },
                    {
                        id: "total_count_label",
                        label: "Total Count Label",
                        type: "text",
                        value: "Total Books Available",
                        selector: ".total-count",
                        maxLength: 50
                    }
                ]
            },
            {
                id: "search_filter",
                name: "Search & Filter Section",
                icon: "fa-search",
                fields: [
                    {
                        id: "search_placeholder",
                        label: "Search Placeholder",
                        type: "text",
                        value: "Search books by title, author, or topic...",
                        selector: ".search-input@placeholder",
                        maxLength: 100
                    },
                    {
                        id: "search_button",
                        label: "Search Button",
                        type: "text",
                        value: "Search",
                        selector: ".search-btn",
                        maxLength: 30
                    },
                    {
                        id: "filter_label",
                        label: "Category Filter - Label",
                        type: "text",
                        value: "Filter by Category:",
                        selector: ".filter-label",
                        maxLength: 50
                    },
                    {
                        id: "filter_all",
                        label: "Filter - All Books",
                        type: "text",
                        value: "All Books",
                        selector: ".filter-btn[data-category='all']",
                        maxLength: 30
                    },
                    {
                        id: "filter_arduino",
                        label: "Filter - Arduino",
                        type: "text",
                        value: "Arduino",
                        selector: ".filter-btn[data-category='arduino']",
                        maxLength: 30
                    },
                    {
                        id: "filter_electronics",
                        label: "Filter - Electronics",
                        type: "text",
                        value: "Electronics",
                        selector: ".filter-btn[data-category='electronics']",
                        maxLength: 30
                    },
                    {
                        id: "filter_programming",
                        label: "Filter - Programming",
                        type: "text",
                        value: "Programming",
                        selector: ".filter-btn[data-category='programming']",
                        maxLength: 30
                    },
                    {
                        id: "filter_cad",
                        label: "Filter - CAD/Design",
                        type: "text",
                        value: "CAD & Design",
                        selector: ".filter-btn[data-category='cad']",
                        maxLength: 30
                    },
                    {
                        id: "filter_engineering",
                        label: "Filter - Engineering",
                        type: "text",
                        value: "Engineering",
                        selector: ".filter-btn[data-category='engineering']",
                        maxLength: 30
                    }
                ]
            },
            {
                id: "book_cards",
                name: "Book Card Labels",
                icon: "fa-book-open",
                fields: [
                    {
                        id: "read_button",
                        label: "Read Book Button",
                        type: "text",
                        value: "Read Online",
                        selector: ".book-card .read-btn",
                        maxLength: 30
                    },
                    {
                        id: "download_button",
                        label: "Download Button",
                        type: "text",
                        value: "Download PDF",
                        selector: ".book-card .download-btn",
                        maxLength: 30
                    },
                    {
                        id: "author_label",
                        label: "Author - Label",
                        type: "text",
                        value: "Author:",
                        selector: ".book-author-label",
                        maxLength: 20
                    },
                    {
                        id: "pages_label",
                        label: "Pages - Label",
                        type: "text",
                        value: "Pages:",
                        selector: ".book-pages-label",
                        maxLength: 20
                    },
                    {
                        id: "size_label",
                        label: "File Size - Label",
                        type: "text",
                        value: "Size:",
                        selector: ".book-size-label",
                        maxLength: 20
                    },
                    {
                        id: "format_label",
                        label: "Format - Label",
                        type: "text",
                        value: "Format:",
                        selector: ".book-format-label",
                        maxLength: 20
                    }
                ]
            },
            {
                id: "no_results",
                name: "Empty State Messages",
                icon: "fa-exclamation-circle",
                fields: [
                    {
                        id: "no_books_msg",
                        label: "No Books Found Message",
                        type: "text",
                        value: "No books found matching your search",
                        selector: ".no-books-message",
                        maxLength: 100
                    },
                    {
                        id: "loading_text",
                        label: "Loading Text",
                        type: "text",
                        value: "Loading books...",
                        selector: ".loading-text",
                        maxLength: 30
                    }
                ]
            }
        ]
    },
    
    // Educational Courses Listing Page
    coursesListing: {
        title: "Educational Courses - Complete",
        description: "Course catalog with video lessons and structured learning",
        filePath: "Content Studio/educational-videos/course-listing-new.html",
        sections: [
            {
                id: "page_header",
                name: "Page Header",
                icon: "fa-graduation-cap",
                fields: [
                    {
                        id: "page_title",
                        label: "Page Title",
                        type: "text",
                        value: "Educational Videos",
                        selector: ".page-header h1",
                        maxLength: 100
                    },
                    {
                        id: "page_subtitle",
                        label: "Subtitle",
                        type: "text",
                        value: "Comprehensive Courses & Video Tutorials",
                        selector: ".page-header .subtitle",
                        maxLength: 150
                    },
                    {
                        id: "back_button",
                        label: "Back Button Text",
                        type: "text",
                        value: "Back to Hub",
                        selector: ".back-to-hub",
                        maxLength: 30
                    }
                ]
            },
            {
                id: "stats_section",
                name: "Course Statistics",
                icon: "fa-chart-pie",
                fields: [
                    {
                        id: "total_courses_label",
                        label: "Total Courses - Label",
                        type: "text",
                        value: "Total Courses",
                        selector: ".stat-item:nth-child(1) .stat-label",
                        maxLength: 30
                    },
                    {
                        id: "total_lessons_label",
                        label: "Total Lessons - Label",
                        type: "text",
                        value: "Total Lessons",
                        selector: ".stat-item:nth-child(2) .stat-label",
                        maxLength: 30
                    },
                    {
                        id: "total_duration_label",
                        label: "Total Duration - Label",
                        type: "text",
                        value: "Learning Hours",
                        selector: ".stat-item:nth-child(3) .stat-label",
                        maxLength: 30
                    }
                ]
            },
            {
                id: "search_filter",
                name: "Search & Filter Section",
                icon: "fa-filter",
                fields: [
                    {
                        id: "search_placeholder",
                        label: "Search Placeholder",
                        type: "text",
                        value: "Search courses by title or topic...",
                        selector: ".search-input@placeholder",
                        maxLength: 100
                    },
                    {
                        id: "search_button",
                        label: "Search Button",
                        type: "text",
                        value: "Search",
                        selector: ".search-btn",
                        maxLength: 30
                    },
                    {
                        id: "category_filter_label",
                        label: "Category Filter - Label",
                        type: "text",
                        value: "Category:",
                        selector: ".category-filter-label",
                        maxLength: 30
                    },
                    {
                        id: "filter_all",
                        label: "Filter - All Courses",
                        type: "text",
                        value: "All Courses",
                        selector: ".category-btn[data-category='all']",
                        maxLength: 30
                    },
                    {
                        id: "filter_arduino",
                        label: "Filter - Arduino",
                        type: "text",
                        value: "Arduino",
                        selector: ".category-btn[data-category='arduino']",
                        maxLength: 30
                    },
                    {
                        id: "filter_solidworks",
                        label: "Filter - SolidWorks",
                        type: "text",
                        value: "SolidWorks",
                        selector: ".category-btn[data-category='solidworks']",
                        maxLength: 30
                    },
                    {
                        id: "filter_programming",
                        label: "Filter - Programming",
                        type: "text",
                        value: "Programming",
                        selector: ".category-btn[data-category='programming']",
                        maxLength: 30
                    },
                    {
                        id: "difficulty_filter_label",
                        label: "Difficulty Filter - Label",
                        type: "text",
                        value: "Difficulty:",
                        selector: ".difficulty-filter-label",
                        maxLength: 30
                    },
                    {
                        id: "filter_beginner",
                        label: "Filter - Beginner",
                        type: "text",
                        value: "Beginner",
                        selector: ".difficulty-btn[data-level='beginner']",
                        maxLength: 30
                    },
                    {
                        id: "filter_intermediate",
                        label: "Filter - Intermediate",
                        type: "text",
                        value: "Intermediate",
                        selector: ".difficulty-btn[data-level='intermediate']",
                        maxLength: 30
                    },
                    {
                        id: "filter_advanced",
                        label: "Filter - Advanced",
                        type: "text",
                        value: "Advanced",
                        selector: ".difficulty-btn[data-level='advanced']",
                        maxLength: 30
                    }
                ]
            },
            {
                id: "course_cards",
                name: "Course Card Labels",
                icon: "fa-chalkboard-teacher",
                fields: [
                    {
                        id: "enroll_button",
                        label: "Enroll/Start Button",
                        type: "text",
                        value: "Start Learning",
                        selector: ".course-card .enroll-btn",
                        maxLength: 30
                    },
                    {
                        id: "lessons_label",
                        label: "Lessons Count - Label",
                        type: "text",
                        value: "Lessons",
                        selector: ".course-lessons-label",
                        maxLength: 20
                    },
                    {
                        id: "duration_label",
                        label: "Duration - Label",
                        type: "text",
                        value: "Duration:",
                        selector: ".course-duration-label",
                        maxLength: 20
                    },
                    {
                        id: "instructor_label",
                        label: "Instructor - Label",
                        type: "text",
                        value: "Instructor:",
                        selector: ".course-instructor-label",
                        maxLength: 20
                    },
                    {
                        id: "level_label",
                        label: "Level/Difficulty - Label",
                        type: "text",
                        value: "Level:",
                        selector: ".course-level-label",
                        maxLength: 20
                    }
                ]
            },
            {
                id: "empty_state",
                name: "Empty State & Loading",
                icon: "fa-hourglass",
                fields: [
                    {
                        id: "no_courses_msg",
                        label: "No Courses Message",
                        type: "text",
                        value: "No courses found",
                        selector: ".no-courses-message",
                        maxLength: 50
                    },
                    {
                        id: "loading_text",
                        label: "Loading Text",
                        type: "text",
                        value: "Loading courses...",
                        selector: ".loading-text",
                        maxLength: 30
                    }
                ]
            }
        ]
    },
    
    // Research Papers Listing Page
    researchPapers: {
        title: "Research Papers - Complete",
        description: "Academic publications and research paper repository",
        filePath: "Content Studio/research-papers/paper-listing-new.html",
        sections: [
            {
                id: "page_header",
                name: "Page Header",
                icon: "fa-file-alt",
                fields: [
                    {
                        id: "page_title",
                        label: "Page Title",
                        type: "text",
                        value: "Research Papers",
                        selector: ".page-header h1",
                        maxLength: 100
                    },
                    {
                        id: "page_subtitle",
                        label: "Subtitle",
                        type: "text",
                        value: "Academic Publications & Technical Papers",
                        selector: ".page-header .subtitle",
                        maxLength: 150
                    },
                    {
                        id: "back_button",
                        label: "Back Button Text",
                        type: "text",
                        value: "Back to Hub",
                        selector: ".back-to-hub",
                        maxLength: 30
                    }
                ]
            },
            {
                id: "search_filter",
                name: "Search & Advanced Filters",
                icon: "fa-search",
                fields: [
                    {
                        id: "search_placeholder",
                        label: "Search Placeholder",
                        type: "text",
                        value: "Search papers by title, author, or keywords...",
                        selector: ".search-input@placeholder",
                        maxLength: 100
                    },
                    {
                        id: "search_button",
                        label: "Search Button",
                        type: "text",
                        value: "Search",
                        selector: ".search-btn",
                        maxLength: 30
                    },
                    {
                        id: "filter_label",
                        label: "Filter By - Label",
                        type: "text",
                        value: "Filter by Topic:",
                        selector: ".filter-label",
                        maxLength: 50
                    },
                    {
                        id: "filter_all",
                        label: "Filter - All Papers",
                        type: "text",
                        value: "All Papers",
                        selector: ".filter-btn[data-topic='all']",
                        maxLength: 30
                    },
                    {
                        id: "filter_arduino",
                        label: "Filter - Arduino/IoT",
                        type: "text",
                        value: "Arduino & IoT",
                        selector: ".filter-btn[data-topic='arduino']",
                        maxLength: 30
                    },
                    {
                        id: "filter_renewable",
                        label: "Filter - Renewable Energy",
                        type: "text",
                        value: "Renewable Energy",
                        selector: ".filter-btn[data-topic='renewable']",
                        maxLength: 30
                    },
                    {
                        id: "filter_ai",
                        label: "Filter - AI/ML",
                        type: "text",
                        value: "AI & Machine Learning",
                        selector: ".filter-btn[data-topic='ai']",
                        maxLength: 30
                    },
                    {
                        id: "filter_robotics",
                        label: "Filter - Robotics",
                        type: "text",
                        value: "Robotics",
                        selector: ".filter-btn[data-topic='robotics']",
                        maxLength: 30
                    }
                ]
            },
            {
                id: "paper_cards",
                name: "Paper Card Labels",
                icon: "fa-newspaper",
                fields: [
                    {
                        id: "read_button",
                        label: "Read Paper Button",
                        type: "text",
                        value: "Read Paper",
                        selector: ".paper-card .read-btn",
                        maxLength: 30
                    },
                    {
                        id: "download_button",
                        label: "Download PDF Button",
                        type: "text",
                        value: "Download PDF",
                        selector: ".paper-card .download-btn",
                        maxLength: 30
                    },
                    {
                        id: "authors_label",
                        label: "Authors - Label",
                        type: "text",
                        value: "Authors:",
                        selector: ".paper-authors-label",
                        maxLength: 20
                    },
                    {
                        id: "published_label",
                        label: "Published Date - Label",
                        type: "text",
                        value: "Published:",
                        selector: ".paper-published-label",
                        maxLength: 20
                    },
                    {
                        id: "citations_label",
                        label: "Citations - Label",
                        type: "text",
                        value: "Citations:",
                        selector: ".paper-citations-label",
                        maxLength: 20
                    },
                    {
                        id: "doi_label",
                        label: "DOI - Label",
                        type: "text",
                        value: "DOI:",
                        selector: ".paper-doi-label",
                        maxLength: 20
                    }
                ]
            },
            {
                id: "badges_section",
                name: "Paper Badge Labels",
                icon: "fa-tags",
                fields: [
                    {
                        id: "open_access_badge",
                        label: "Open Access Badge",
                        type: "text",
                        value: "Open Access",
                        selector: ".badge-open-access",
                        maxLength: 30
                    },
                    {
                        id: "peer_reviewed_badge",
                        label: "Peer Reviewed Badge",
                        type: "text",
                        value: "Peer Reviewed",
                        selector: ".badge-peer-reviewed",
                        maxLength: 30
                    },
                    {
                        id: "conference_badge",
                        label: "Conference Paper Badge",
                        type: "text",
                        value: "Conference",
                        selector: ".badge-conference",
                        maxLength: 30
                    }
                ]
            },
            {
                id: "empty_state",
                name: "Empty State Messages",
                icon: "fa-inbox",
                fields: [
                    {
                        id: "no_papers_msg",
                        label: "No Papers Found Message",
                        type: "text",
                        value: "No research papers found",
                        selector: ".no-papers-message",
                        maxLength: 50
                    },
                    {
                        id: "loading_text",
                        label: "Loading Text",
                        type: "text",
                        value: "Loading papers...",
                        selector: ".loading-text",
                        maxLength: 30
                    }
                ]
            }
        ]
    }
};

// Calculate total editable fields
function getFieldStats() {
    let totalPages = 0;
    let totalSections = 0;
    let totalFields = 0;
    
    for (const [pageName, pageData] of Object.entries(comprehensiveContentData)) {
        totalPages++;
        totalSections += pageData.sections.length;
        pageData.sections.forEach(section => {
            totalFields += section.fields.length;
        });
    }
    
    return { totalPages, totalSections, totalFields };
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { comprehensiveContentData, getFieldStats };
}
