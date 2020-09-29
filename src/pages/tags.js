import React from "react"
import Header from "../components/Header"
import "../styles/global.css"

// Components
import { Link, graphql } from "gatsby"
const _ = require("lodash")

const TagsPage = ({ data }) => {
  const groups = data.allMarkdownRemark.group
  return (
    <div>
      <Header/>
      <div className="wrapper">
        <h1>Tags</h1>
        <ul>
            {groups.map((group) => {
            const tag = group.fieldValue
            const slug = "/tags/" + _.kebabCase(tag);
            return (
                <li key={slug}>
                <Link to={slug}>{tag}</Link>
                </li>
            )
            })}
        </ul>
      </div>
    </div>
  )
}

export default TagsPage;

export const pageQuery = graphql`
  query {
    allMarkdownRemark(limit: 2000, sort: {fields: id}) {
        group(field: frontmatter___tags) {
          fieldValue
        }
    }
  }
`