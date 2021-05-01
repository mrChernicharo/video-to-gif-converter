import { BaseSyntheticEvent, useEffect, useState } from 'react';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

const ffmgep = createFFmpeg({ log: true });

export default function Home() {
  const [ready, setReady] = useState(false);
  const [video, setVideo] = useState();
  const [gif, setGif] = useState<string>();

  const load = async () => {
    await ffmgep.load();
    setReady(true);
  };

  function handleVideo(e: BaseSyntheticEvent) {
    console.log(e);
    setVideo(e.target.files?.item(0));
  }

  const convertToGif = async () => {
    // write file to memory
    ffmgep.FS('writeFile', 'test.mp4', await fetchFile(video));

    // run FFMpeg
    // -i -> input file | -t -> video time | -ss -> start seconds | -f -> file
    await ffmgep.run('-i', 'test.mp4', '-t', '2.5', '-ss', '2.0', '-f', 'gif', 'out.gif');

    // read result
    const data = ffmgep.FS('readFile', 'out.gif');

    // Create URL
    const url = URL.createObjectURL(new Blob([data.buffer], { type: 'image/gif' }));
    setGif(url);
  };

  useEffect(() => {
    load();
  }, []);

  return !ready ? (
    <p>Loading...</p>
  ) : (
    <div>
      <h1>Super gif converter</h1>

      <div>
        <input type="file" onChange={handleVideo} />
      </div>

      {video && <video controls width="600px" src={URL.createObjectURL(video)}></video>}

      <div>
        <button type="button" onClick={convertToGif}>
          Convert
        </button>
      </div>

      {gif && <img src={gif} />}
    </div>
  );
}
