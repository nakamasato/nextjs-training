This is a starter template for [Learn Next.js](https://nextjs.org/learn).

## Run

```
npm run dev
```

## Development

### [Page with Link](https://nextjs.org/learn/basics/navigate-between-pages)

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
    <h1 className={styles.title}>
      Read <Link href="/posts/first-post">this page!</Link>
    </h1>
    ```

### [Assets, Metadata, and CSS](https://nextjs.org/learn/basics/assets-metadata-css)
