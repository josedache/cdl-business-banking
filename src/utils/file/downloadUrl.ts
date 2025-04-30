/**
 * Downloads a document from a URL and opens it in a new tab
 * @param url - URL of the document to download
 * @param fileName - Name of the file to download
 */
export const downloadUrl = async (
  url: string,
  fileName: string
): Promise<void> => {
  try {
    // Open in new tab
    const newWindow = window.open(url, "_blank");

    if (!newWindow) {
      // Fallback to direct download if popup is blocked
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  } catch (error) {
    console.error("Error downloading file:", error);
    throw error;
  }
};
