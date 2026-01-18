/**
 * Central PDF Configuration for A3KM Studio
 * MD to PDF Converter - Reusable across all projects
 * Author: Md Akhinoor Islam
 * Website: https://akhinoor14.github.io/A3KM-Studio/
 */

const PDFConfig = {
    // Academy Information
    academy: {
        name: "Noor Academy",
        tagline: "Learn • Build • Innovate",
        website: "www.nooracademy.com",
        email: "contact@nooracademy.com"
    },
    
    // Studio Information
    studio: {
        name: "A3KM Studio",
        author: "Md Akhinoor Islam",
        website: "https://akhinoor14.github.io/A3KM-Studio/",
        github: "github.com/Akhinoor14/A3KM-Studio",
        portfolio: "akhinoor.dev"
    },
    
    // Watermark Settings
    watermark: {
        text: "NOOR ACADEMY",
        fontSize: "80px",
        color: "rgba(204, 0, 0, 0.08)",
        rotation: -45,
        position: "center", // 'center', 'top-left', 'bottom-right'
        repeat: true, // Multiple watermarks across page
        style: "diagonal" // 'diagonal', 'background', 'corner'
    },
    
    // PDF Settings
    pdf: {
        format: "a4",
        orientation: "portrait", // 'portrait' or 'landscape'
        unit: "mm",
        margin: {
            top: 25,
            right: 15,
            bottom: 25,
            left: 15
        },
        pageSize: {
            width: 210, // A4 width in mm
            height: 297  // A4 height in mm
        }
    },
    
    // Header Configuration
    header: {
        show: true,
        height: 20, // mm
        backgroundColor: "rgba(204, 0, 0, 0.1)",
        borderBottom: "2px solid #CC0000",
        content: {
            left: "projectTitle", // Dynamic: will be replaced with actual project title
            center: "A3KM Studio",
            right: "documentType" // e.g., "Code Explanation", "README"
        },
        style: {
            fontSize: "10pt",
            fontWeight: "bold",
            color: "#CC0000",
            fontFamily: "'Segoe UI', Arial, sans-serif"
        }
    },
    
    // Footer Configuration
    footer: {
        show: true,
        height: 15, // mm
        backgroundColor: "rgba(10, 10, 10, 0.05)",
        borderTop: "1px solid #CCCCCC",
        content: {
            left: "dateTime", // Auto-generated: "DD/MM/YYYY HH:MM"
            center: "pageNumber", // Auto-generated: "Page X of Y"
            right: "© Noor Academy 2026"
        },
        style: {
            fontSize: "8pt",
            color: "#666666",
            fontFamily: "'Segoe UI', Arial, sans-serif"
        }
    },
    
    // Content Styling
    content: {
        fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
        fontSize: "11pt",
        lineHeight: 1.6,
        color: "#333333",
        codeFont: "'Consolas', 'Monaco', 'Courier New', monospace",
        headingColor: "#CC0000",
        linkColor: "#0066CC"
    },
    
    // Theme Configuration (New)
    theme: {
        mode: "light", // 'light' or 'dark'
        dark: {
            background: "linear-gradient(180deg, rgba(10,10,10,0.98), rgba(20,0,0,0.95))",
            textColor: "rgba(255, 255, 255, 0.9)",
            headingColor: "#FF3333",
            codeBackground: "rgba(0, 0, 0, 0.6)",
            codeTextColor: "#d4d4d4",
            tableBorder: "rgba(204, 0, 0, 0.5)",
            tableHeaderBg: "linear-gradient(135deg, rgba(204, 0, 0, 0.5), rgba(153, 0, 0, 0.6))",
            tableCellBg: "rgba(20, 0, 0, 0.3)",
            linkColor: "#FF3333",
            accentColor: "#CC0000"
        },
        light: {
            background: "white",
            textColor: "#333333",
            headingColor: "#CC0000",
            codeBackground: "#f5f5f5",
            codeTextColor: "#000000",
            tableBorder: "#999999",
            tableHeaderBg: "#cc0000",
            tableCellBg: "#fafafa",
            linkColor: "#cc0000",
            accentColor: "#CC0000"
        }
    },
    
    // Page Break Rules
    pageBreak: {
        avoidElements: ['table', 'pre', 'img', 'figure'],
        before: ['h1', 'h2'], // Page break before these elements
        after: [], // Page break after these elements
        inside: 'avoid' // Avoid breaking inside elements
    },
    
    // File Naming Convention
    fileName: {
        prefix: "A3KM_",
        format: "{projectName}_{documentType}_{date}", // Variables: {projectName}, {documentType}, {date}, {time}
        extension: ".pdf",
        dateFormat: "YYYY-MM-DD",
        sanitize: true // Remove special characters
    },
    
    // Quality Settings
    quality: {
        image: 0.95, // JPEG quality (0-1)
        dpi: 300, // Dots per inch
        scale: 2, // Rendering scale for better quality
        compress: true // Enable PDF compression
    },
    
    // Debug Mode
    debug: {
        enabled: false, // Set to true for console logging
        showWatermarkBounds: false,
        logConversionTime: true
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PDFConfig;
}
