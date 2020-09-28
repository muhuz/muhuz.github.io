import React from "react"
import { graphql } from "gatsby"

import "../styles/post-preview.css"

export default function Preview({ frontmatter: { title, date, blurb, slug }}) {
    return (
        <div className="post-preview">
            <div className="post-grid">
                <div className="post-text">
                    <div className="preview-header">
                        <div className="post-title" href={slug}>{title}</div>
                        <div className="date">{date}</div>
                    </div>
                    <a className="blurb" href={slug}>{blurb}</a>
                    {/* <TagsContainer tags={this.props.tags}></TagsContainer> */}
                </div>
                <div className="post-image">
                    <img src={orange}></img>
                </div>
            </div>
        </div>
    )
}

export const query = graphql`
    query {
        allMarkdownRemark {
            nodes {
                frontmatter {
                    title
                    date(formatString: "MMMM DD, YYYY")
                    blurb
                    slug
                }
            }
        }
    } 
`