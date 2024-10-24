import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import "./image.css";
interface Image {
  url: string;
  width: number;
  height: number;
}

const ImageComponent = (image: Image) => {
  const [faces, setFaces] = useState<number[][]>();
  const [friends, setFriends] = useState<string[]>([]);

  const imgRef = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    imgRef.current && loadModels();
  }, []);

  const loadModels = () => {
    Promise.all([
      faceapi.loadTinyFaceDetectorModel("/models"),
      faceapi.loadFaceLandmarkModel("/models"),
      faceapi.loadFaceLandmarkTinyModel("/models"),
      faceapi.loadFaceRecognitionModel("/models"),
      faceapi.loadFaceExpressionModel("/models"),
      faceapi.loadAgeGenderModel("/models"),
      faceapi.loadFaceDetectionModel("/models"),
      faceapi.loadSsdMobilenetv1Model("/models"),
    ])
      .then(() => {
        console.log("done");
        handleImage();
      })
      .catch((er) => {
        console.log("error", er);
      });
  };

  const handleImage = async () => {
    const detections = await faceapi.detectAllFaces(
      imgRef.current as faceapi.TNetInput,
      new faceapi.TinyFaceDetectorOptions()
    );

    setFaces(detections.map((items) => Object.values(items.box)));

    // .withFaceLandmarks()
    // .withFaceExpressions()
    // .withAgeAndGender();
    //   .withFaceDescriptors();

    if (canvasRef.current) {
      canvasRef.current.innerHTML = `${faceapi.createCanvasFromMedia(
        imgRef.current as HTMLImageElement | HTMLVideoElement | ImageData
      )}`;

      // faceapi.matchDimensions(canvasRef.current, {
      //   width: image.width,
      //   height: image.height,
      // });
      // const resized = faceapi.resizeResults(detections, {
      //   width: image.width,
      //   height: image.height,
      // });

      // faceapi.draw.drawDetections(canvasRef.current, resized);
      // faceapi.draw.drawFaceExpressions(canvasRef.current, resized);
      //   faceapi.draw.drawFaceLandmarks(canvasRef.current, resized);

      console.log("🤷 💖", detections);
    }
  };

  const mouseMove = () => {
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) {
      ctx.lineWidth = 3;
      ctx.strokeStyle = "red";
      faces?.map((face) => ctx.strokeRect(face[0], face[1], face[2], face[3]));
    }
  };

  const addFriend = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFriends((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="container">
      <div
        className="left"
        style={{ width: image.width, height: image.height }}
      >
        <img
          crossOrigin="anonymous"
          ref={imgRef}
          src={image.url}
          alt="imgLft"
        />
        <canvas
          ref={canvasRef}
          id="imgCanvas"
          className="imgCanvas"
          width={image.width}
          height={image.height}
          onMouseEnter={() => mouseMove()}
        ></canvas>
        {faces?.map((face, i) => (
          <input
            name={`input${i}`}
            style={{ left: face[0], top: face[1] + face[3] }}
            placeholder="Tag a friend"
            key={i}
            className="friendInput"
            onChange={(e) => addFriend(e)}
          />
        ))}
      </div>
      <div className="right">
        <h1>Share your post</h1>
        <input
          type="text"
          placeholder="What's on your mind?"
          className="rightInput"
        />

        {friends && (
          <span className="friends">
            with
            <span className="name">{Object.values(friends) + " "}</span>
          </span>
        )}
        <button className="rightBtn">Send</button>
      </div>
    </div>
  );
};

export default ImageComponent;
