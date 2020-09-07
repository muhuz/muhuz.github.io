import React from "react"
import Header from "./components/Header";
import Preview from "./components/PostPreviewQL";
import { useStaticQuery, graphql } from 'gatsby';
import "./../styles/global.css"

// export default function Home() {
//   return (
//     <div>
//       <Header/>
//       <div className="wrapper">
//         <PostPreview 
//          title="Post 1" 
//          link="#" date="6/26/20" 
//          tags={["Algebra", "Bolognese", "Pasta"]}
//          snippit="Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit..."></PostPreview>
//         <PostPreview title="Post 2" link="#" date="6/27/20" tags={["Trigonometry"]} snippit="Cool Trigonometric equations!" ></PostPreview>
//         <PostPreview title="Post 3" link="#" date="6/28/20" tags={["Geometry"]} snippit="Cool Geometric equations!" ></PostPreview>
//         <PostPreview title="Post 4" link="#" date="6/29/20" tags={["Analysis"]} snippit="Cool Analytical equations!" ></PostPreview>
//       </div>
//     </div>
//   );
// }

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

export default Home

// export const query = graphql`
//   query {
//     allMarkdownRemark {
//       nodes {
//         frontmatter {
//           title
//           date
//           blurb
//           slug
//         }
//       }
//     }
//   }
// `
