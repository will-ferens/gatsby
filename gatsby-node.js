//Cretea Blog Post pages
exports.createPages = async ({
    actions,
    graphql,
    reporter
}) => {
	const { createPage } = actions
	
    const blogPostTemplate = require.resolve(`./src/templates/postTemplate.js`)
    const result = await graphql(`
        {
            allMarkdownRemark(
                sort: { order: DESC, fields: [frontmatter___date] }
                    limit: 1000
                ) {
                edges {
                    node {
						excerpt(pruneLength: 250)
						html
						id
						frontmatter {
							date
							slug
							title
						}
					}
                }
            }
        }
    `)
    // Handle errors
    if (result.errors) {
        reporter.panicOnBuild(`Error while running GraphQL query.`)
        return
    }
    result.data.allMarkdownRemark.edges.forEach(({
        node
    }) => {
        createPage({
            path: node.frontmatter.slug,
            component: blogPostTemplate,
            context: {
                // additional data can be passed via context
                slug: node.frontmatter.slug,
            },
        })
    })
}