import React, { useEffect, useState } from "react";
import Post from "../Componenets/Post";

function IndexPages() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    fetch("http://localhost:4000/post").then((response) => {
      response.json().then((posts) => {
        console.log(posts);
        setPosts(posts);
      });
    });
  }, []);
  return (
    <>
      {posts.length > 0 && posts.map((post) => <Post {...post} />)}
      {/* <Post />
      <Post />
      <Post /> */}
    </>
  );
}

export default IndexPages;
