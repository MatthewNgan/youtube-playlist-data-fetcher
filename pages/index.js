import Head from 'next/head'
import Link from 'next/link';
import * as React from 'react'


export default function Home() {

  React.useEffect(() => {
    
  }, [])

  const [method, setMethod] = React.useState('searchchannelname');
  const [searchTerm, setSearchTerm] = React.useState('');
  const inputElem = React.useRef();
  const [data, setData] = React.useState(null);

  const search = () => {
    setSearchTerm(inputElem.current.value);
  }

  const searchChannel = async (searchTerm) => {
    const res = await fetch('./api/searchchannel', {
      method: 'POST',
      body: JSON.stringify({
        term: searchTerm
      })
    })
    const resData = await res.json();
    setData(resData);
  }
  const searchPlaylist = async (searchTerm) => {
    const res = await fetch('./api/searchplaylist', {
      method: 'POST',
      body: JSON.stringify({
        term: searchTerm
      })
    })
    const resData = await res.json();
    setData(resData);
  }

  React.useEffect(() => {
    if (method === 'searchchannelname') {
      if (searchTerm !== '') searchChannel(searchTerm);
    }
    if (method === 'searchplaylistname') {
      if (searchTerm !== '') searchPlaylist(searchTerm);
    }
  }, [searchTerm])

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
      <div className={`h-full pt-16 p-4`}>
        <div className={`container mx-auto flex flex-col p-4 items-center justify-center ${data != null ? `h-5/12` : `h-full`}`}>
          <h1 className={`font-extrabold text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-center my-4`}>
            Organize YouTube playlist data in one click.
          </h1>
          <div className={`border-2 rounded-md border-red-500 flex flex-row overflow-hidden`}>
            <div
              className={`text-sm p-4 leading-none cursor-pointer ${method === 'searchchannelname' ? ' text-white bg-red-500' : ' text-red-500 bg-white'}`}
              onClick={() => setMethod('searchchannelname')}
            >
              Search channels by name</div>
            <div
              className={`text-sm p-4 leading-none cursor-pointer ${method === 'searchplaylistname' ? ' text-white bg-red-500' : ' text-red-500 bg-white'}`}
              onClick={() => setMethod('searchplaylistname')}
            >
              Search playlists by name
            </div>
          </div>
          <div className={`w-full sm:w-8/12 lg:w-6/12 flex flex-row`}>
            <input
              ref={inputElem}
              placeholder={`${method === 'searchchannelname' ? 'Search Channel' : method === 'searchplaylistname' ?  'Search Playlist' : '...'}`}
              type='text'
              className={`border-2 border-gray-300 focus:border-gray-500 outline-none text-gray-700 h-12 px-4 my-4 rounded-lg w-10/12`}
            />
            <a href="#" className={`bg-red-500 text-white leading-none my-4 p-4 rounded-lg active:bg-red-600`} onClick={search}>Search</a>
          </div>
        </div>
        {
          data != null &&
          <div className={`container mx-auto grid grid-cols-1 p-4 items-center`}>
            {data.items.map((item) => <div className={`p-4 w-full border-b-2 border-red-400 flex flex-row gap-4`} key={item.channelId}>
              <img src={item.snippet.thumbnails.high.url} className={`h-24`} />
              <div className='flex flex-col justify-start'>
                {/* {JSON.stringify(item.snippet)} */}
                <Link href={ method === 'searchchannelname' ? `./channel?id=${item.snippet.channelId}` : `./playlist?id=${item.id.playlistId}` }>
                  <a>
                    <h3 className={`text-2xl text-red-600 hover:underline`}>
                      {item.snippet.title}
                    </h3>
                  </a>
                </Link>
                <div>
                  {item.snippet.description}
                </div>
                <div className={`mt-auto text-gray-500`}>
                  Created at: {item.snippet.publishTime}
                </div>
              </div>
            </div>)}
          </div>
        }
      </div>
    </div>
  );
}
