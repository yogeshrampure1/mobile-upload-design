import { useState } from "react";
import PDFUpload from "./components/PDFUpload";
import SignedPDFViewer from "./components/PDFViewer1";

function App() {
  const [signedPdfUrl, setSignedPdfUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (file) => {
    try {
      const formData = new FormData();
      formData.append("myFile", file, file.name);
      const res = await fetch("http://localhost:3000/upload-and-sign", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const signedFile = await res.json();
        setSignedPdfUrl(signedFile.filePath);
        return;
      }
      const resData = await res.json();
    } catch (error) {
      setLoading(false);
      return;
    }
    setLoading(false);
  };

  return (
    <div className={"flex flex-col items-center justify-center w-full gap-4"}>
      <h3>Mobile Upload Design</h3>
      <PDFUpload onUpload={handleUpload} />
      {loading && <p>Loading...</p>}
      {signedPdfUrl && <SignedPDFViewer pdfUrl={signedPdfUrl} />}
    </div>
  );
}

export default App;
