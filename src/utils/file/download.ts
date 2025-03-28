/**
 *
 * @param {Blob} blob
 * @param {string} [fileName='file']
 */
export function download(blob: Blob, fileName = "file") {
  if (blob instanceof Blob) {
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
  }
}

export default download;
