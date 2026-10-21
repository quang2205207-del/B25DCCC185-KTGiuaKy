export interface StoryArtwork {
  src: string;
  alt: string;
  source: string;
  sourceLabel?: string;
  credit?: string;
  license?: string;
  licenseUrl?: string;
}

export const STORY_ARTWORK: Record<number, StoryArtwork> = {
  1: {
    src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/ca/ThanhGiong_statue_2.jpg/960px-ThanhGiong_statue_2.jpg",
    alt: "Tượng đài Thánh Gióng",
    source: "https://commons.wikimedia.org/wiki/File:ThanhGiong_statue_2.jpg",
  },
  2: {
    src: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Hai_Ba_Trung_statue_in_HCMC.JPG",
    alt: "Tượng Hai Bà Trưng",
    source: "https://commons.wikimedia.org/wiki/File:Hai_Ba_Trung_statue_in_HCMC.JPG",
  },
  3: {
    src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/01/Newone_-_t%C6%B0%E1%BB%A3ng_B%C3%A0_Tri%E1%BB%87u_n%C3%BAi_N%C6%B0a.jpg/960px-Newone_-_t%C6%B0%E1%BB%A3ng_B%C3%A0_Tri%E1%BB%87u_n%C3%BAi_N%C6%B0a.jpg",
    alt: "Tượng Bà Triệu ở núi Nưa",
    source: "https://commons.wikimedia.org/wiki/File:Newone_-_t%C6%B0%E1%BB%A3ng_B%C3%A0_Tri%E1%BB%87u_n%C3%BAi_N%C6%B0a.jpg",
  },
  4: {
    src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/95/Statue_of_Tran_Hung_Dao_at_Me_Linh_Square.jpg/960px-Statue_of_Tran_Hung_Dao_at_Me_Linh_Square.jpg",
    alt: "Tượng Trần Hưng Đạo tại quảng trường Mê Linh",
    source: "https://commons.wikimedia.org/wiki/File:Statue_of_Tran_Hung_Dao_at_Me_Linh_Square.jpg",
  },
  5: {
    src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2aaca2iafm0ZcyNtdOamlcFApo1jE6dR9RJhUgIFdBGoNhqunnzLNY6A&s=10",
    alt: "Tượng Trần Quốc Toản",
    source: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2aaca2iafm0ZcyNtdOamlcFApo1jE6dR9RJhUgIFdBGoNhqunnzLNY6A&s=10",
    sourceLabel: "Ảnh bạn cung cấp",
  },
  6: {
    src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/78/Ly_Thuong_Kiet_%281019-1105%29_Defeated_Song_China_Invasion_of_1077_%289732106811%29.jpg/960px-Ly_Thuong_Kiet_%281019-1105%29_Defeated_Song_China_Invasion_of_1077_%289732106811%29.jpg",
    alt: "Hình tượng Lý Thường Kiệt",
    source: "https://commons.wikimedia.org/wiki/File:Ly_Thuong_Kiet_(1019-1105)_Defeated_Song_China_Invasion_of_1077_(9732106811).jpg",
  },
  7: {
    src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c6/Statue_of_Nguyen_Trai.jpg/960px-Statue_of_Nguyen_Trai.jpg",
    alt: "Tượng Nguyễn Trãi",
    source: "https://commons.wikimedia.org/wiki/File:Statue_of_Nguyen_Trai.jpg",
  },
  8: {
    src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8d/Hu%E1%BA%BF_-_Quang_Trung_Statue%2C_Ban_Mountain_site.jpg/960px-Hu%E1%BA%BF_-_Quang_Trung_Statue%2C_Ban_Mountain_site.jpg",
    alt: "Tượng vua Quang Trung tại núi Bân",
    source: "https://commons.wikimedia.org/wiki/File:Hu%E1%BA%BF_-_Quang_Trung_Statue,_Ban_Mountain_site.jpg",
  },
  9: {
    src: "https://upload.wikimedia.org/wikipedia/commons/6/68/Vo_Thi_Sau_memorial.jpg",
    alt: "Đài tưởng niệm Võ Thị Sáu",
    source: "https://commons.wikimedia.org/wiki/File:Vo_Thi_Sau_memorial.jpg",
  },
  10: {
    src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/74/Nguyen_Trung_Truc_statue.jpg/960px-Nguyen_Trung_Truc_statue.jpg",
    alt: "Tượng Nguyễn Trung Trực",
    source: "https://commons.wikimedia.org/wiki/File:Nguyen_Trung_Truc_statue.jpg",
  },
};
