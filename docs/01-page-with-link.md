## [Page with link](https://nextjs.org/learn/basics/navigate-between-pages)

1. Add page: [pages/posts/first-post.js](pages/posts/first-post.js)
    ```js
    export default function FirstPost() {
      return <h1>First Post</h1>;
    }
    ```

    http://localhost:3000/posts/first-post
1. `Link` component
    ```js
    import Link from 'next/link';
    ...
    <h1 className="title">
      Read <Link href="/posts/first-post">this page!</Link>
    </h1>
    ```
