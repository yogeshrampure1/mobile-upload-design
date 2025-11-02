import { Document, Page } from "react-pdf";
// import "react-pdf/dist/esm/Page/AnnotationLayer.css";

function PDFViewer1({ pdfUrl }) {
  return (
    <div className="w-full h-screen overflow-auto">
      <Document file={pdfUrl}>
        <Page pageNumber={1} />
      </Document>
    </div>
  );
}

export default PDFViewer1;
