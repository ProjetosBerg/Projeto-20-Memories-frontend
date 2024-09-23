import axios from "../axios-config";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "./Memory.css";

const Memory = () => {
  const { id } = useParams();
  const [memory, setMemory] = useState(null);
  const [comments, setComments] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [name, setName] = useState("");
  const [text, setText] = useState("");

  // Estados para edição
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editImage, setEditImage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getMemory = async () => {
      const res = await axios.get(`/memories/${id}`);
      setMemory(res.data);
      setComments(res.data.comments);
      setEditTitle(res.data.title);
      setEditDescription(res.data.description);
      setEditImage(res.data.imageUrl);
      setImageUrl(res.data.imageUrl);
    };

    getMemory();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      const comment = { name, text };
      const res = await axios.patch(
        `/memories/${memory._id}/comment/`,
        comment
      );
      const lastComment = res.data.memory.comments.pop();
      setComments((comments) => [...comments, lastComment]);
      setName("");
      setText("");
      toast.success(res.data.msg);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.msg);
    }
  };

  const isValidImageUrl = (url) => {
    return /\.(jpg|jpeg|png|gif)$/.test(url.toLowerCase());
  };

  const handleImageChange = (e) => {
    const newImageUrl = e.target.value;
    setEditImage(newImageUrl);
  
    if (isValidImageUrl(newImageUrl)) {
      setImageUrl(newImageUrl); 
    } else {
      setImageUrl("");
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("imageUrl", editImage);
    formData.append("title", editTitle);
    formData.append("description", editDescription);

    if (editImage && !isValidImageUrl(editImage)) {
      toast.error("URL da imagem inválida. Certifique-se de que a URL termina com .jpg, .jpeg, .png ou .gif.");
      return;
    }

    try {
      const response = await axios.patch(`/memories/${memory._id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setMemory(response.data);
      setIsEditing(false);
      navigate(`/`);
      toast.success("Memória atualizada com sucesso!");
    } catch (error) {
      console.log(error);
      toast.error("Erro ao atualizar a memória.");
    }
  };

  if (!memory) return <p>Carregando...</p>;

  return (
    <div className="memory-page">
      <img
        src={memory.imageUrl || `${axios.defaults.baseURL}${memory.src}`}
        alt={memory.title}
      />
      <h2>{memory.title}</h2>
      <p>{memory.description}</p>

      <button className="btn" onClick={() => setIsEditing((prev) => !prev)}>
        {isEditing ? "Cancelar Edição" : "Editar"}
      </button>

      {/* Formulário para edição */}
      {isEditing && (
        <div className="edit-form">
          <h3>Editar Memória:</h3>
          <form onSubmit={handleEditSubmit}>
            <label>
              Título:
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />
            </label>
            <label>
              Descrição:
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
              />
            </label>
            <label>
          <div className="image-control">
            <p>Url da Foto:</p>
            <div className="input-image-wrapper">
              <textarea type="text" name="imageUrl" onChange={(e) => handleImageChange(e)} value={editImage || ''} />
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
            <input className="btn" type="submit" value="Atualizar" />
          </form>
        </div>
      )}

      {/* Seção de comentários */}
      {!isEditing && (
        <>
          <div className="comment-form">
            <h3>Envie seu comentário:</h3>
            <form onSubmit={handleCommentSubmit}>
              <label>
                <input
                  type="text"
                  placeholder="Seu nome"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                />
              </label>
              <label>
                <textarea
                  placeholder="Seu comentário"
                  onChange={(e) => setText(e.target.value)}
                  value={text}
                ></textarea>
              </label>
              <input className="btn" type="submit" value="Enviar" />
            </form>
          </div>
          <div className="comments-container">
            <h3>Comentários ({comments.length})</h3>
            {comments.length === 0 && <p>Não há comentários</p>}
            {comments.length > 0 &&
              comments.map((comment) => (
                <div key={comment._id} className="comment">
                  <p className="comment-name">{comment.name}</p>
                  <p className="comment-text">{comment.text}</p>
                </div>
              ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Memory;
