/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.org/docs/gatsby-config/
 */

module.exports = {
  /* Your site config here */
  plugins: [
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `markdown-pages`,
        path: `${__dirname}/src/markdown-pages`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-katex`,
            options: {
              strict: `ignore`
            },
          },
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 800,
              withWebp: true,
              linkImagesToOriginal: false,
              showCaptions: true,
              wrapperStyle:'margin:0;',
            },
          },
        ],
      },
    },
    {
      resolve: `gatsby-plugin-google-fonts`,
      options: {
        fonts: [
          `Lato`
        ],
        display: 'swap',
      },
    },
    `gatsby-plugin-mdx`
  ],
}
