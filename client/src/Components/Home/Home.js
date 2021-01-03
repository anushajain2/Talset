import React from "react";

//import components
import "./Home.css";
import NavBar from "./NavBar";
import RecipeReviewCard from "./Posts";

function Home(props) {
  return (
    <div className="Home">
      <NavBar />
      <RecipeReviewCard />
      <RecipeReviewCard />
      <RecipeReviewCard />
      <RecipeReviewCard />
      <RecipeReviewCard />
    </div>
  );
}

export default Home;
