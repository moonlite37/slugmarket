import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Hello World!',
}

export default function Home() {
  return (
    <>
    <div>Hello World!</div>
    <div>Authors: </div>
    <div>Iman Oshaghi</div>
    <div>Dat Le</div>
    <div>Tyler Ham</div>
    </>
  );
}
