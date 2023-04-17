// lrc (String) - lrc file text
function parseLyric(lrc) {
    const regex = /^\[(?<time>\d{2}:\d{2}(.\d{2})?)\](?<text>.*)/;

    // split lrc string to individual lines
    const lines = lrc.split("\n");

    const output = [];

    lines.forEach(line => {
        line = line.trim();
        const match = line.match(regex);

        // if doesn't match, return.
        if (match == null) return;

        const { time, text } = match.groups;

        output.push({
            time: parseTime(time),
            text: text.trim()
        });
    });

    // parse formated time
    // "03:24.73" => 204.73 (total time in seconds)
    function parseTime(time) {
        const minsec = time.split(":");

        const min = parseInt(minsec[0]) * 60;
        const sec = parseFloat(minsec[1]);

        return min + sec;
    }

    return output;
}

// lyrics (Array) - output from parseLyric function
// time (Number) - current time from audio player
function syncLyric(lyrics, time) {
    const scores = [];

    lyrics.forEach(lyric => {
        // get the gap or distance or we call it score
        const score = time - lyric.time;

        // only accept score with positive values
        if (score >= 0) scores.push(score);
    });

    if (scores.length == 0) return null;

    // get the smallest value from scores
    const closest = Math.min(...scores);

    // return the index of closest lyric
    return scores.indexOf(closest);
}

window.onload = function main() {
    "use strict";

    

    // load lrc file
    // const res = await fetch("audio/singing/lyric.lrc", {
    //     method: 'GET',
    //   });
    // const lrc = await res.text();

    const lrc = `[00:03.13]When I was young
    [00:04.38]I'd listen to the radio
    [00:08.88]Waitin' for my favorite songs
    [00:14.64]When they played I'd sing along
    [00:19.39]It made me smile.
    [00:25.88]Those were such happy times
    [00:29.13]And not so long ago
    [00:32.13]How I wondered where they'd gone
    [00:37.38]But they're back again
    [00:40.63]Just like a long lost friend
    [00:44.13]All the songs I loved so well.
    [00:49.13]Every Sha-la-la-la
    [00:52.89]Every Wo-o-wo-o
    [00:55.63]Still shines
    [01:01.38]Every shing-a-ling-a-ling
    [01:04.38]That they're startin' to sing's
    [01:07.13]So fine.
    [01:12.88]When they get to the part
    [01:15.63]Where he's breakin' her heart
    [01:18.38]It can really make me cry
    [01:23.13]Just like before
    [01:29.38]It's yesterday once more.
    [01:41.88]Lookin' back on how it was
    [01:45.13]In years gone by
    [01:47.88]And the good times that I had
    [01:53.63]Makes today seem rather sad
    [01:58.38]So much has changed.
    [02:05.39]It was songs of love that
    [02:08.39]I would sing to then
    [02:11.13]And I'd memorize each word
    [02:16.38]Those old melodies
    [02:19.63]Still sound so good to me
    [02:22.88]As they melt the years away.
    [02:27.88]Every Sha-la-la-la
    [02:31.38]Every Wo-o-wo-o
    [02:34.38]Still shines
    [02:39.88]Every shing-a-ling-a-ling
    [02:42.88]That they're startin' to sing's
    [02:45.63]So fine.
    [02:51.38]All my best memories
    [02:54.15]Come back clearly to me
    [02:56.88]Some can even make me cry.
    [03:01.38]Just like before
    [03:07.63]It's yesterday once more.
    `
    const lyrics = parseLyric(lrc);

    const dom = {
        lyric1: document.querySelector(".lyric1"),
        player1: document.querySelector(".player1"),
        lyric2: document.querySelector(".lyric2"),
        player2: document.querySelector(".player2"),
        lyric3: document.querySelector(".lyric3"),
        player3: document.querySelector(".player3"),
    };
    dom.lyric1.innerHTML = lyrics[0].text;
    
    dom.player1.ontimeupdate = () => {
        const time = dom.player1.currentTime;
        const index = syncLyric(lyrics, time);

        if (index == null) return;

        dom.lyric1.innerHTML = lyrics[index].text;
    };

    dom.lyric2.innerHTML = lyrics[0].text;
    dom.player2.ontimeupdate = () => {
        const time = dom.player2.currentTime;
        const index = syncLyric(lyrics, time);

        if (index == null) return;

        dom.lyric2.innerHTML = lyrics[index].text;
    };

    dom.lyric3.innerHTML = lyrics[0].text;
    dom.player3.ontimeupdate = () => {
        const time = dom.player3.currentTime;
        const index = syncLyric(lyrics, time);

        if (index == null) return;

        dom.lyric3.innerHTML = lyrics[index].text;
    };

};