# Pre-rendeing and Data Fetching

## [Pre-rendering](https://nextjs.org/docs/basic-features/pages#pre-rendering)

By default, Next.js **pre-renders** every page. This means that Next.js generates HTML for each page in advance, instead of having it all done by client-side JavaScript.

Next.js has two forms of pre-rendering: Static Generation and Server-side Rendering. The difference is in when it generates the HTML for a page.

1. **Static Generation (Recommended)**: The HTML is generated at **build time** and will be reused on each request.
    - your page can be built once and served by CDN, which makes it much faster than having a server render the page on every request.
1. **Server-side Rendering**: The HTML is generated on each request.
    - It will be slower, but the pre-rendered page will always be up-to-date.


More:
- If your app is a plain React.js app (without Next.js), there’s no pre-rendering
- Importantly, Next.js lets you choose which pre-rendering form to use for each page.
-

### Static Generation with Data using `getStaticProps` (SSG)

- `getStaticProps` runs at **build time** in production
- `getStaticProps` tells nextjs that the page needs external data dependencies.

Create blog page with static generation

1. `posts/pre-rendering.md` and `posts/ssg-ssr.md`
1. Install `gray-matter` to parse the yaml front matter
    ```
    npm install gray-matter
    ```
1. create `lib/posts.js` to read data from filesystem.

    ```js
    import fs from 'fs';
    import path from 'path';
    import matter from 'gray-matter';

    const postsDirectory = path.join(process.cwd(), 'posts');

    export function getSortedPostsData() {
      // Get file names under /posts
      const fileNames = fs.readdirSync(postsDirectory);
      const allPostsData = fileNames.map((fileName) => {
        // Remove ".md" from file name to get id
        const id = fileName.replace(/\.md$/, '');

        // Read markdown file as string
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');

        // Use gray-matter to parse the post metadata section
        const matterResult = matter(fileContents);

        // Combine the data with the id
        return {
          id,
          ...matterResult.data,
        };
      });
      // Sort posts by date
      return allPostsData.sort((a, b) => {
        if (a.date < b.date) {
          return 1;
        } else {
          return -1;
        }
      });
    }
    ```
1. Add the following code to `pages/index.js`
    ```js
    import { getSortedPostsData } from '../lib/posts';

    export async function getStaticProps() {
      const allPostsData = getSortedPostsData();
      return {
        props: {
          allPostsData,
        },
      };
    }
    ```
1. Update Home in `pages/index.js` (pass `allPostData` and add section )
    ```js
    export default function Home({ allPostsData }) {
      return (
        <Layout home>
          <Head>
            <title>{siteTitle}</title>
          </Head>
          <section className={utilStyles.headingMd}>
            <p>[Your Self Introduction]</p>
            <p>
              (This is a sample website - you’ll be building a site like this on{' '}
              <a href="https://nextjs.org/learn">our Next.js tutorial</a>.)
            </p>
          </section>
          <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
            <h2 className={utilStyles.headingLg}>Blog</h2>
            <ul className={utilStyles.list}>
              {allPostsData.map(({ id, date, title }) => (
                <li className={utilStyles.listItem} key={id}>
                  {title}
                  <br />
                  {id}
                  <br />
                  {date}
                </li>
              ))}
            </ul>
          </section>
        </Layout>
      );
    }
    ```

For more about [getStaticProps](https://nextjs.org/docs/basic-features/data-fetching#getstaticprops-static-generation)

In `getStaticProps`, you can access to API endpoint or read data from database.

Env:
- In development (npm run dev or yarn dev), getStaticProps runs on every request.
- In production, getStaticProps runs at build time. However, this behavior can be enhanced using the fallback key returned by getStaticPaths

### [Fetching Data at Request Time (SSR)](https://nextjs.org/learn/basics/data-fetching/request-time)

Use [getServerSideProps](https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering) instead of getStaticProps

```js
export async function getServerSideProps(context) {
  return {
    props: {
      // props for your component
    },
  };
}
```

### Client-Side Rendering

This approach works well for user dashboard pages, for example. Because a dashboard is a private, user-specific page, SEO is not relevant, and the page doesn’t need to be pre-rendered. The data is frequently updated, which requires request-time data fetching.

### [SWR](https://swr.vercel.app/)

The team behind Next.js has created a React hook for data fetching called SWR. We highly recommend it if you’re fetching data on the client side
