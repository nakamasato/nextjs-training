import Head from 'next/head';
import utilStyles from '../../styles/utils.module.css';
import Layout from '../../components/layout';


export async function getServerSideProps() {
    // run https://github.com/nakamasato/fastapi-sample on your local
    try {
        const res = await fetch(`http://localhost:8000/users/?skip=0&limit=100`)
        const data = await res.json()
        return { props: { data } }
    } catch {
        // if it fails, return the static data
        console.log("Please run https://github.com/nakamasato/fastapi-sample in your local")
        const data = [{ "email": "test@mail.com", "id": 1, "is_active": true }]
        return { props: { data }}
    }
}


export default function SecondPost({ data }) {
    return (
        <Layout>
            <Head>
                <title>Second Post</title>
            </Head>
            <h1>Second Post</h1>
            <p>This is my second post that I want to try using SSR.</p>
            <ul className={utilStyles.list}>
                {data.map(({ id, email }) => (
                    <li className={utilStyles.listItem} key={id}>
                        email: {email}
                        <br />
                        id: {id}
                    </li>
                ))}
            </ul>
        </Layout>
    );
}
