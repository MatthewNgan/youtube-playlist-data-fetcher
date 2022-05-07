import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Playlist({ data }) {

  const playlist = data.playlist.items[0];

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
        {/* <code>
          {JSON.stringify(data.playlistitem)}
        </code> */}
        {
          data.playlist.pageInfo.totalResults > 0 ?
          <div className={`container mx-auto my-4 p-4`}>
            <div className={`flex flex-row items-center`}>
              <img src={playlist.snippet.thumbnails.medium.url} className={`w-48 h-[6.75rem]`} />
              <div className={`pl-4 flex flex-col justify-center gap-2`}>
                <h1 className={`text-5xl font-bold`}>
                  {playlist.snippet.title}
                </h1>
                <div className={`text-gray-500`}>
                  {playlist.snippet.description || 'No description provided.'}
                </div>
              </div>
              {/* <Link href="#">
                <a className={`ml-auto flex items-center p-3 border-2 border-red-500 rounded-lg text-red-500 hover:underline`}>
                  Download All
                </a>
              </Link> */}
            </div>
          </div>
          : <h1>Error: Playlist not found.</h1>
        }
        {
          data.playlistitem.error == null ?
          <div className={`container mx-auto my-4 p-4 w-full`}>
            <div className={`flex flex-row justify-center gap-2`}>
              {
                data.playlistitem.prevPageToken != null ?
                <Link href={`./playlist?id=${data.playlist.items[0].id}&pageToken=${data.playlistitem.prevPageToken}`}>
                  <div className={`p-3 border-2 rounded-lg leading-none cursor-pointer hover:underline`}>prev page</div>
                </Link>
                :
                <div className={`p-3 border-2 rounded-lg leading-none text-gray-300`}>prev page</div>
              }
              {
                data.playlistitem.nextPageToken != null ?
                <Link href={`./playlist?id=${data.playlist.items[0].id}&pageToken=${data.playlistitem.nextPageToken}`}>
                  <div className={`p-3 border-2 rounded-lg leading-none cursor-pointer hover:underline`}>next page</div>
                </Link>
                :
                <div className={`p-3 border-2 rounded-lg leading-none text-gray-300`}>next page</div>
              }
            </div>
            {
              data.playlistitem.items.map(item => <div className={`py-4 border-b-2 border-red-500 flex flex-row w-full min-h-36 max-h-48`} key={item.id}>
                <Link href={`https://youtube.com/watch?v=${item.snippet.resourceId.videoId}`}>
                  <img src={item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url || ''} className={`h-[7.785rem] w-56 object-cover shrink-0 mt-auto mb-auto cursor-pointer`} />
                </Link>
                <div className={`flex flex-col ml-4 min-w-0`}>
                  <Link href={`https://youtube.com/watch?v=${item.snippet.resourceId.videoId}`}>
                    <a>
                      <h3 className={`text-xl hover:underline`}>{item.snippet.title}</h3>
                    </a>
                  </Link>
                  <div className={`text-gray-400 text-sm overflow-y-auto h-auto break-words`}>
                      {item.snippet.description}
                  </div>
                  <div className={`mt-auto flex flex-row gap-4`}>
                    <div>
                      Published At: {item.snippet.publishedAt}
                    </div>
                    <div>
                      By: {item.snippet.channelTitle}
                    </div>
                  </div>
                  <div></div>
                </div>
              </div>)
            }
            <div className={`flex flex-row justify-center gap-2 mt-4`}>
              {
                data.playlistitem.prevPageToken != null ?
                <Link href={`./playlist?id=${data.playlist.items[0].id}&pageToken=${data.playlistitem.prevPageToken}`}>
                  <div className={`p-3 border-2 rounded-lg leading-none cursor-pointer hover:underline`}>prev page</div>
                </Link>
                :
                <div className={`p-3 border-2 rounded-lg leading-none text-gray-300`}>prev page</div>
              }
              {
                data.playlistitem.nextPageToken != null ?
                <Link href={`./playlist?id=${data.playlist.items[0].id}&pageToken=${data.playlistitem.nextPageToken}`}>
                  <div className={`p-3 border-2 rounded-lg leading-none cursor-pointer hover:underline`}>next page</div>
                </Link>
                :
                <div className={`p-3 border-2 rounded-lg leading-none text-gray-300`}>next page</div>
              }
            </div>
          </div>
          : <h1>Error: {data.playlistitem.error.message}</h1>
        }
      </div>

    </div>
  )
}

export async function getServerSideProps(context) {

  const KEY = process.env.GOOGLE_API_KEY;

  const { id, pageToken } = context.query;
  let data = {
    playlistitem: null,
    playlist: null,
  };

  let fetchurl = `https://www.googleapis.com/youtube/v3/playlistItems?playlistId=${id}&part=snippet&maxResults=25&key=${KEY}${pageToken != null ? `&pageToken=${pageToken}` : ''}`;
  let res = await fetch(fetchurl);
  data.playlistitem = await res.json();
  
  fetchurl = `https://www.googleapis.com/youtube/v3/playlists?id=${id}&part=snippet&key=${KEY}`;
  res = await fetch(fetchurl);
  data.playlist = await res.json();

  return {
    props: {data}
  }
}