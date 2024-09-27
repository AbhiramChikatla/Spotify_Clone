let currentSong = new Audio();
let songs;
let currFolder;
function secondsToMinutesSeconds(seconds) {
    // Calculate minutes and remaining seconds
    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = Math.floor(seconds % 60);

    // Add leading zeros if needed
    var minutesStr = minutes < 10 ? "0" + minutes : minutes;
    var secondsStr =
        remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds;

    // Combine minutes and seconds in the format "00:00"
    var formattedTime = minutesStr + ":" + secondsStr;

    return formattedTime;
}

async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`${folder}/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1]);
            // songs.push(element.href.split("-")[1]); //works good for naa songs extension
        }
    }
    let songUl = document
        .querySelector(".songsList")
        .getElementsByTagName("ul")[0];
    songUl.innerHTML = " ";
    for (const song of songs) {
        songUl.innerHTML =
            songUl.innerHTML +
            `<li> <img src="images/music.svg" alt="" class="invert">
                        <div class="info">
                            <div>${song.replaceAll("%20", " ")}</div>
                            <div>isongs</div>
                        </div>
                        <div class="playNow">
                            <span>Play Now</span>
                            <img src="images/play.svg" alt="" class="invert">
                        </div>
                    </li>`;
    }
    // var audio = new Audio(songs[0]);
    // // audio.play();
    // audio.addEventListener("loadeddata", () => {
    //     let duration = audio.duration;
    //     console.log(duration, audio.currentTime, audio.currentSrc);
    // });

    Array.from(
        document.querySelector(".songsList").getElementsByTagName("li")
    ).forEach((e) => {
        e.addEventListener("click", (element) => {
            playMusic(e.querySelector(".info>div").innerHTML.trim());
        });
    });
    return songs;
}

const playMusic = (track, pause = false) => {
    // let audio=new Audio("/songs/"+track)
    // currentSong.src = `/${folder}/` + track;
    // console.log(`${currFolder}/`);
    // console.log( `/${currFolder}/` + track);

    currentSong.src = `${currFolder}/` + track;
    if (!pause) {
        currentSong.play();
        playele.src = "images/pause.svg";
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00/00:00";
};

async function displayAlbums() {
    let a = await fetch(`/songs/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a");
    let array = Array.from(anchors);
    for (let index = 0; index < array.length; index++) {
        const e = array[index];

        if (e.href.includes("/songs") && !e.href.includes(".htaccess")) {
            let folder = e.href.split("/").slice(-2)[0];
            let a = await fetch(`songs/${folder}/info.json`);
            let response = await a.json();
            let cardContainer = document.querySelector(".cardContainer");
            console.log(response);
            cardContainer.innerHTML =
                cardContainer.innerHTML +
                `<div class="card" data-folder="${folder}">
            <div class="play" >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    class="injected-svg"
                    data-src="/icons/play-stroke-rounded.svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                    role="img"
                    color="#000000"
                >
                    <path
                        d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z"
                        stroke="#000000"
                        stroke-width="1.5"
                        stroke-linejoin="round"
                    ></path>
                </svg>
            </div>
            <img
                src="/songs/${folder}/cover.jpeg"
            />
            <h3>${response.title}</h3>
            <p>
                ${response.description}
            </p>
        </div>`;
        }
    }
    Array.from(document.getElementsByClassName("card")).forEach((element) => {
        element.addEventListener("click", async (item) => {
            console.log(item, item.currentTarget.dataset.folder);
            songs = await getSongs(
                `songs/${item.currentTarget.dataset.folder}`
            );
            playMusic(songs[0]);
        });
    });
}

async function main() {
    await getSongs("songs/cs");
    // await getSongs();
    console.log(songs[0]);
    playMusic(songs[0], true);

    displayAlbums();

    playele.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            playele.src = "images/pause.svg";
        } else {
            currentSong.pause();
            playele.src = "images/play.svg";
        }
    });

    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(
            ".songtime"
        ).innerHTML = `${secondsToMinutesSeconds(
            currentSong.currentTime
        )}/${secondsToMinutesSeconds(currentSong.duration)}`;
        document.querySelector(".circle").style.left =
            (currentSong.currentTime / currentSong.duration) * 100 + "%";
    });

    document.querySelector(".seekbar").addEventListener("click", (e) => {
        let percent =
            (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = (currentSong.duration * percent) / 100;
    });

    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    });
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-135%";
    });

    previous.addEventListener("click", () => {
        let index = songs.indexOf(currentSong.src.split(`${currFolder}/`)[1]);
        if (index - 1 >= 0) {
            playMusic(songs[index - 1]);
        }
    });
    next.addEventListener("click", () => {
        let index = songs.indexOf(currentSong.src.split(`${currFolder}/`)[1]);
        if (index + 1 < songs.length) {
            playMusic(songs[index + 1]);
        }
    });
    document
        .querySelector(".range")
        .getElementsByTagName("input")[0]
        .addEventListener("change", (e) => {
            // console.log(e,e.target,e.target.value);
            currentSong.volume = e.target.value / 100;
            if (currentSong.volume > 0) {
                document.querySelector(".volume>img").src = document
                    .querySelector(".volume>img")
                    .src.replace("mute.svg", "volume.svg");
            }
            else if (currentSong.volume==0) {
                document.querySelector(".volume>img").src = document
                    .querySelector(".volume>img")
                    .src.replace("volume.svg", "mute.svg");
                
            }
        });

    document.querySelector(".volume>img").addEventListener("click", (e) => {
        // let source=e.target.src.split("/").splice(-1)[0]);
        if (e.target.src.includes("volume.svg")) {
            e.target.src = e.target.src.replace("volume.svg", "mute.svg");
            currentSong.volume = 0;
            document
                .querySelector(".range")
                .getElementsByTagName("input")[0].value = 0;
        } else {
            e.target.src = e.target.src.replace("mute.svg", "volume.svg");
            currentSong.volume = 0.1;
            document
                .querySelector(".range")
                .getElementsByTagName("input")[0].value = 10;
        }
    });
}
main();
