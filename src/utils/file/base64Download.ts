export function downloadAsPDF(pdf: string, filename: string) {
  let base64String = pdf;

  if (base64String.startsWith("JVB")) {
    base64String = "data:application/pdf;base64," + base64String;
    downloadFileObject(base64String, filename);
  } else if (base64String.startsWith("data:application/pdf;base64")) {
    downloadFileObject(base64String, filename);
  } else {
    alert("Not a valid Base64 PDF string. Please check");
  }
}

export function downloadFileObject(base64String: string, filename: string) {
  const linkSource = base64String;
  const downloadLink = document.createElement("a");
  const fileName = `${filename}.pdf`;
  downloadLink.href = linkSource;
  downloadLink.download = fileName;
  downloadLink.click();
}
