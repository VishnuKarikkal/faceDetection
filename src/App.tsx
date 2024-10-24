import "./App.css";
import ImageComponent from "./components/imageComponent/ImageComponent";
import Nav from "./components/nav/Nav";
import NewPost from "./components/newPost/NewPost";

function App() {
  return (
    <>
      <Nav />
      <div className="card">
        <NewPost />
      </div>
    </>
  );
}

export default App;
