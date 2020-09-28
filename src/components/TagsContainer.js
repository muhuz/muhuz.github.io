import React from 'react';
import "../styles/tags-container.css"
const _ = require("lodash")

export default function TagsContainer({ tags }) {
    const tag_items = tags.map((tag) => {
        const tag_slug = "/tags/" + _.kebabCase(tag);
        return (<a className='tag-item' href={tag_slug}>{tag}</a>)
    })

    return (
        <div className='tag-container'>
            {tag_items}
        </div>
    );
};