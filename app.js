const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const cd = $(".cd");
const cdWidth = cd.offsetWidth;
const playBtn = $(".btn-toggle-play");
const player = $(".player");
const progress = $(".progress");
const nextSong = $(".btn-next");
const prevSong = $(".btn-prev");
const random = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const playlist = $(".playlist");

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  songs: [
    {
      name: "Dong kiem em",
      singer: "Thai Vu",
      path: "./music/DongKiemEm-ThaiVu-4373753.mp3",
      image: "./img/Vũ.jpg",
    },
    {
      name: "Nang tho",
      singer: "Hoang Dung",
      path: "./music/NangTho-HoangDung-6413381.mp3",
      image: "./img/Hoàng dũng.jpg",
    },
    {
      name: "Cho anh nhe",
      singer: "Hoang Dung",
      path: "./music/ChoAnhNhe-HoangDungHoangRob-4475500.mp3",
      image: "./img/Hoàng dũng.jpg",
    },
    {
      name: "Em hat ai nghe",
      singer: "Orange",
      path: "./music/EmHatAiNgheOrinnEDMRemix-Orange-7073768.mp3",
      image: "./img/Orange.jpg",
    },
    {
      name: "Hay trao cho anh",
      singer: "Son Tung MTP",
      path: "./music/HayTraoChoAnh-SonTungMTPSnoopDogg-6010660.mp3",
      image: "./img/Sơn tùng.jpg",
    },
    {
      name: "Yeu dung so dau",
      singer: "Ngo Lan Huong",
      path: "./music/YeuDungSoDauOrinnEDMRemix-NgoLanHuong-7105360.mp3",
      image: "./img/NgoLanHuong.jpg",
    },
    {
      name: "Duong toi cho em ve",
      singer: "Bui Truong Linh",
      path: "./music/DuongToiChoEmVeLofiVersion-buitruonglinhFreakD-7025960_hq.mp3",
      image: "./img/BuiTruongLing.jpg",
    },
  ],
  render: function () {
    const htmls = this.songs.map((song, index) => {
      return `
        <div class="song ${
          index === this.currentIndex ? "active" : ""
        }" data-index =" ${index}">
        <div
          class="thumb"
          style="
            background-image: url('${song.image}');
          "
        ></div>
        <div class="body">
          <h3 class="title">${song.name}</h3>
          <p class="author">${song.singer}</p>
        </div>
        <div class="option">
          <i class="fas fa-ellipsis-h"></i>
        </div>
      </div>
        `;
    });
    playlist.innerHTML = htmls.join("");
  },
  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },
  handleEvent: function () {
    const _this = this;

    //Xử lý CD quay
    const cdThumbAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
      duration: 100000,
      iteration: Infinity,
    });
    cdThumbAnimate.pause();
    // Xử lý phóng to thu nhỏ
    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newCdWidth = cdWidth - scrollTop;

      cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
    };
    //Xử lý khi play
    playBtn.onclick = function () {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      // Khi song được play
      audio.onplay = function () {
        _this.isPlaying = true;
        player.classList.add("playing");
        cdThumbAnimate.play();
      };
      audio.onpause = function () {
        _this.isPlaying = false;
        player.classList.remove("playing");
        cdThumbAnimate.pause();
      };
    };
    //Khi tiến độ bài hát thay đổi
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercent = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );
        progress.value = progressPercent;
      }
    };
    //Khi tua song
    progress.onchange = function (e) {
      const seek = (audio.duration / 100) * e.target.value;
      audio.currentTime = seek;
    };
    //Khi next bai moi
    nextSong.onclick = function () {
      if (_this.isRandom) {
        _this.randomSong();
      } else {
        _this.nextSong();
      }
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    };
    prevSong.onclick = function () {
      if (_this.isRandom) {
        _this.randomSong();
      } else {
        _this.prevSong();
      }
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    };
    //khi click vaof button random
    random.onclick = function () {
      _this.isRandom = !_this.isRandom;
      random.classList.toggle("active", _this.isRandom);
    };
    // Xử lý khi kết thúc bài
    audio.onended = function () {
      if (_this.isRepeat) {
        audio.play();
      } else {
        nextSong.click();
      }
    };
    // Xử lý khi repeat
    repeatBtn.onclick = function () {
      _this.isRepeat = !_this.isRepeat;
      repeatBtn.classList.toggle("active", _this.isRepeat);
    };
    //Khi click vào từng bài
    playlist.onclick = function (e) {
      const songNode = e.target.closest(".song:not(.active)");
      if (songNode || e.target.closest(".option")) {
        if (songNode) {
          _this.currentIndex = Number(songNode.dataset.index);
          _this.loadCurrentSong();
          _this.render();
          audio.play();
        }
      }
    };
  },
  scrollToActiveSong: function () {
    setTimeout(() => {
      $(".song.active").scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 300);
  },
  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;
  },
  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },
  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },
  randomSong: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (newIndex === this.currentIndex);
    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },
  start: function () {
    //Định Nghĩa các thuộc tính cho Object
    this.defineProperties();

    //Lắng nghe xử lý các sự kiến (DOM event)
    this.handleEvent();

    //Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
    this.loadCurrentSong();

    //Render playlist
    this.render();
  },
};
app.start();
