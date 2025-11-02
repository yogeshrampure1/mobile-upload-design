const SERVER_URL = "http://localhost:3000";

const SignedPDFViewer = (pdfUrl) => {
  const fullUrl =
    pdfUrl && pdfUrl["pdfUrl"].startsWith("http")
      ? pdfUrl["pdfUrl"]
      : `${SERVER_URL}${pdfUrl["pdfUrl"]}`;

  return (
    <div style={{ width: "100%", height: "80vh" }}>
      <iframe src={fullUrl} width="800" height="600"></iframe>
    </div>
  );
};

export default SignedPDFViewer;
