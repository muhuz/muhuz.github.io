import React from "react"
import Header from "../components/Header"
import "../styles/global.css"

// Components
import { Link, graphql } from "gatsby"

const Archive = ({ data }) => {
  const { edges } = data.allMarkdownRemark
  return (
    <div>
      <Header/>
      <div className="wrapper">
        <h1>Archive</h1>
        <ul>
            {edges.map(({ node }) => {
            const { title, slug } = node.frontmatter
            return (
                <li key={slug}>
                <Link to={slug}>{title}</Link>
                </li>
            )
            })}
        </ul>
      </div>
    </div>
  )
}

export default Archive;

export const pageQuery = graphql`
  query {
    allMarkdownRemark(
      limit: 2000
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
      edges {
        node {
          frontmatter {
            title
            slug
          }
        }
      }
    }
  }
`