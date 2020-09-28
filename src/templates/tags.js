import React from "react"
import Header from "../components/Header"
import "../styles/global.css"

// Components
import { Link, graphql } from "gatsby"

const Tags = ({ pageContext, data }) => {
  const { tag } = pageContext
  const { edges, totalCount } = data.allMarkdownRemark
  const tagHeader = `${totalCount} post${
    totalCount === 1 ? "" : "s"
  } tagged with "${tag}"`

  return (
    <div>
      <Header/>
      <div className="wrapper">
        <h1>{tagHeader}</h1>
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
        {/*
                This links to a page that does not yet exist.
                You'll come back to it!
                */}
        <Link to="/tags">All tags</Link>
      </div>
    </div>
  )
}

export default Tags

export const pageQuery = graphql`
  query($tag: String) {
    allMarkdownRemark(
      limit: 2000
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { tags: { in: [$tag] } } }
    ) {
      totalCount
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