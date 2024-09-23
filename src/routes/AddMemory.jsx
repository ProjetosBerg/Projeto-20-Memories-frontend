import axios from "../axios-config";

import { useState } from "react";

import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";

import "./AddMemory.css";

const AddMemory = () => {
  const [inputs, setInputs] = useState({});
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  const navigate = useNavigate();

  const isValidImageUrl = (url) => {
    return /\.(jpg|jpeg|png|gif)$/.test(url.toLowerCase());
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isValidImageUrl(inputs.imageUrl)) {
      toast.error(
        "URL da imagem inválida. Certifique-se de que a URL termina com .jpg, .jpeg, .png ou .gif."
      );
      return;
    }

    const formData = new FormData();
    formData.append("imageUrl", inputs.imageUrl);
    formData.append("title", inputs.title);
    formData.append("description", inputs.description);

    try {
      const response = await axios.post("/memories", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success(response.data.msg);

      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.msg);
    }
  };

  const handleChange = (event) => {
    if (event.target.name === "image") {
      setImage(event.target.files[0]);
    } else {
      setInputs({ ...inputs, [event.target.name]: event.target.value });
    }

    if (event.target.name === "imageUrl" && isValidImageUrl(event.target.value)) {
      setImageUrl(event.target.value);
    } else {
      setImageUrl("");
    }
  };

  return (
    <div className="add-memory-page">
      <h2>Crie uma nova memória</h2>
      <form onSubmit={handleSubmit}>
        <label>
          <p>Título:</p>
          <input
            type="text"
            name="title"
            placeholder="Defina um título"
            onChange={handleChange}
          />
        </label>
        <label>
          <p>Descrição:</p>
          <textarea
            type="text"
            name="description"
            placeholder="Explique o que aconteceu..."
            onChange={handleChange}
          />
        </label>
        <label>
          <div className="image-control">
            <p>Url da Foto:</p>
            <div className="input-image-wrapper">
              <textarea type="text" name="imageUrl" onChange={handleChange} />
              {imageUrl && <img src={imageUrl} alt="imagem selecionada"  />}
              {!imageUrl && (
                <img
                  src={`https://img.freepik.com/vetores-premium/nenhuma-foto-disponivel-icone-vetorial-simbolo-de-imagem-padrao-imagem-em-breve-para-site-ou-aplicativo-movel_87543-10639.jpg`}
                  alt="imagem padrão"
                />
              )}
            </div>
          </div>
        </label>

        <input className="btn" type="submit" value="Enviar" />
      </form>
    </div>
  );
};

export default AddMemory;
