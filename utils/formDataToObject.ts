const formDataToObject = (formData: FormData) =>
  Object.fromEntries(formData.entries());

export default formDataToObject;
