export const uploadBrainDropImage = async (textId: string, file: File) => {
  const braindropId = textId.split('/')[1].split('.')[0] // get id from text/{id}.json
  const formData = new FormData();
  formData.append("id", braindropId);
  formData.append("imageFile", file);

  await fetch("/api/braindrop/image", {
    method: "PUT", body: formData
  });
}