import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Channel({ data }) {

  const channel = data.channel.items[0];


  return (
    <div className='h-screen'>
      <div className={`w-full bg-red-600 text-gray-50 fixed top-0`}>
        <div className={`container mx-auto p-4`}>
          <Link href='/'>
            <a>
              <h1 className={`text-2xl hover:underline`}>
                Youtube Playlist Data Fetcher
              </h1>
            </a>
          </Link>
        </div>
      </div>
      <div className={`h-full pt-16`}>
        {
          data.channel.pageInfo.totalResults > 0 ?
          <div className={`container mx-auto my-4 p-4`}>
            <div className={`flex flex-row align-middle`}>
              <img src={channel.snippet.thumbnails.default.url} className={`w-24 h-24`} />
              <div className={`pl-4 flex flex-col justify-center`}>
                <h1 className={`text-5xl font-bold`}>
                  {channel.snippet.title}
                </h1>
                <div className={`text-gray-500`}>
                  {channel.snippet.description}
                </div>
              </div>
            </div>
          </div>
          : <h1>Error: Channel not found.</h1>
        }
        {/* <code>
          {JSON.stringify(data)}
        </code> */}
        {
          data.playlists.error == null ?
          <div className={`container mx-auto my-4 p-4`}>
            <div className={`flex flex-row justify-center gap-2`}>
              {
                data.playlists.prevPageToken != null ?
                <Link href={`./channel?id=${data.channel.items[0].id}&pageToken=${data.playlists.prevPageToken}`}>
                  <div className={`p-3 border-2 rounded-lg leading-none cursor-pointer hover:underline`}>prev page</div>
                </Link>
                :
                <div className={`p-3 border-2 rounded-lg leading-none text-gray-300`}>prev page</div>
              }
              {
                data.playlists.nextPageToken != null ?
                <Link href={`./channel?id=${data.channel.items[0].id}&pageToken=${data.playlists.nextPageToken}`}>
                  <div className={`p-3 border-2 rounded-lg leading-none cursor-pointer hover:underline`}>next page</div>
                </Link>
                :
                <div className={`p-3 border-2 rounded-lg leading-none text-gray-300`}>next page</div>
              }
            </div>
            {
              data.playlists.items.map(item => <div className={`py-4 border-b-2 border-red-500 flex flex-row`} key={item.id}>
                <img src={item.snippet.thumbnails.medium.url || item.snippet.thumbnails.default.url} className={`h-[6.75rem] w-48 object-cover`} />
                <div className={`flex flex-col ml-4`}>
                  <Link href={`./playlist?id=${item.id}`}>
                    <a>
                      <h3 className={`text-xl hover:underline`}>{item.snippet.title}</h3>
                    </a>
                  </Link>
                  <div className={`mt-auto`}>Published At: {item.snippet.publishedAt}</div>
                </div>
              </div>)
            }
            <div className={`flex flex-row justify-center gap-2 mt-4`}>
              {
                data.playlists.prevPageToken != null ?
                <Link href={`./channel?id=${data.channel.items[0].id}&pageToken=${data.playlists.prevPageToken}`}>
                  <div className={`p-3 border-2 rounded-lg leading-none cursor-pointer hover:underline`}>prev page</div>
                </Link>
                :
                <div className={`p-3 border-2 rounded-lg leading-none text-gray-300`}>prev page</div>
              }
              {
                data.playlists.nextPageToken != null ?
                <Link href={`./channel?id=${data.channel.items[0].id}&pageToken=${data.playlists.nextPageToken}`}>
                  <div className={`p-3 border-2 rounded-lg leading-none cursor-pointer hover:underline`}>next page</div>
                </Link>
                :
                <div className={`p-3 border-2 rounded-lg leading-none text-gray-300`}>next page</div>
              }
            </div>
          </div>
          : <h1>Error: {data.playlists.error.message}</h1>
        }
      </div>
    </div>
  )
}

export async function getServerSideProps(context) {

  const KEY = process.env.GOOGLE_API_KEY;

  const { id, pageToken } = context.query;
  let data = {
    channel: null,
    playlists: null,
  };

  let fetchurl = `https://www.googleapis.com/youtube/v3/channels?id=${id}&part=snippet&key=${KEY}`;
  let res = await fetch(fetchurl);
  data.channel = await res.json();

  fetchurl = `https://www.googleapis.com/youtube/v3/playlists?channelId=${id}&part=snippet&maxResults=50&key=${KEY}${pageToken != null ? `&pageToken=${pageToken}` : ''}`;
  res = await fetch(fetchurl);
  data.playlists = await res.json();

  return {
    props: {data}
  }
}