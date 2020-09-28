import React from "react"
import Header from "../components/Header";
import Preview from "../components/PostPreviewQL";
import { useStaticQuery, graphql } from 'gatsby';
import "./../styles/global.css"

const Home = () => {
    const data = useStaticQuery(
      graphql`
        query {
          allMarkdownRemark (
            sort: { order: DESC, fields: [frontmatter___date] }) {
            nodes {
              frontmatter {
                title
                date(formatString: "MMMM DD, YYYY")
                blurb
                slug
                tags
              }
            }
          }
        }
      `
    )

    return (
      <div>
        <Header/>
        <div className="wrapper">
          {data.allMarkdownRemark.nodes.map((node) => (
            <div>
              <Preview data={node.frontmatter} />
            </div>
          ))} 
        </div>
      </div>
  );
}

export default Home;

