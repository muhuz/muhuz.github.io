import React from "react"
import Header from "../components/Header"
import "../styles/global.css"

const About = () => {
    return (
        <div>
            <Header/>
            <div className="wrapper">
                <h1>About</h1>
                <p>
                    Hi! I'm Michael. I currently work as a data scientist. I'll mainly be 
                    posting about topics in math, stats, and ML. I made the blog to serve as 
                    a place to log my learning and as a way to help me practice communicating
                    technical topics through writing. You can contact me at: mhzbox at gmail dot com
                </p>
            </div>
        </div>
    )
}

export default About;