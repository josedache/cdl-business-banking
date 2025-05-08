/**
 * Downloads a document from a URL and opens it in a new tab
 * @param url - URL of the document to download
 * @param fileName - Name of the file to download
 */
export function downloadUrl(url: string, fileName = "file") {
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
}
