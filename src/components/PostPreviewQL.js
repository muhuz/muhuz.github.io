
import React from "react"
import TagsContainer from "./TagsContainer"
import "../styles/post-preview.css"
// import { useStaticQuery, graphql } from "gatsby"

export default function Preview({ data }) {
    return (
        <div className="post-preview">
            <div className="post-grid">
                <div className="post-text">
                    <div className="preview-header">
                        <a className="post-title" href={data.slug}>{data.title}</a>
                        <div className="date">{data.date}</div>
                    </div>
                    <a href={data.slug}>
                        <div className="blurb">{data.blurb}</div>
                    </a>
                    <TagsContainer tags={data.tags}></TagsContainer>
                </div>
                {/* <div className="post-image">
                    <img src={orange}></img>
                </div> */}
            </div>
        </div>
    )
}

