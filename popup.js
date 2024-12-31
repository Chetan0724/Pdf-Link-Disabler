document.getElementById("disableModified").addEventListener("click", async () => {
  const fileInput = document.getElementById("pdfFile");
  if (!fileInput.files[0]) {
    displayStatus("Please select a PDF file first.");
    return;
  }

  const file = fileInput.files[0];
  const arrayBuffer = await file.arrayBuffer();
  const pdfBytes = new Uint8Array(arrayBuffer);

  processPDF(pdfBytes, file.name);
});

async function processPDF(pdfBytes, fileName) {
  try {
    const pdfDoc = await PDFLib.PDFDocument.load(pdfBytes);

    const pages = pdfDoc.getPages();
    pages.forEach((page) => {
      const annotations = page.node.Annots();
      if (annotations) annotations.array = [];
    });

    const modifiedPdfBytes = await pdfDoc.save();
    const blob = new Blob([modifiedPdfBytes], { type: "application/pdf" });

    const newFileName = fileName.replace(".pdf", "_modified.pdf");
    downloadBlob(blob, newFileName);

    displayStatus("PDF processed and modified successfully!");
  } catch (error) {
    console.error("Error processing PDF:", error);
    displayStatus("An error occurred while processing the PDF.");
  }
}

function downloadBlob(blob, fileName) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function displayStatus(message) {
  const status = document.getElementById("status");
  status.textContent = message;
}
