import React from "react"
import Header from "../components/Header";
import Preview from "../components/PostPreviewQL";
import { graphql } from 'gatsby';
import "../styles/global.css"

const Home = ({ data }) => {
  const { nodes } = data.allMarkdownRemark
  return (
    <div>
      <Header/>
        <div className="wrapper">
          {nodes.map((node) => {
            return(<div><Preview data={node.frontmatter} /></div>)
          })}
        </div>
      </div>
  )
}

export default Home;

export const pageQuery = graphql`
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

