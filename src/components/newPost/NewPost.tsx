import { useEffect, useState } from "react";
import "./newPost.css";
import ImageComponent from "../imageComponent/ImageComponent";

const NewPost = () => {
  const [file, setFile] = useState<File | undefined>();
  const [image, setImage] = useState({ url: "", width: 0, height: 0 });

  const getImage = () => {
    const img = new Image();
    img.src = URL.createObjectURL(file as Blob);

    img.onload = () => {
      setImage({
        url: img.src,
        width: img.width,
        height: img.height,
      });
    };
  };

  useEffect(() => {
    file && getImage();
  }, [file]);

  return (
    <>
      {image.url ? (
        <ImageComponent {...image} />
      ) : (
        <div className="newPostCard">
          <div className="addPosts">
            <img
              src="https://images.pexels.com/photos/9371782/pexels-photo-9371782.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
              alt="avtarImg"
              className="avatar"
            />
            <div className="postForm">
              <input
                type="text"
                placeholder="whats in your mind?!"
                className="postInput"
              />
              <label htmlFor="file">
                <img
                  className="addImg"
                  src="https://cdn.icon-icons.com/icons2/564/PNG/512/Add_Image_icon-icons.com_54218.png"
                  alt=""
                />
                <img
                  className="addImg"
                  src="https://icon-library.com/images/maps-icon-png/maps-icon-png-5.jpg"
                  alt=""
                />
                <img
                  className="addImg"
                  src="https://d29fhpw069ctt2.cloudfront.net/icon/image/84451/preview.svg"
                  alt=""
                />
                <button>send</button>
              </label>
              <input
                onChange={(e) => {
                  setFile(e?.target?.files?.[0]);
                }}
                type="file"
                style={{ display: "none" }}
                id="file"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NewPost;
