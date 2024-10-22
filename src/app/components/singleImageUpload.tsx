import React, { useState } from "react";

interface SingleImageUploadProps {
  onChange: (file: File) => void;
}

export const SingleImageUpload = (props: SingleImageUploadProps) => {
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const [error, setError] = useState("");

  const handleImageUpload = (filesList: FileList | null) => {
    if (!filesList) {
      setError("No file uploaded");
      return;
    }

    const file = filesList[0];
    if (file && file.type.startsWith("image/")) {
      setImagePreviewUrl(URL.createObjectURL(file));
      props.onChange(file);
      setError("");
    } else {
      setError("Please upload a valid image file.");
    }
  };

  return (
    <div>
      <div
        style={{
          border: "2px dashed #aaa",
          padding: "20px",
          textAlign: "center",
          cursor: "pointer",
        }}
        onDrop={e => { handleImageUpload(e.dataTransfer.files) }}
        onDragOver={e => { e.preventDefault() }}
        onClick={() => document.getElementById("fileInput")?.click()}
      >
        {imagePreviewUrl ? (
          <img
            src={imagePreviewUrl}
            alt="Uploaded"
            style={{ width: "100%", height: "auto" }}
          />
        ) : (
          <p>Drag & drop an image, or click to select</p>
        )}
      </div>
      <input
        id="fileInput"
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={e => { handleImageUpload(e.target.files) }
        }
      />
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};
