/**
 *
 * @param {Blob} blob
 * @param {string} [fileName='file']
 */
export function downloadUrl(url: string, fileName = "file") {
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
}

export default downloadUrl;
