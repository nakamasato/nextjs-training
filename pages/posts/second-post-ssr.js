import Head from 'next/head';
import Layout from '../../components/layout';


export default function SecondPost() {
    return (
        <Layout>
            <Head>
                <title>Second Post</title>
            </Head>
            <h1>Second Post</h1>
            <p>This is my second post that I want to try using SSR.</p>
        </Layout>
    );
}
