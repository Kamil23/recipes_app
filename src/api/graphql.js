const API_URL = "https://dietanaluzie.pl/graphql";

async function fetchAPI(query = "", { variables } = {}) {
  const headers = { "Content-Type": "application/json" };

  const res = await fetch(API_URL, {
    headers,
    method: "POST",
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const json = await res.json();
  if (json.errors) {
    console.error(json.errors);
    throw new Error("Failed to fetch API");
  }
  return json.data;
}

export async function getAllCategories() {
  const data = await fetchAPI(`
    {
      categories(first: 20) {
        edges {
          node {
            name
            posts(first: 1) {
              edges {
                node {
                  featuredImage {
                    node {
                      sourceUrl(size: THUMBNAIL)
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `);
  return data?.categories;
}

export async function getRecipesByCategoryName(name) {
  const data = await fetchAPI(
    `
  query GET_POSTS_BY_CATEGORY($name: String) {
    posts(first: 20, where: {categoryName: $name}) {
      edges {
        node {
          title
          excerpt
          slug
          date
          featuredImage {
            node {
              sourceUrl
              srcSet
            }
          }
          author {
            node {
              name
              firstName
              lastName
              avatar {
                url
              }
            }
          }
        }
      }
    }
  }
  `,
    {
      variables: {
        name: name,
      },
    }
  );
  return data;
};

export const getRecipesByQuery = async (query) => {
  const data = await fetchAPI(
    `
  query GET_POSTS_BY_QUERY($query: String) {
    posts(first: 20, where: {search: $query}) {
      edges {
        node {
          title
          excerpt
          slug
          date
          featuredImage {
            node {
              sourceUrl
              srcSet
            }
          }
          author {
            node {
              name
              firstName
              lastName
              avatar {
                url
              }
            }
          }
        }
      }
    }
  }
  `,
    {
      variables: {
        query: query,
      },
    }
  );
  return data;
};

export async function getSingleRecipeBySlug(slug) {
  const data = await fetchAPI(
    `
    fragment AuthorFields on User {
      name
      firstName
      lastName
      avatar {
        url
      }
    }
    fragment PostFields on Post {
      title
      excerpt
      slug
      date
      id
      featuredImage {
        node {
          sourceUrl
        }
      }
      author {
        node {
          ...AuthorFields
        }
      }
      link
      categories {
        edges {
          node {
            name
            link
            id
            uri
            parentId
          }
        }
      }
      tags {
        edges {
          node {
            name
          }
        }
      }
    }
    query PostBySlug($id: ID!, $idType: PostIdType!) {
      post(id: $id, idType: $idType) {
        ...PostFields
        content
        saswpSchema {
          json_ld
        }
      }
    }
  `,
    {
      variables: {
        id: slug,
        idType: "SLUG",
      },
    }
  );
  return data;
}
