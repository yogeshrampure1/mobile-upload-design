import { useState } from "react";
import PDFUpload from "./components/PDFUpload";
import PDFViewer1 from "./components/PDFViewer1";

function App() {
  const [pdfFile, setPdfFile] = useState(null);
  const [signedPdfUrl, setSignedPdfUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (file) => {
    console.log("Uploading file:", file);
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("myFile", file, file.name);
      const res = await fetch("http://localhost:3000/upload-single", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const errorData = await res.json();
        console.error("Error uploading file:", errorData);
        return;
      }
      const resData = await res.json();
    } catch (error) {
      console.error("Error during file upload:", error);
      setLoading(false);
      return;
    }
    setLoading(false);
    console.log("File uploaded successfully:", resData);
    /*const signedPdfBlob = await res.blob();
    // Upload file to server, receive signed PDF URL/blob
    // setSignedPdfUrl(URL.createObjectURL(signedPdfBlob));
    console.log(signedPdfBlob);
    const signedPdfUrl = URL.createObjectURL(signedPdfBlob);
    setSignedPdfUrl(signedPdfUrl);
    setLoading(false);*/
  };

  return (
    <div>
      <PDFUpload onUpload={handleUpload} />
      {loading && <p>Loading...</p>}
      {signedPdfUrl && <PDFViewer1 pdfUrl={signedPdfUrl} />}
    </div>
  );
}

export default App;
