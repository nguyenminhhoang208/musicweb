const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const $class = document.getElementsByClassName.bind(document)
const $id = document.getElementById.bind(document)

// api
const playListsApi = 'http://localhost:3000/playLists'
const addMusic = 'http://localhost:3000/addMusic'

// const playListsApi = 'http://localhost:3000/addMusic'

// get tag no-rerender
const audioWrapper = $id('audio-wrapper')
const dashboardMusicName = $('.dashboard .music_name')
const dashboardMusicDisc = $('.dashboard .music_disc-wrapper')
const musicTimeTag = $id('music_time')

// get btn
const repeatBtn = $id('repeat-btn')
const shuffleBtn = $id('shuffle-btn')
const nextBtn = $id('next-btn')
const beforeBtn = $id('before-btn')
const playBtn = $id('play-btn')
const pauseBtn = $id('pause-btn')

// global variable
let playLists
let playListsLength
let playListId =[]  

let musicsPlayed = [0]



const App = {
    GetApi: (api, callback)=>{
        fetch(api)
            .then(res => res.json())
            .then(data=> callback(data))
    },
   
    RenderPlaylists: function(data){
        const musicLists = $('#music_lists')
        playLists = data.map((current,index)=>{
            current.idElement = index
            playListId.push(index)
            return current
        })
        playListsLength = playLists.length

        App.SetDiscMusicNoAutoPlay( 0,playLists[0].musicName,playLists[0].image,playLists[0].music)
        const  musicListsHTML =  playLists.map((curr,index) =>{
            if(index === 0)
            {
                return (
                    `
                    <li id="${curr.idElement}"  class="music playing" > 
                  
                        <div class="music-content" onclick="App.SetPlayMusic(${curr.idElement},'${curr.image}','${curr.musicName}','${curr.music}',)">
                            <img class="music_image" src="${curr.image}" alt="ảnh bài hát">
                            <div class="describe">
                                <h3 class="music_name">${curr.musicName}</h3>
                                <p class="music_author">${curr.creator}</p>
                            </div>
                        </div>
        
                        <div class="sounds ">
                            <div class="sound sound-1"></div>
                            <div class="sound sound-2"></div>
                            <div class="sound sound-3"></div>
                        </div>
                    
                        <div class="remove" onclick="App.HandleRemoveMusic(${curr.id},${curr.idElement})">
                            <i class="fa-solid fa-xmark icon"></i>
                        </div>
                    </li>
                        `
                    )
            }
            else{
                return (
                    `
                    <li id="${curr.idElement}"  class="music" > 
                  
                        <div class="music-content" onclick="App.SetPlayMusic(${curr.idElement},'${curr.image}','${curr.musicName}','${curr.music}',)">
                            <img class="music_image" src="${curr.image}" alt="ảnh bài hát">
                            <div class="describe">
                                <h3 class="music_name">${curr.musicName}</h3>
                                <p class="music_author">${curr.creator}</p>
                            </div>
                        </div>
        
                        <div class="sounds ">
                            <div class="sound sound-1"></div>
                            <div class="sound sound-2"></div>
                            <div class="sound sound-3"></div>
                        </div>
                    
                        <div class="remove" onclick="App.HandleRemoveMusic(${curr.id},${curr.idElement})">
                            <i class="fa-solid fa-xmark icon"></i>
                        </div>
                    </li>
                        `
                    )
            }

        })
        musicLists.innerHTML = musicListsHTML.join('')
    },

    Render: function(api,callback){
        this.GetApi(api,callback)
        return new Promise((resolve,reject)=>{
           
            setTimeout(()=>{
                resolve();
            ;} , 1000
            );

        });
    },
    SetDiscMusic: function( idElement,musicName,image,music){
        // console.log($class('playing')[0].id); // lấy class nên trả ra một HTMLcollection
        dashboardMusicName.innerText = musicName
        dashboardMusicDisc.innerHTML = `<img id="music_disc" class="music_disc" src="${image}" />`
        audioWrapper.innerHTML = `<audio autoplay id='audio_${idElement}' class="audio" name="audioMusic" src="${music}"></audio>`
    },

    SetDiscMusicNoAutoPlay: function( idElement,musicName,image,music){
        dashboardMusicName.innerText = musicName
        dashboardMusicDisc.innerHTML = `<img id="music_disc" class="music_disc" src="${image}" />`
        audioWrapper.innerHTML = `<audio  id='audio_${idElement}' class="audio" name="audioMusic" src="${music}"></audio>`
    },
    // xếp thứ tự phát
    SetPlayOderShuffle: function(){
        let i = 0;
        while(i < playListsLength - 1)
        {
            let musicIdRandom = Math.floor(Math.random()*playListsLength)
            if(!musicsPlayed.some((musicPlayed)=>{
                return musicPlayed === musicIdRandom;
            }))
            {
                musicsPlayed.push(musicIdRandom)
                i++
            }
        }
    },

    SetShuffleMusic: function(){
        if(!repeatBtn.classList.contains('active'))
        {
            this.SetPlayOderShuffle()
        }
    },


    GetMusicPlayingIdElement: function(){
        const musicPlaying = $class('playing')[0]
        return parseInt(musicPlaying.id);
       
    },

    GetMusicPlayingIndex: function(musicPlayingId,playlist){
        
        let musicPlayingIndex;  
        playlist.forEach((curr,index)=>{
            if(curr === musicPlayingId)
            {
                musicPlayingIndex = index
            }
        })    
        return musicPlayingIndex;
    },
    SetPlayNextMusic: function(){
        const musicPlayingId = this.GetMusicPlayingIdElement()
            if(shuffleBtn.classList.contains('active'))
            {
                const musicPlayingIndex = this.GetMusicPlayingIndex(musicPlayingId,musicsPlayed)
                if(musicPlayingIndex < playListsLength - 1){
                    
                    const nextMusicIndex = musicsPlayed[musicPlayingIndex + 1]
                    this.SetPlayMusic(nextMusicIndex,playLists[nextMusicIndex].image,playLists[nextMusicIndex].musicName,playLists[nextMusicIndex].music)
                }
            }
            else{
                const musicPlayingIndex = this.GetMusicPlayingIndex(musicPlayingId,playListId)
                if(musicPlayingIndex < playListsLength - 1){
                    
                    const nextMusicIndex = playListId[musicPlayingIndex + 1]
                    this.SetPlayMusic(nextMusicIndex,playLists[nextMusicIndex].image,playLists[nextMusicIndex].musicName,playLists[nextMusicIndex].music)
                }
            }
    },

    SetPlayBeforeMusic: function(){
        const musicPlayingId = this.GetMusicPlayingIdElement()
            if(shuffleBtn.classList.contains('active'))
            {
                const musicPlayingIndex = this.GetMusicPlayingIndex(musicPlayingId,musicsPlayed)
                if(musicPlayingIndex > 0){
                    const beforeMusicIndex = musicsPlayed[musicPlayingIndex - 1]
                    this.SetPlayMusic(beforeMusicIndex,playLists[beforeMusicIndex].image,playLists[beforeMusicIndex].musicName,playLists[beforeMusicIndex].music)
                }
            }
            else{
                const musicPlayingIndex = this.GetMusicPlayingIndex(musicPlayingId,playListId)
                if(musicPlayingIndex > 0){
                    
                    const beforeMusicIndex = playListId[musicPlayingIndex - 1]
                    this.SetPlayMusic(beforeMusicIndex,playLists[beforeMusicIndex].image,playLists[beforeMusicIndex].musicName,playLists[beforeMusicIndex].music)
            }
            }

    },

    SetRepeatMusic: function(){
        // console.log(repeatBtn.classList.contains('active'))
            if(repeatBtn.classList.contains('active'))
            {
                const audioTag =  $('audio[name="audioMusic"]')
                // console.log(audioTag)
                audioTag.loop = true
            }
            else{
                const audioTag =  $('audio[name="audioMusic"]')
                audioTag.loop = false
            }
    },
    SetPlayMusic: function(index,image,musicName,music){
        // set disc music
        this.SetDiscMusic(index,musicName,image,music)
        this.SetRepeatMusic()
        this.HandlePlayingMusic()


        // set class playing
        const musics = $class('music')
        const musicsLength = musics.length
        for(let i = 0; i < musicsLength ; i++)
        {
            musics[i].classList.remove('playing')
        }
        $id(index).classList.add('playing')
        // console.log($class('playing')[0].id); // lấy class nên trả ra một HTMLcollection
    },

   

    SetAnimationOnPlay: function(){
        const musicDisc = $id('music_disc')
        musicDisc.style.animationPlayState = 'inherit'
        const sounds = $$('.music.playing .sound')
        for(let sound of sounds )
        {
            sound.style.animationPlayState = 'inherit'
        }
    }, 
    PauseAnimationOnPlay: function(){
        const musicDisc = $id('music_disc')
        musicDisc.style.animationPlayState = 'paused'

        const sounds = $$('.music.playing .sound')
        for(let sound of sounds )
        {
            sound.style.animationPlayState = 'paused'
        }
    }, 

     // tiến độ bài hát
     HandleMusicTime:()=>{
        const audio = $('audio[name="audioMusic"]')
        audio.ontimeupdate = ()=>{
            $id('music_time').value = Math.floor((audio.currentTime / audio.duration) * 100)
        }
        //tua
        $id('music_time').onchange = (e)=>{
            audio.currentTime = e.target.value / 100 * audio.duration
        }
    },

    // xử lý phát nhạc
    HandleBtnsControl: function(){
        let audioTag
        // phát nhạc
        playBtn.addEventListener('click',()=>{
            audioTag = $('audio[name="audioMusic"]')
            audioTag.play()
            playBtn.classList.remove('show')
            pauseBtn.classList.add('show')
        })

        // tạm dừng
        pauseBtn.addEventListener('click',()=>{
            audioTag = $('audio[name="audioMusic"]')
            audioTag.pause()
            pauseBtn.classList.remove('show')
            playBtn.classList.add('show')
        })
        //phát bài trước
        beforeBtn.addEventListener('click',()=>{
            this.SetPlayBeforeMusic()
        })

        //phát bài tiếp theo
        nextBtn.addEventListener('click',()=>{
            this.SetPlayNextMusic()
        })

        // phát lại
        repeatBtn.addEventListener('click',()=>{
            repeatBtn.classList.toggle('active')
            this.SetRepeatMusic()
        })
        // phát ngẫu nhiên 
        shuffleBtn.addEventListener('click',()=>{
            shuffleBtn.classList.toggle('active')
            if(shuffleBtn.classList.contains('active'))
            {
                const idPlaying = this.GetMusicPlayingIdElement()
                const musicsPlayedNull = [idPlaying]
                musicsPlayed = [...musicsPlayedNull]
                this.SetShuffleMusic()
            }
            else{
                const musicsPlayedNull = []
                musicsPlayed = [...musicsPlayedNull]
            }
        })
        
    },
    
    HandleRemoveMusic: function(id,index){
        const removeElement = $id(`${index}`)
        // console.log(removeElement)
        removeElement.remove();

        playLists = playLists.filter((e,i) => {
            return i!==index;
        });

        console.log(playLists);

        // fetch(playListsApi + '/' + id,
        // {
        //     method: 'DELETE', 
        //     headers: {
        //       'Content-Type': 'application/json',
        //     },

        // })
        //     .then(res => res.json()) // or res.json()
        //     .then(() =>{
        //         const removeElement = $id(`${index}`)
        //         console.log(removeElement)
        //         // removeElement.remove();

        //     })
    },

    HandlePlayingMusic: function(){
        const audioTag = $('audio[name="audioMusic"]')
        audioTag.onplay = ()=>{
            playBtn.classList.remove('show')
            pauseBtn.classList.add('show')
            this.HandleMusicTime()
            this.SetAnimationOnPlay()
        }
    
        audioTag.onpause = ()=>{
            pauseBtn.classList.remove('show')
            playBtn.classList.add('show')
            this.PauseAnimationOnPlay()
        }
        audioTag.onended = ()=>{
            if(!audioTag.loop)
            {
                this.SetPlayNextMusic()
            }
        }
    },
   
    Start: async function(){
         await this.Render(playListsApi, this.RenderPlaylists);
        // đợi render xong mới thực hiện
        this.HandleMusicTime()
        this.HandlePlayingMusic()
        this.HandleBtnsControl()
    }
}

App.Start();
