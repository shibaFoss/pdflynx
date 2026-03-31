/**
 * Enum representing supported PDF-related operations.
 *
 * Used to define the type of processing to perform.
 */
export var PDFAction;
(function (PDFAction) {
    /**
     * Merge multiple PDF files into a single document.
     */
    PDFAction["MERGE"] = "merge";
    /**
     * Split a PDF into multiple smaller documents.
     */
    PDFAction["SPLIT"] = "split";
    /**
     * Compress a PDF to reduce file size.
     */
    PDFAction["COMPRESS"] = "compress";
    /**
     * Convert PDF pages into images.
     */
    PDFAction["PDF_TO_IMAGE"] = "pdf-to-image";
    /**
     * Convert images into a single PDF document.
     */
    PDFAction["IMAGE_TO_PDF"] = "image-to-pdf";
})(PDFAction || (PDFAction = {}));
