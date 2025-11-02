import { useState } from "react";

function PDFUpload({ onUpload }) {
  const [pdf, setPdf] = useState(null);

  return (
    <div className="flex flex-col items-center gap-4">
      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setPdf(e.target.files[0])}
        name="myfile"
      />
      {pdf && (
        <div>
          <span>{pdf.name}</span>
          <button onClick={() => setPdf(null)}>Remove</button>
        </div>
      )}
      <button
        onClick={() => onUpload(pdf)}
        disabled={!pdf}
        className="bg-blue-600 text-white px-4 py-2"
      >
        Upload & Sign
      </button>
    </div>
  );
}
export default PDFUpload;
